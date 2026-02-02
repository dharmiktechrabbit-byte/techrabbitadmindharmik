const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/public/blogs/';
const blogId = '697c96e9843f1f7f2e700f1b';

const testBlogDetails = async () => {
    try {
        console.log(`Testing Blog Details API for ID: ${blogId}...`);
        
        const response = await axios.get(`${BASE_URL}blog-details?id=${blogId}`);
        
        if (response.status === 200) {
            console.log("✅ Success: Blog details fetched correctly.");
            console.log("Title:", response.data.blog.title);
            console.log("Categories:", response.data.categories.length);
        } else {
            console.error(`❌ Failure: API returned status ${response.status}`);
        }
    } catch (error) {
        console.error("❌ Error during API test:", error.response ? error.response.data : error.message);
    }
};

testBlogDetails();
