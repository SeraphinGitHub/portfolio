"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    hasOpenLink: {
        type: Boolean,
    },
}, { _id: false });
const ReportSchema = new mongoose_1.Schema({
    sessionTime: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
    },
    projects: {
        type: [ProjectSchema],
    },
    lang: {
        type: [String],
    },
    starsExplode: {
        type: [Number],
    },
});
exports.default = (0, mongoose_1.model)("Report", ReportSchema);
