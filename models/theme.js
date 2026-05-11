import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
});

export default mongoose.model('Theme', ThemeSchema);