import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

const ActivityItemSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // 'lesson' | 'problem' | 'quiz' | 'debug'
  title: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  xpEarned: { type: Number, default: 0 },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    xp: {
      type: Number,
      default: 350,
    },
    level: {
      type: Number,
      default: 2,
    },
    streak: {
      type: Number,
      default: 5,
    },
    lastActiveDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    problemsSolved: {
      type: [String],
      default: ["py-even-odd", "py-sum-list", "js-reverse-string"],
    },
    completedLessons: {
      type: [String],
      default: ["py-variables", "py-datatypes", "py-conditions", "c-variables", "c-datatypes", "java-variables"],
    },
    quizStats: {
      totalAnswered: { type: Number, default: 28 },
      totalCorrect: { type: Number, default: 23 },
      accuracy: { type: Number, default: 82 },
    },
    achievements: {
      type: [String],
      default: ["first-program", "bug-hunter", "python-beginner"],
    },
    recentActivity: {
      type: [ActivityItemSchema],
      default: [
        { id: "act-1", type: "lesson", title: "Completed Python Loops lesson", timestamp: new Date().toISOString(), xpEarned: 25 },
        { id: "act-2", type: "debug", title: "Debugged Array Index Out of Bounds", timestamp: new Date().toISOString(), xpEarned: 15 },
        { id: "act-3", type: "quiz", title: "Scored 100% on Functions Quiz", timestamp: new Date().toISOString(), xpEarned: 30 },
        { id: "act-4", type: "problem", title: "Solved Reverse a String challenge", timestamp: new Date().toISOString(), xpEarned: 50 },
      ],
    },
    preferences: {
      defaultLanguage: { type: String, default: "python" },
      explanationLevel: { type: String, default: "beginner" }, // 'beginner' | 'intermediate' | 'advanced'
      theme: { type: String, default: "terminal-cyber" },
      customApiKey: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = models.User || mongoose.model("User", UserSchema);

export default User;