import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, Edit2, Trash2, Eye, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getPortfolioProjectsApi,
  createPortfolioProjectApi,
  updatePortfolioProjectApi,
  deletePortfolioProjectApi,
  getPortfolioCategoriesApi
} from '../../api/api';
import Loader from '../../components/Loader';
import DeleteModal from '../../components/DeleteModal';

function CreatePortfolio() {
  const [formData, setFormData] = useState({
    projectName: '',
    shortDescription: '',
    category: '',
    status: 'DRAFT'
  });
  const [projectLogo, setProjectLogo] = useState(null);
  const [projectImage, setProjectImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

  const logoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [portfoliosRes, categoriesRes] = await Promise.all([
        getPortfolioProjectsApi(),
        getPortfolioCategoriesApi()
      ]);
      setPortfolios(portfoliosRes.portfolios || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPortfolios = async () => {
    try {
      const response = await getPortfolioProjectsApi();
      setPortfolios(response.portfolios || []);
    } catch (error) {
      console.error('Failed to fetch portfolios');
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'logo') {
        setProjectLogo(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setProjectImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('projectName', formData.projectName);
      data.append('category', formData.category);
      data.append('shortDescription', formData.shortDescription);
      data.append('status', formData.status);

      if (projectLogo) data.append('projectLogo', projectLogo);
      if (projectImage) data.append('projectImage', projectImage);

      if (isEditing) {
        await updatePortfolioProjectApi(data, editId);
        toast.success('Portfolio updated successfully');
      } else {
        await createPortfolioProjectApi(data);
        toast.success('Portfolio created successfully');
      }
      resetForm();
      fetchPortfolios();
    } catch (error) {
      toast.error(error || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deletePortfolioProjectApi(deleteModal.id);
      toast.success('Portfolio deleted successfully');
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchPortfolios();
    } catch (error) {
      toast.error(error || 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (portfolio) => {
    setIsEditing(true);
    setEditId(portfolio._id);
    setFormData({
      projectName: portfolio.projectName,
      shortDescription: portfolio.shortDescription,
      category: portfolio.category, // Assuming category ID is returned or handled
      status: portfolio.status
    });
    setLogoPreview(portfolio.projectLogo);
    setImagePreview(portfolio.projectImage);
    setProjectLogo(null);
    setProjectImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      projectName: '',
      shortDescription: '',
      category: '',
      status: 'DRAFT'
    });
    setProjectLogo(null);
    setProjectImage(null);
    setLogoPreview(null);
    setImagePreview(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredPortfolios = portfolios.filter(p =>
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Portfolio' : 'Create New Portfolio'}
          </h2>
          {isEditing && (
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Project Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Project Short Description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Enter a brief description of the project"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Logo
              </label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer relative overflow-hidden group"
              >
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={(e) => handleFileChange(e, 'logo')}
                  className="hidden"
                  accept="image/*"
                />
                {logoPreview ? (
                  <div className="relative h-32 w-full flex items-center justify-center">
                    <img src={logoPreview} alt="Logo Preview" className="h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Image
              </label>
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer relative overflow-hidden group"
              >
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden"
                  accept="image/*"
                />
                {imagePreview ? (
                  <div className="relative h-32 w-full flex items-center justify-center">
                    <img src={imagePreview} alt="Image Preview" className="h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              onClick={() => setFormData({ ...formData, status: 'PUBLISHED' })}
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <Loader size="small" className="text-white" /> : 'Create Portfolio'}
            </button>
            {/* <button
              type="submit"
              onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
              disabled={isSubmitting}
              className="btn-secondary disabled:opacity-70"
            >
              Save as Draft
            </button> */}
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Portfolio List</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search portfolios..."
            />
          </div>
        </div>

        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : filteredPortfolios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No portfolios found
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {filteredPortfolios.map((portfolio, index) => (
                    <motion.tr
                      key={portfolio._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {portfolio.projectLogo && (
                            <img src={portfolio.projectLogo} alt="" className="h-8 w-8 rounded-full mr-3 object-cover" />
                          )}
                          <div className="text-sm font-medium text-gray-900">{portfolio.projectName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {categories.find(c => c._id === portfolio.category)?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{portfolio.shortDescription}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${portfolio.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {portfolio.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-600 hover:text-gray-900 mr-3">
                          <Eye className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => startEdit(portfolio)}
                          className="text-[#25b485] hover:text-[#219972] mr-3"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            id: portfolio._id,
                            name: portfolio.projectName
                          })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4 inline" />
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

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Portfolio"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default CreatePortfolio;
