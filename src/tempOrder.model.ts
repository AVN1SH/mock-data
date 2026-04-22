import mongoose from "mongoose";

export interface TempOrder {
  orderId : string;
  productType : "notes" | "pyq" | "handwritten-notes";
  productId: string[];
  amount : number;
  coinsDiscount ?: number;
  userEmail : string;
  expiresAt : Date;
}

const TempOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    productType: {
      type: String,
      enum: ["notes", "pyq", "handwritten-notes"],
      required: true,
    },
    productId: {
      type: [String],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coinsDiscount : {
      type : Number,
      default : 0
    },
    userEmail: {
      type: String,
      required: false, 
    },
    expiresAt : {
      type : Date,
      default : Date.now,
      index : { expires : "15m" }
    }
  },
  { timestamps : true }
);
const TempOrderModel = mongoose.models.TempOrder as mongoose.Model<TempOrder> || mongoose.model<TempOrder>("TempOrder", TempOrderSchema);

export default TempOrderModel;