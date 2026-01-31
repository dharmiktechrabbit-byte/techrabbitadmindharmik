import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Tag, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getBlogTagsApi,
  createBlogTagApi,
  updateBlogTagApi,
  deleteBlogTagApi,
  searchBlogTagsApi
} from '../../api/api';
import Loader from '../../components/Loader';
import DeleteModal from '../../components/DeleteModal';

function BlogTags() {
  const [tags, setTags] = useState([]);
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
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await getBlogTagsApi();
      setTags(response.tags || []);
    } catch (error) {
      toast.error('Failed to fetch tags');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      if (query.trim()) {
        const response = await searchBlogTagsApi(query);
        setTags(response.tags || []);
      } else {
        fetchTags();
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
        await updateBlogTagApi({ name: formData.name, status: 'ACTIVE' }, editId);
        toast.success('Tag updated successfully');
      } else {
        await createBlogTagApi({ name: formData.name });
        toast.success('Tag created successfully');
      }
      resetForm();
      fetchTags();
    } catch (error) {
      toast.error(error || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteBlogTagApi(deleteModal.id);
      toast.success('Tag deleted successfully');
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchTags();
    } catch (error) {
      toast.error(error || 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (tag) => {
    setIsEditing(true);
    setEditId(tag._id);
    setFormData({ name: tag.name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '' });
  };

  const getColorClass = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800'
    ];
    return colors[index % colors.length];
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
            {isEditing ? 'Edit Blog Tag' : 'Create Blog Tag'}
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
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-2">
              Tag Name
            </label>
            <input
              type="text"
              id="tagName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter tag name"
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
                {isEditing ? 'Update Tag' : 'Create Tag'}
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tags List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search tags..."
            />
          </div>
        </div>

        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Count
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
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    No tags found
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {tags.map((tag, index) => (
                    <motion.tr
                      key={tag._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getColorClass(index)}`}>
                            #{tag.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tag.usageCount || 0} blog posts</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEdit(tag)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            id: tag._id,
                            name: tag.name
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
        title="Delete Tag"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default BlogTags;
