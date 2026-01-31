const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/admin", require("./src/routes/adminRoutes"));

app.use("/api/jobs", require("./src/routes/jobRoutes"));

app.use("/api/portfolios", require("./src/routes/portfolioRoutes"));

app.use(
  "/api/portfolio-categories",
  require("./src/routes/portfolioCategoryRoutes"),
);

app.use("/api/applications", require("./src/routes/jobApplicationRoutes"));

app.use("/api/blogs", require("./src/routes/blogRoutes"));

app.use("/api/blog-categories", require("./src/routes/blogCategoryRoutes"));

app.use("/api/blog-tags", require("./src/routes/blogTagRoutes"));

// public

app.use("/api/public", require("./src/routes/portfolioPublicRoutes"));

app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));

app.use("/api/public/blogs", require("./src/routes/blogPublicRoutes"));

app.use("/api/public/jobs", require("./src/routes/jobPublicRoutes"));


module.exports = app;
