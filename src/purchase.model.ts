import mongoose, { Schema, Document } from "mongoose";

export interface Purchase extends Document {
  orderId : string;
  paymentId : string;
  productType : "notes" | "pyq" | "handwritten-notes";
  productId : string[];
  email : string;
  amount : number;
  user : mongoose.Schema.Types.ObjectId;
}

const PurchaseSchema: Schema<Purchase> = new Schema({
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    enum: ["notes", "pyq", "handwritten-notes"],
    required: true
  },
  productId: {
    type: [String],
    required: true
  },
  email: {
    type: String,
    required: [true, "Email is required..!"],
  },
  amount: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const PurchaseModel = mongoose.models.Purchase as mongoose.Model<Purchase> || mongoose.model<Purchase>("Purchase", PurchaseSchema);

export default PurchaseModel;