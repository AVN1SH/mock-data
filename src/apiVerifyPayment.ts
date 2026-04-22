import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PurchaseModel from "@/models/purchase.model";
import { currentUser } from "@/lib/currentUser";
import UserModel from "@/models/user.model";
import TempOrderModel from "@/models/tempOrder.model";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const {data} = await req.json();
    await dbConnect();
    const user = await currentUser();

    if(!user) return new NextResponse("Unautharized", {status : 500});
  
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  
    if(!razorpay_order_id && !razorpay_payment_id && !razorpay_signature) return new NextResponse("razorpay details missing", {status : 404});
  
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
  
    const tempOrder = await TempOrderModel.findOne({
      orderId : razorpay_order_id
    })
  
    if(!tempOrder) return new NextResponse("order distrupted or manipulated, contact customer service.", {status : 409})
  
    if (generatedSignature === razorpay_signature) {
  
      const purchase = await PurchaseModel.create({
        orderId : razorpay_order_id,
        paymentId : razorpay_payment_id,
        productType : tempOrder.productType,
        productId : tempOrder.productId,
        email : user?.email,
        amount : tempOrder.amount,
        user : user?._id
      });

      if(tempOrder.productType === "notes") {
        await UserModel.findByIdAndUpdate(user?._id, {
          $push : {
            "purchasedProducts.notes" : {
              $each : purchase.productId
            },
            purchases : purchase._id
          }
        })
      }
      else if(tempOrder.productType === "pyq") {
        await UserModel.findByIdAndUpdate(user?._id, {
          $push : {
            "purchasedProducts.pyq" : {
              $each : purchase.productId
            },
            purchases : purchase._id
          }
        })
      }
      else if(tempOrder.productType === "handwritten-notes") {
        const discount = Number(tempOrder.coinsDiscount) || 0;

        await UserModel.findByIdAndUpdate(user?._id, {
          $push : {
            "purchasedProducts.handwrittenNotes" : {
              $each : purchase.productId
            },
            purchases : purchase._id
          },
          $inc : {
            rewardCoins : -discount
          }
        })
      }
  
      return NextResponse.json({ success: true }, {status : 200});
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}