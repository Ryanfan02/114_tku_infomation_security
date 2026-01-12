import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ip: { type: String },
    ua: { type: String },
    meta: { type: Object }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditSchema);
