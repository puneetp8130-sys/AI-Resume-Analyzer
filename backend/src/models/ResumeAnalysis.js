const mongoose = require('mongoose');

const sectionFeedbackSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, trim: true },
    feedback: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    targetRole: {
      type: String,
      trim: true,
      default: '',
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    sectionFeedback: {
      type: [sectionFeedbackSchema],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

resumeAnalysisSchema.methods.toReportObject = function toReportObject() {
  return {
    id: this._id.toString(),
    fileName: this.fileName,
    targetRole: this.targetRole,
    atsScore: this.atsScore,
    summary: this.summary,
    strengths: this.strengths,
    weaknesses: this.weaknesses,
    skills: this.skills,
    missingSkills: this.missingSkills,
    keywords: this.keywords,
    sectionFeedback: this.sectionFeedback,
    suggestions: this.suggestions,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
