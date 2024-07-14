import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDetail: {
      type: String,
      required: true,
    },
    longDetail: {
      type: String,
      required: true,
    },
    githubLink: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    techStack: [
      {
        type: String,
      }
    ],
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
