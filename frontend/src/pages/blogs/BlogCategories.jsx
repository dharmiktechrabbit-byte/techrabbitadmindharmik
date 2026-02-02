import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getBlogCategoriesApi,
  createBlogCategoryApi,
  updateBlogCategoryApi,
  deleteBlogCategoryApi,
  searchBlogCategoriesApi
} from '../../api/api';
import Loader from '../../components/Loader';
import DeleteModal from '../../components/DeleteModal';

function BlogCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit/Create State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getBlogCategoriesApi();
      setCategories(response.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      if (query.trim()) {
        const response = await searchBlogCategoriesApi(query);
        setCategories(response.categories || []);
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateBlogCategoryApi({ name: formData.name, status: 'ACTIVE' }, editId);
        toast.success('Category updated successfully');
      } else {
        await createBlogCategoryApi({ name: formData.name });
        toast.success('Category created successfully');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteBlogCategoryApi(deleteModal.id);
      toast.success('Category deleted successfully');
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error || 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (category) => {
    setIsEditing(true);
    setEditId(category._id);
    setFormData({ name: category.name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '' });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Blog Category' : 'Create Blog Category'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter category name"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader size="small" className="text-white" />
            ) : (
              <>
                {isEditing ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditing ? 'Update Category' : 'Create Category'}
              </>
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Categories List</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search categories..."
            />
          </div>
        </div>

        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog Posts
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {categories.map((category, index) => (
                    <motion.tr
                      key={category._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-[#e1f5ee] text-[#25b485]">
                          {category.blogsCount || 0} posts
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEdit(category)}
                          className="text-[#25b485] hover:text-[#219972] mr-4"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            id: category._id,
                            name: category.name
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
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default BlogCategories;
