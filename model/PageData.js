//mode/PageData.js
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
  didSnap: Boolean,
  time: Number,
  currentPage: String,
  bytesUsed: Number
}, { collection: 'memtracker' });


//export our module to use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);
