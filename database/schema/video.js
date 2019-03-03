const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let videoSchema = new Schema({
  id: String,
  title: String,
  link: String,
  pv: Number,
  timeLength: String,
});

module.exports = videoSchema;