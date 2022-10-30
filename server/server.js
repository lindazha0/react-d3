const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

require('./db/connection');

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});