const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ["manager", "admin"], default: "manager" },
    branch: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Manager", managerSchema);
