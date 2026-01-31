import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignIn from './pages/auth/SignIn';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import PortfolioCategories from './pages/portfolio/PortfolioCategories';
import CreatePortfolio from './pages/portfolio/CreatePortfolio';
import CreateJob from './pages/jobs/CreateJob';
import CareerApplications from './pages/jobs/CareerApplications';
import BlogCategories from './pages/blogs/BlogCategories';
import BlogTags from './pages/blogs/BlogTags';
import CreateBlog from './pages/blogs/CreateBlog';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';


function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="portfolio/categories" element={<PortfolioCategories />} />
          <Route path="portfolio/create" element={<CreatePortfolio />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/applications" element={<CareerApplications />} />
          <Route path="blogs/categories" element={<BlogCategories />} />
          <Route path="blogs/tags" element={<BlogTags />} />
          <Route path="blogs/create" element={<CreateBlog />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;