import TechStackData from "../models/techStack.models.js";
import cloudinary from "cloudinary";

// export const getAllTechStack = async (req, res) => {
//   try {
//     const techStack = await TechStack.find();
//     res.status(200).json(techStack);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Append one one tech at a time warna fir bt hoga
export const createTechStack = async (req, res) => {
  try {
    if (!req.files || req.files.image.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    
    const { docId, tech } = req.body; // Pass _id and tech name over here

    const file = req.files.image[0];
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;

    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });

    const imageUrl = cldRes.secure_url;

    const techStackDoc = await TechStackData.findById(docId);

    if (!techStackDoc) {
      return res.status(404).json({ error: "Document not found" });
    }

    techStackDoc.techStackData.push({ tech, image: imageUrl });

    await techStackDoc.save();

    res.status(200).json(techStackDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};