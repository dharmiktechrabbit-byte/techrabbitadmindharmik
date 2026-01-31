const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();



const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.setTimeout(5 * 60 * 1000);