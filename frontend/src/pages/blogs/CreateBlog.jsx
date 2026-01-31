import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Upload,
} from "lucide-react";
import {
  getBlogApi,
  createBlogApi,
  updateBlogApi,
  deleteBlogApi,
  getBlogCategoriesApi,
  getBlogTagsApi,
  updateBlogStatusApi,
} from "../../api/api";
import { Editor } from "@tinymce/tinymce-react";
import toast from 'react-hot-toast';
import DeleteModal from "../../components/DeleteModal";

function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    slug: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const imageInputRef = useRef(null);

  const [blogImageFile, setBlogImageFile] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");

  // ✅ API DATA STATES
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [blogs, setBlogs] = useState([]);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch categories + tags + blogs on page load
  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchBlogs();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getBlogCategoriesApi();
      setCategories(res?.categories || []);
    } catch (error) {
      console.log("Fetch Categories Error:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await getBlogTagsApi();
      setAvailableTags(res?.tags || []);
    } catch (error) {
      console.log("Fetch Tags Error:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await getBlogApi();
      setBlogs(res?.blogs || []);
    } catch (error) {
      console.log("Fetch Blogs Error:", error);
    }
  };

  const [submitStatus, setSubmitStatus] = useState("PUBLISHED");

  // ✅ Submit Blog to API (with image)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("metaTitle", formData.metaTitle);
      fd.append("metaDescription", formData.metaDescription);
      fd.append("slug", formData.slug);
      
      // Use the state value for status
      fd.append("status", submitStatus);

      // ✅ tags array
      formData.tags.forEach((tagId) => fd.append("tags[]", tagId));

      // ✅ blog image
      if (blogImageFile) {
        fd.append("blogImage", blogImageFile);
      }

      await createBlogApi(fd);
      await fetchBlogs();

      // Show different toast messages based on status
      if (submitStatus === "DRAFT") {
        toast.success("Blog saved as draft successfully");
      } else {
        toast.success("Blog published successfully");
      }

      // ✅ reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: [],
        metaTitle: "",
        metaDescription: "",
        slug: "",
      });

      setBlogImageFile(null);
      setBlogImagePreview("");
      // Reset submit status to default
      setSubmitStatus("PUBLISHED");
    } catch (error) {
      console.log("Create Blog Error:", error);
      toast.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "title") {
      const slugified = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug: slugified }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setBlogImageFile(file);
    setBlogImagePreview(previewUrl);
  };

  const handleTagToggle = (tagId) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tagId)
        ? formData.tags.filter((t) => t !== tagId)
        : [...formData.tags, tagId],
    });
  };

  const toggleBlogStatus = async (blog) => {
    try {
      setIsSubmitting(true);

      const newStatus = blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      await updateBlogStatusApi(blog._id, newStatus);

      await fetchBlogs();
    } catch (error) {
      console.log("Toggle Blog Status Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      await deleteBlogApi(deleteModal.id); // ✅ backend delete call
      await fetchBlogs();

      setDeleteModal({ isOpen: false, id: null, name: "" });
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Create Blog Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog Title
            </label>

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Description
            </label>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <Editor
                apiKey="mhxnknaao8r4wkfysoxbma6z3498wxmt7i7o5f3h8luxf91a"
                value={formData.description}
                onEditorChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                init={{
                  height: 350,
                  menubar: false,
                  branding: false,
                  plugins: [
                    "link",
                    "lists",
                    "table",
                    "code",
                    "codesample",
                    "blockquote",
                    "autolink",
                    "preview",
                    "searchreplace",
                    "wordcount",
                    "fullscreen",
                    "hr",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic underline strikethrough | " +
                    "h1 h2 h3 | " +
                    "bullist numlist blockquote | " +
                    "link image media table hr | " +
                    "codesample code | fullscreen preview",
                  content_style:
                    "body { font-family: Figtree, sans-serif; font-size:14px }",
                }}
              />
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Rich text editor for formatted content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Category
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
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Tags
              </label>

              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[44px]">
                {availableTags.map((tag) => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagToggle(tag._id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.tags.includes(tag._id)
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>

            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer relative overflow-hidden group"
            >
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              {blogImagePreview ? (
                <div className="relative h-32 w-full flex items-center justify-center">
                  <img
                    src={blogImagePreview}
                    alt="Image Preview"
                    className="h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">
                      Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              SEO Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="metaTitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Meta Title
                </label>

                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <label
                  htmlFor="metaDescription"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Meta Description
                </label>

                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Brief description for search results"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL Slug
                </label>

                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    techrabbit.com/blog/
                  </span>

                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="url-slug"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              className="btn-primary"
              onClick={() => setSubmitStatus("PUBLISHED")}
            >
              Publish Blog
            </button>
            <button 
              type="submit" 
              className="btn-secondary"
              onClick={() => setSubmitStatus("DRAFT")}
            >
              Save as Draft
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search blogs..."
            />
          </div>
        </div>

        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredBlogs.map((blog, index) => (
                <motion.tr
                  key={blog.id || blog._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="table-row"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {blog.title}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      {blog.views || 0} views
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {blog.category?.name || blog.category}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(blog.tags || []).map((tag, i) => (
                        <span
                          key={tag?._id || i}
                          className="px-2 py-1 text-xs rounded-full bg-primary-100 text-[#25b485]"
                        >
                          {tag?.name || tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {blog.author || "Admin"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(blog.createdAt || blog.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      onClick={() => toggleBlogStatus(blog)}
                      className={`px-3 py-1 inline-flex text-xs font-medium rounded-full cursor-pointer select-none ${
                        (blog.status || "").toLowerCase() === "published" ||
                        blog.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                      title="Click to change status"
                    >
                      {blog.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Eye className="h-4 w-4 inline" />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          id: blog._id,
                          name: blog.title,
                        })
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default CreateBlog;
