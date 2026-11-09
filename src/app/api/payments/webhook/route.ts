import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Configure this exact URL in Razorpay Webhooks and subscribe to payment.captured.
 * Wallet credit is done only after validating the webhook signature and captured event.
 * Do not credit wallet from a browser success callback.
 */
export async function POST(req:Request){
 const raw=await req.text();
 const signature=req.headers.get("x-razorpay-signature");
 const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
 if(!signature||!secret)return NextResponse.json({error:"Webhook not configured"},{status:400});
 const expected=crypto.createHmac("sha256",secret).update(raw).digest("hex");
 const a=Buffer.from(signature),b=Buffer.from(expected);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return NextResponse.json({error:"Invalid signature"},{status:400});
 try{
  const event=JSON.parse(raw);
  if(event.event!=="payment.captured")return NextResponse.json({ok:true});
  const payment=event.payload?.payment?.entity;
  const orderId=payment?.order_id;const amount=Number(payment?.amount);
  const userId=payment?.notes?.userId;
  if(!orderId||!Number.isInteger(amount)||amount<=0||!userId)return NextResponse.json({error:"Missing payment metadata"},{status:400});
  const reference=`rzp_${payment.id}`;
  await prisma.$transaction(async(tx)=>{
   const exists=await tx.transaction.findUnique({where:{reference}});
   if(exists)return;
   const wallet=await tx.wallet.findUnique({where:{userId}});
   if(!wallet)throw new Error("Wallet not found");
   await tx.wallet.update({where:{userId},data:{balance:{increment:amount}}});
   await tx.transaction.create({data:{userId,type:"CREDIT",status:"SUCCESS",amount,reference,description:"Wallet top-up via Razorpay",provider:"RAZORPAY",providerTxnId:payment.id}});
  });
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Webhook processing failed"},{status:500})}
}
