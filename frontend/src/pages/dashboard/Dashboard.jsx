import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Eye,
  MessageSquare,
} from "lucide-react";

import {
  getDashboardSummaryApi,
  getDashboardRecentActivitiesApi,
} from "../../api/api";

function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Total Portfolios",
      value: "0",
      change: "+0%",
      icon: Briefcase,
      color: "bg-[#25b485]",
    },
    {
      title: "Total Jobs Posted",
      value: "0",
      change: "+0",
      icon: Users,
      color: "bg-[#25b485]",
    },
    {
      title: "Total Blog Posts",
      value: "0",
      change: "+0%",
      icon: FileText,
      color: "bg-[#25b485]",
    },
    {
      title: "Career Applications",
      value: "0",
      change: "+0",
      icon: TrendingUp,
      color: "bg-[#25b485]",
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardSummary();
    fetchRecentActivities();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const res = await getDashboardSummaryApi();
      const cards = res?.cards || {};

      setStats([
        {
          title: "Total Portfolios",
          value: String(cards?.totalPortfolios?.value || 0),
          change: cards?.totalPortfolios?.changeText || "+0%",
          icon: Briefcase,
          color: "bg-[#25b485]",
        },
        {
          title: "Total Jobs Posted",
          value: String(cards?.totalJobs?.value || 0),
          change: cards?.totalJobs?.changeText || "+0",
          icon: Users,
          color: "bg-[#25b485]",
        },
        {
          title: "Total Blog Posts",
          value: String(cards?.totalBlogs?.value || 0),
          change: cards?.totalBlogs?.changeText || "+0%",
          icon: FileText,
          color: "bg-[#25b485]",
        },
        {
          title: "Career Applications",
          value: String(cards?.totalApplications?.value || 0),
          change: cards?.totalApplications?.changeText || "+0",
          icon: TrendingUp,
          color: "bg-[#25b485]",
        },
      ]);
    } catch (error) {
      console.log("Dashboard Summary Error:", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const res = await getDashboardRecentActivitiesApi(5);

      // backend returns { activities: [] }
      const activities = res?.activities || [];

      // map backend structure -> UI structure
      const mapped = activities.map((a) => ({
        type: a.type?.toLowerCase(), // APPLICATION -> application
        name: a.title,
        action: a.subtitle,
        time: formatTimeAgo(a.createdAt),
      }));

      setRecentActivities(mapped);
    } catch (error) {
      console.log("Dashboard Recent Activities Error:", error);
    }
  };

  // ✅ time format (2 hours ago)
  const formatTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `Just now`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-green-600 mt-2 font-medium">
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Activities
            </h2>
            <button className="text-sm text-[#25b485] hover:text-[#219972] font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  {activity.type === "application" && (
                    <Users className="h-5 w-5 text-[#25b485]" />
                  )}
                  {activity.type === "portfolio" && (
                    <Briefcase className="h-5 w-5 text-[#25b485]" />
                  )}
                  {activity.type === "blog" && (
                    <FileText className="h-5 w-5 text-[#25b485]" />
                  )}
                  {activity.type === "job" && (
                    <TrendingUp className="h-5 w-5 text-[#25b485]" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.name}
                  </p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Page Views</span>
                </div>
                <span className="text-sm font-bold text-gray-900">12,458</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Comments</span>
                </div>
                <span className="text-sm font-bold text-gray-900">234</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Active Users</span>
                </div>
                <span className="text-sm font-bold text-gray-900">1,234</span>
              </div>
            </div>
          </div>

          <div className="card bg-[linear-gradient(135deg,#22d3ee,#2dd4bf,#34d399)] text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-primary-50 mb-4">
              Check out our documentation or contact support for assistance.
            </p>
            <button className="bg-white text-[#25b485] px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
              View Docs
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
