import mongoose from "mongoose";

const Schema = mongoose.Schema;

const techStackDataItemSchema = new Schema({
  tech: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
}, { _id: false });

const techStackDataSchema = new Schema({
  docType: {
    type: String,
    required: true,
  },
  docFileType: {
    type: String,
    required: true,
  },
  techStackData: {
    type: [techStackDataItemSchema],
    required: true,
  }
});

const TechStackData = mongoose.model('flexible_docs', techStackDataSchema);
export default TechStackData;
