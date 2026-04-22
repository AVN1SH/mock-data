import { calculateCoinDiscount } from "@/lib/calculateCoinDiscount";
import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import HandwrittenNotesModel from "@/models/handwrittenNotes.model";
import PyqPriceModel from "@/models/pyqPrice.model";
import SubjectPriceModel from "@/models/subjectPrice.model";
import TempOrderModel from "@/models/tempOrder.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PROJECTS } from "@/lib/mockProjects";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await currentUser();
    const userDetails = await UserModel.findById(user?._id);

    if (!user) return new NextResponse("Unautharized", { status: 500 });

    const {
      type,
      courseCode,
      session,
      semester,
      subjectCode,
      handwrittenNotesId,
      coinsUsed,
      projectId,
    } = await req.json();

    if (!type) return new NextResponse("type is missing", { status: 400 });

    let amount;
    let productId;

    //notes section
    if (type === "notes") {
      productId = subjectCode;

      if (!subjectCode.length)
        return new NextResponse("Subject Code is missing", { status: 400 });

      const isExist = await UserModel.findOne({
        _id: user._id,
        "purchasedProducts.notes": { $in: subjectCode },
      });

      if (isExist)
        return new NextResponse("Already Purchased..!", { status: 409 });

      amount = await SubjectPriceModel.findOne({
        subjectCodes: { $all: subjectCode },
        $expr: { $eq: [{ $size: "$subjectCodes" }, subjectCode.length] },
      });
    }

    //pyq section
    if (type === "pyq") {
      if (!session || !semester || !courseCode)
        return new NextResponse(
          "session or semester or courseCode is missing",
          { status: 400 },
        );

      productId = session.map((s: string) => {
        return `pyq_${courseCode}_${s}_sem-${semester}`;
      });

      const isExist = await UserModel.findOne({
        _id: user._id,
        "purchasedProducts.pyq": { $in: productId },
      });

      if (isExist)
        return new NextResponse("Already Purchased..!", { status: 409 });

      amount = await PyqPriceModel.findOne({
        productId: { $all: productId },
        $expr: { $eq: [{ $size: "$productId" }, productId.length] },
      });
    }
    //handwritten notes section

    if (type === "handwritten-notes") {
      if (!handwrittenNotesId)
        return new NextResponse("handwrittenNotesId is missing", {
          status: 400,
        });

      productId = [handwrittenNotesId];

      const isExist = await UserModel.findOne({
        _id: user._id,
        "purchasedProducts.handwrittenNotes": { $in: handwrittenNotesId },
      });

      if (isExist)
        return new NextResponse("Already Purchased..!", { status: 409 });

      amount = await HandwrittenNotesModel.findOne({
        productId: { $all: productId },
        $expr: { $eq: [{ $size: "$productId" }, productId.length] },
      });
    }

    //project section
    if (type === "project") {
      if (!projectId)
        return new NextResponse("Project ID is missing", { status: 400 });

      const project = PROJECTS.find((p) => p.id === projectId);
      if (!project)
        return new NextResponse("Project not found", { status: 404 });

      amount = { amount: project.price };
      productId = [projectId];
    }

    if (!amount) return new NextResponse("Amount not found.", { status: 400 });

    let discount:
      | undefined
      | {
          amount: number;
          coinsDiscount: number;
        } = undefined;

    if (coinsUsed) {
      discount = calculateCoinDiscount(
        amount.amount,
        userDetails?.rewardCoins as number,
      );
    }

    const options = {
      amount: discount ? discount.amount * 100 : amount.amount * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await razorpay.orders.create(options);

    if (!order?.id)
      return new NextResponse("Faild to generate order", { status: 500 });

    const tempOrder = await TempOrderModel.create({
      orderId: order.id,
      productType: type,
      productId,
      amount: (order.amount as number) / 100,
      coinsDiscount: discount ? discount.coinsDiscount : 0,
      userEmail: user.email,
    });

    if (!tempOrder)
      return new NextResponse("Faild to create Temp order", { status: 500 });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json({ message: "Razorpay error" }, { status: 500 });
  }
}
