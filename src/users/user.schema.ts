import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    salt: String,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: true,
  },
);
