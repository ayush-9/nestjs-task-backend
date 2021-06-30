import * as mongoose from 'mongoose';
import { ItemStatus } from '../interfaces/item.interface';

export const ItemSchema = new mongoose.Schema(
  {
    name: String,
    qty: Number,
    index: Number,
    description: String,
    status: {
      type: String,
      enum: ItemStatus,
      default: ItemStatus.PENDING,
    },
    createdAt: Number,
    updatedAt: Number,
    user_id: String,
  },
  {
    timestamps: true,
  },
);
