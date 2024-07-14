import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { contactUser } from "./controllers/contacts.controllers.js";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} from "./controllers/projects.controllers.js";
import {
  getAllBlogs,
  createBlog,
  getBlogById,
} from "./controllers/blogs.controllers.js";
import {
  createTechStack,
} from "./controllers/techStack.controllers.js";
import cloudinary from "cloudinary";
import { upload } from "./middleware/multer.middleware.js";

const app = express();
const router = express();

dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: "POST, GET, PATCH",
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 200,
    credentials: true,
    // preflightContinue: false,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json"); // Ensure JSON content type
  next();
});

/******* Upload Images to Cloudinary *******/
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post(
  "/projects/create",
  upload.fields([
    { name: "images", maxCount: 10 },
  ]),
  createProject
);
router.post(
  "/blogs/create",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "authorImage", maxCount: 1 },
  ]),
  createBlog
);
router.post(
  "/techStack/create",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createTechStack
);

/******* Routes *******/
app.use("/", router);
router.post("/contactus", contactUser);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);
router.post("/projects/create", createProject);
router.patch("/projects/create/:id", updateProject);
router.get("/blogs", getAllBlogs);
router.post("/blogs/create", createBlog);
router.get("/blogs/:id", getBlogById);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );
    console.log(
      "MongoDB connected!! DB HOST: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}!`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });
