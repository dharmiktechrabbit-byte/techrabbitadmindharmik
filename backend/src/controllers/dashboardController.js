const Portfolio = require("../models/portfolioModels");
const Job = require("../models/jobModels");
const Blog = require("../models/blogModels");
const JobApplication = require("../models/jobApplicationModels");

// helper: start/end of month
const getMonthRange = (year, month) => {
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 1, 0, 0, 0);
  return { start, end };
};

const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const { start: currentStart, end: currentEnd } = getMonthRange(
      currentYear,
      currentMonth
    );

    // ✅ last month (handles Jan correctly)
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    const { start: lastStart, end: lastEnd } = getMonthRange(lastYear, lastMonth);

    // ✅ total counts
    const [totalPortfolios, totalJobs, totalBlogs, totalApplications] =
      await Promise.all([
        Portfolio.countDocuments(),
        Job.countDocuments(),
        Blog.countDocuments(),
        JobApplication.countDocuments(),
      ]);

    // ✅ current month counts
    const [
      currentMonthPortfolios,
      currentMonthJobs,
      currentMonthBlogs,
      currentMonthApplications,
    ] = await Promise.all([
      Portfolio.countDocuments({ createdAt: { $gte: currentStart, $lt: currentEnd } }),
      Job.countDocuments({ createdAt: { $gte: currentStart, $lt: currentEnd } }),
      Blog.countDocuments({ createdAt: { $gte: currentStart, $lt: currentEnd } }),
      JobApplication.countDocuments({ createdAt: { $gte: currentStart, $lt: currentEnd } }),
    ]);

    // ✅ last month counts
    const [
      lastMonthPortfolios,
      lastMonthJobs,
      lastMonthBlogs,
      lastMonthApplications,
    ] = await Promise.all([
      Portfolio.countDocuments({ createdAt: { $gte: lastStart, $lt: lastEnd } }),
      Job.countDocuments({ createdAt: { $gte: lastStart, $lt: lastEnd } }),
      Blog.countDocuments({ createdAt: { $gte: lastStart, $lt: lastEnd } }),
      JobApplication.countDocuments({ createdAt: { $gte: lastStart, $lt: lastEnd } }),
    ]);

    // ✅ difference (count)
    const portfolioDiff = currentMonthPortfolios - lastMonthPortfolios;
    const jobDiff = currentMonthJobs - lastMonthJobs;
    const blogDiff = currentMonthBlogs - lastMonthBlogs;
    const appDiff = currentMonthApplications - lastMonthApplications;

    return res.status(200).json({
      message: "Dashboard summary fetched ✅",
      cards: {
        totalPortfolios: {
          value: totalPortfolios,
          changeText: `${portfolioDiff >= 0 ? "+" : ""}${portfolioDiff}`,
        },
        totalJobs: {
          value: totalJobs,
          changeText: `${jobDiff >= 0 ? "+" : ""}${jobDiff}`,
        },
        totalBlogs: {
          value: totalBlogs,
          changeText: `${blogDiff >= 0 ? "+" : ""}${blogDiff}`,
        },
        totalApplications: {
          value: totalApplications,
          changeText: `${appDiff >= 0 ? "+" : ""}${appDiff}`,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Recent Activities API
const getDashboardRecentActivities = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const [recentApplications, recentPortfolios, recentBlogs, recentJobs] =
      await Promise.all([
        JobApplication.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .select("fullName jobId createdAt")
          .populate("jobId", "title"),

        Portfolio.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .select("projectName createdAt"),

        Blog.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .select("title createdAt status"),

        Job.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .select("title createdAt"),
      ]);

    // ✅ convert to one list (activities)
    const activities = [];

    recentApplications.forEach((a) => {
      activities.push({
        type: "APPLICATION",
        title: a.fullName,
        subtitle: `applied for ${a?.jobId?.title || "job"}`,
        createdAt: a.createdAt,
      });
    });

    recentPortfolios.forEach((p) => {
      activities.push({
        type: "PORTFOLIO",
        title: "New Project",
        subtitle: `${p.projectName} added`,
        createdAt: p.createdAt,
      });
    });

    recentBlogs.forEach((b) => {
      activities.push({
        type: "BLOG",
        title: b.title,
        subtitle:
          b.status === "PUBLISHED"
            ? "Published new blog post"
            : "Saved blog as draft",
        createdAt: b.createdAt,
      });
    });

    recentJobs.forEach((j) => {
      activities.push({
        type: "JOB",
        title: j.title,
        subtitle: "New job posted",
        createdAt: j.createdAt,
      });
    });

    // ✅ sort all activities latest first
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      message: "Recent activities fetched ✅",
      activities: activities.slice(0, limit),
    });
  } catch (error) {
    console.error("Recent Activities Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardRecentActivities,
};
