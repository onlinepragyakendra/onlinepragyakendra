import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
const schema=z.object({amount:z.number().int().min(100).max(1000000)}); // ₹1 to ₹10,000
export async function POST(req:Request){
 const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Login required"},{status:401});
 try{
  const {amount}=schema.parse(await req.json());
  const order=await getRazorpay().orders.create({amount,currency:"INR",receipt:`opk_${user.id.slice(-10)}_${Date.now()}`,notes:{userId:user.id}});
  return NextResponse.json({orderId:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID});
 }catch{return NextResponse.json({error:"Could not create payment order. Check Razorpay configuration."},{status:400})}
}
