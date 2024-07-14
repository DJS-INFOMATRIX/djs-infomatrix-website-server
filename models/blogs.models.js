import mongoose, { Schema } from "mongoose";

const blogsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorDesg: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Blogs = mongoose.model("Blog", blogsSchema);
export default Blogs;
