import Project from "../models/projects.models.js";
import TechStackData from "../models/techStack.models.js";
import cloudinary from "cloudinary";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createProject = async (req, res) => {
  try {
    if (
      !req.files ||
      !req.files.images ||
      req.files.images.length === 0
    ) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const {
      title,
      shortDetail,
      longDetail,
      techStack,
      githubLink,
      department,
    } = req.body;

    const projectImageUrls = [];

    // Upload project images
    for (const file of req.files.images) {
      if (!file) {
        console.log("No file uploaded");
        continue; // Skip processing if the file is undefined
      }

      // Convert file buffer to base64 string
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      // Upload image to Cloudinary
      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });

      // Add the Cloudinary image URL to the array
      projectImageUrls.push(cldRes.secure_url);
    }

    const techStackData = [];
    const techStackArray = techStack.split(',');

    let DBTechStackData = await TechStackData.findById("669147315e1c2ea32eb390f1");
    DBTechStackData = DBTechStackData.techStackData;

    for (const tech of techStackArray) {
      const techString = String(tech).trim().toLowerCase();

      const techData = DBTechStackData.find(item => item.tech.trim().toLowerCase() === techString);

      if (techData) {
        techStackData.push(techData.image);
      }
    }

    // Create new Project document
    const newProject = new Project({
      title,
      shortDetail,
      longDetail,
      githubLink,
      techStack: techStackData,
      department,
      images: projectImageUrls, // Store array of Cloudinary image URLs for project images
    });

    // Save new project to database
    const savedProject = await newProject.save();

    // Respond with saved project data
    res.status(200).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const {
      title,
      shortDetail,
      longDetail,
      techStack,
      githubLink,
      department,
    } = req.body;

    const updatedProject = {
      title,
      shortDetail,
      longDetail,
      techStack,
      githubLink,
      department,
    };

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updatedProject,
      {
        new: true,
      }
    );

    if (project) {
      res.status(200).json(project);
    } else {
      res.status(400).json({ error: "Invalid Project Data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
