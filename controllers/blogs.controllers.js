import Blogs from "../models/blogs.models.js";
import cloudinary from "cloudinary";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, content, readTime, authorName, authorDesg } = req.body;

    if (!title || !description || !content || !readTime || !authorName || !authorDesg) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrls = [];
    let authorImageUrl = "";

    if (req.files) {
      for (const file of Object.values(req.files)) {
        if (!file || !Array.isArray(file)) {
          console.log("No file uploaded");
          continue;
        }

        for (const f of file) {
          console.log("File: ", f);

          const b64 = Buffer.from(f.buffer).toString("base64");
          const dataURI = "data:" + f.mimetype + ";base64," + b64;

          try {
            const cldRes = await cloudinary.uploader.upload(dataURI, {
              resource_type: "auto",
            });

            if (f.fieldname === "authorImage") {
              console.log("Author Image: ", cldRes.secure_url);
              authorImageUrl = cldRes.secure_url;
            } else {
              console.log("Image: ", cldRes.secure_url);
              imageUrls.push(cldRes.secure_url);
            }
          } catch (uploadError) {
            console.error("Error uploading image to Cloudinary:", uploadError);
            return res.status(500).json({ error: "Error uploading image" });
          }
        }
      }
    }

    const newBlog = new Blogs({
      title,
      description,
      content,
      readTime,
      authorName,
      authorDesg,
      authorImage: authorImageUrl,
      image: imageUrls,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Blogs.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
