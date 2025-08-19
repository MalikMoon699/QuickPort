// As a best Example, this code snippet defines a Mongoose schema for a "Students" collection in MongoDB.
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  image: { type: String },
});

export const Students = mongoose.model("Students", studentSchema, "Students");
