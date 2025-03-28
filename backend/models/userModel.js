const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { auto } = require("async");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, default: null }, // Null for normal users
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Null for Google users
  userRole: {
    type: String,
    enum: ["admin", "user"], // Allowed values
    default: "user", // Default value
  },
  profilePictureURL: { type: String },
  stripeCustomerId: { type: String },
  subscriptionId: { type: String },
  subscriptionStatus: { type: String ,default:null},
  subscriptionPlan: {
    type: String,
    enum: ["trial","monthly", "six_months", "yearly"], // Allowed values
    default: null, // No subscription by default
  },
  subscriptionPlanExpiry: { type: Date, default: null }, // Trial expiration date
  autoRenewal: { type: Boolean },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Only hash if password field is modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
