var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  name: String,
  year: { type: Number, min: 1900, max: 2016},
  watched: Date
});

module.exports = mongoose.model('Movie', MovieSchema);
