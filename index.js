const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/posts", (req, res) => {
  const postsDirectory = path.join(__dirname, "posts");

  fs.readdir(postsDirectory, (err, files) => {
    if (err) {
      console.error("Error reading posts directory:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const postFiles = files.filter((file) => file.endsWith(".md"));

    const posts = postFiles.map((file, id) => {
      return {
        id,
        filename: file,
      };
    });

    res.json(posts);
  });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const postsDirectory = path.join(__dirname, "posts");
  const postFiles = fs.readdirSync(postsDirectory);
  const postFile = postFiles[id];

  if (!postFile) {
    res.status(404).send("Not Found");
    return;
  }

  const postPath = path.join(postsDirectory, postFile);
  const postContent = fs.readFileSync(postPath, "utf8");

  res.json({
    id,
    filename: postFile,
    content: postContent,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
