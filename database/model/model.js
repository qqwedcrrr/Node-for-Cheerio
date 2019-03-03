const videoSchema = require('./../schema/video');
const mongoose = require('mongoose');

const videoModel = mongoose.model('video',videoSchema);

module.exports = videoModel