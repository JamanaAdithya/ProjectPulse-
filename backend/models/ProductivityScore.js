const mongoose = require("mongoose");

const productivityScoreSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, required: true},
    score: {type: Number, required: true},
});

productivityScoreSchema.index({user:1, date: 1}, {unique: true});

module.exports = mongoose.model("ProductivityScore", productivityScoreSchema);