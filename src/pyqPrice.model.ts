import mongoose, { Schema, Document } from "mongoose";

export interface PyqPrice extends Document {
  productId : string[];
  amount : number;
}

const PyqPriceSchema: Schema<PyqPrice> = new Schema({
  productId: {
    type: [String],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
}, { timestamps: true });

const PyqPriceModel = mongoose.models.PyqPrice as mongoose.Model<PyqPrice> || mongoose.model<PyqPrice>("PyqPrice", PyqPriceSchema);

export default PyqPriceModel;