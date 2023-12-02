const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: { type: String, required: true},
    animalImage: {type: String, required: false, default:"uploads/rabbit.jpg"}
});

module.exports = mongoose.model('Animal', animalSchema);