const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
    secret: String,
    dateCreated: Date,
});

secretSchema.pre('save', function() {
    this.dateCreated = Date.now();
});

const Secret = new mongoose.model('Secret', secretSchema);

module.exports = Secret;