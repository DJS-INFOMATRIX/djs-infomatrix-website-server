import mongoose, { Schema } from "mongoose";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
    },
    email: {
      type: String,
      default: "",
      required: true,
    },
    organization: {
      type: String,
      default: "",
      required: true,
    },
    subject: {
      type: String,
      default: "",
      required: true,
    },
    message: {
      type: String,
      default: "",
      required: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactsSchema);
export default Contact;
