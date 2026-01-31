import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Eye, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAppliedListApi,
  changeApplicationStatusApi,
  getSummaryCountApi,
  downloadApplicationApi
} from '../../api/api';
import Loader from '../../components/Loader';

function CareerApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    underReview: 0,
    shortlisted: 0,
    newToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [applicationsRes, summaryRes] = await Promise.all([
        getAppliedListApi(),
        getSummaryCountApi()
      ]);
      setApplications(applicationsRes.applications || []);
      setSummary({
        total: summaryRes.total || 0,
        underReview: summaryRes.underReview || 0,
        shortlisted: summaryRes.shortlisted || 0,
        newToday: summaryRes.newToday || 0
      });
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await changeApplicationStatusApi(applicationId, { status: newStatus });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error(error || 'Status update failed');
    }
  };

  const handleDownload = async (applicationId, resumeName) => {
    try {
      const blob = await downloadApplicationApi(applicationId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = resumeName || 'resume.pdf';
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded');
    } catch (error) {
      toast.error(error || 'Download failed');
    }
  };

  const filteredApplications = applications.filter(app =>
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.jobId?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'NEW': 'bg-blue-100 text-blue-800',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
      'SHORTLISTED': 'bg-purple-100 text-purple-800',
      'INTERVIEW_SCHEDULED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const statusOptions = [
    'NEW',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'REJECTED'
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Career Applications</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and review job applications</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25b485]"
              placeholder="Search applications..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-[#25b485] font-medium">Total Applications</p>
            <p className="text-2xl font-bold text-[#25b485] mt-1">{summary.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Under Review</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">{summary.underReview}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Shortlisted</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{summary.shortlisted}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">New Today</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">{summary.newToday}</p>
          </div>
        </div>

        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied For
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {filteredApplications.map((application, index) => (
                    <motion.tr
                      key={application._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-[#25b485] font-medium">
                            {application.fullName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {application.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.jobId?.title || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{application.experience}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(application.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application._id, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusColor(application.status)}`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-gray-600 hover:text-gray-900 mr-3"
                          title="View Details"
                          onClick={() => window.open(application.resumeUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4 inline" />
                        </button>
                        <button
                          className="text-[#25b485] hover:text-[#219972]"
                          title="Download Resume"
                          onClick={() => handleDownload(application._id, application.resumeName)}
                        >
                          <Download className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default CareerApplications;
