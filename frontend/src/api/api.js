import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginApi = async (userData) => {
    try {
        const response = await api.post("admin/login", userData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const resetPasswordApi = async (passwordData) => {
    try {
        const response = await api.put("admin/reset-password", passwordData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}



//Portfolio Management 



//Portfolio Category Management

export const createPortfolioCategoryApi = async (portfolioCategoryData) => {
    try {
        const response = await api.post("portfolio-categories", portfolioCategoryData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const getPortfolioCategoriesApi = async () => {
    try {
        const response = await api.get("portfolio-categories");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const searchPortfolioCategoriesApi = async (searchQuery) => {
    try {
        const response = await api.get(`portfolio-categories?search=${searchQuery}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updatePortfolioCategoryApi = async (portfolioCategoryData, id) => {
    try {
        const response = await api.put(`portfolio-categories/${id}`, portfolioCategoryData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const deletePortfolioCategoryApi = async (id) => {
    try {
        const response = await api.delete(`portfolio-categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

//Portfolio Project Management

export const createPortfolioProjectApi = async (portfolioProjectData) => {
    try {
        const response = await api.post("portfolios", portfolioProjectData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const getPortfolioProjectsApi = async () => {
    try {
        const response = await api.get("portfolios");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updatePortfolioProjectApi = async (portfolioProjectData, id) => {
    try {
        const response = await api.put(`portfolios/${id}`, portfolioProjectData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const deletePortfolioProjectApi = async (id) => {
    try {
        const response = await api.delete(`portfolios/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

//Blog Management


//Blog Category Management

export const createBlogCategoryApi = async (blogCategoryData) => {
    try {
        const response = await api.post("blog-categories", blogCategoryData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const getBlogCategoriesApi = async () => {
    try {
        const response = await api.get("blog-categories");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updateBlogCategoryApi = async (blogCategoryData, id) => {
    try {
        const response = await api.put(`blog-categories/${id}`, blogCategoryData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const searchBlogCategoriesApi = async (searchQuery) => {
    try {
        const response = await api.get(`blog-categories?search=${searchQuery}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const deleteBlogCategoryApi = async (id) => {
    try {
        const response = await api.delete(`blog-categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

//Blog Tags Management

export const createBlogTagApi = async (blogTagData) => {
    try {
        const response = await api.post("blog-tags", blogTagData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const getBlogTagsApi = async () => {
    try {
        const response = await api.get("blog-tags");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updateBlogTagApi = async (blogTagData, id) => {
    try {
        const response = await api.put(`blog-tags/${id}`, blogTagData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const searchBlogTagsApi = async (searchQuery) => {
    try {
        const response = await api.get(`blog-tags?search=${searchQuery}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const deleteBlogTagApi = async (id) => {
    try {
        const response = await api.delete(`blog-tags/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}


//Job Management 

// Create Job Post API

export const createJobPostApi = async (jobPostData) => {
    try {
        const response = await api.post("jobs", jobPostData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const getJobPostsApi = async () => {
    try {
        const response = await api.get("jobs");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updateJobPostApi = async (jobPostData, id) => {
    try {
        const response = await api.put(`jobs/${id}`, jobPostData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}


export const deleteJobPostApi = async (id) => {
    try {
        const response = await api.delete(`jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const changeJobPostStatusApi = async (jobPostData, id) => {
    try {
        const response = await api.patch(`jobs/${id}/status`, jobPostData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

//Applied List API

export const getAppliedListApi = async () => {
    try {
        const response = await api.get("applications");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}


export const getSummaryCountApi = async () => {
    try {
        const response = await api.get("applications/summary");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const changeApplicationStatusApi = async (id, applicationStatus) => {
    try {
        const response = await api.put(`applications/${id}/status`, applicationStatus);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const downloadApplicationApi = async (id) => {
    try {
        const response = await api.get(`applications/${id}/resume`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

//Blog Management

export const createBlogApi = async (blogData) => {
    try {
        const response = await api.post("blogs", blogData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const getBlogApi = async () => {
    try {
        const response = await api.get("blogs");
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updateBlogApi = async (blogData, id) => {
    try {
        const response = await api.put(`blogs/${id}`, blogData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const deleteBlogApi = async (id) => {
    try {
        const response = await api.delete(`blogs/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const enable2FAApi = async (userIdData) => {
    try {
        const response = await api.post("2fa/enable", userIdData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const verify2FAApi = async (verifyData) => {
    try {
        const response = await api.post("2fa/verify", verifyData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw (
            error?.response?.data?.message ||
            "Check Network Connection"
        );
    }
}

export const updateBlogStatusApi = async (id, status) => {

  try {
    const response = await api.patch(`blogs/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardSummaryApi = async () => {
  try {
    const response = await api.get("dashboard/summary");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardRecentActivitiesApi = async (limit = 5) => {
  try {
    const response = await api.get(`dashboard/recent-activities?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};
