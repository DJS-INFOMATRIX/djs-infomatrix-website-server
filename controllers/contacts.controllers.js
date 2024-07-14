import Contact from "../models/contacts.models.js";

export const contactUser = async (req, res) => {
  try {
    const { name, email, organization, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      organization,
      subject,
      message,
    });

    console.log(newContact);

    const savedContact = await newContact.save();

    if (savedContact) {
      res.status(200).json(savedContact);
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
