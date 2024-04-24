const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    if (req.user._id.toString() === blog.createdBy.toString()) {
      return res.render("editBlog", {
        user: req.user,
        blog,
      });
    } else {
      return res.status(403).send("Unauthorized");
    }
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/:id/edit", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  let update = {};
  if (title) {
    update.title = title;
  }
  if (body) {
    update.body = body;
  }
  if (req.file) {
    update.coverImageURL = `/uploads/${req.file.filename}`;
  }
  try {
    await Blog.findByIdAndUpdate(req.params.id, update);
    return res.redirect(`/blog/${req.params.id}`);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    if (req.user._id.toString() === blog.createdBy.toString()) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.redirect(`/`);
    } else {
      return res.status(403).send("Unauthorized");
    }
  } catch (error) {
    return res.status(500).send("Server error");
  }
});



router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  let newBlog = {
    createdBy: req.user._id,
  };
  if (title) {
    newBlog.title = title;
  }
  if (body) {
    newBlog.body = body;
  }
  if (req.file) {
    newBlog.coverImageURL = `/uploads/${req.file.filename}`;
  }
  try {
    const blog = await Blog.create(newBlog);
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
