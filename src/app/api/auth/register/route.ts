import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const schema=z.object({
 name:z.string().trim().min(2).max(80),
 mobile:z.string().regex(/^[6-9][0-9]{9}$/),
 email:z.string().email().optional().or(z.literal("")),
 password:z.string().min(8).max(72),
 role:z.enum(["CUSTOMER","RETAILER","DISTRIBUTOR"]).default("CUSTOMER")
});
export async function POST(req:Request){
 try{
  const data=schema.parse(await req.json());
  const existing=await prisma.user.findFirst({where:{OR:[{mobile:data.mobile},...(data.email?[{email:data.email}]:[])]}});
  if(existing)return NextResponse.json({error:"Mobile number or email already registered"},{status:409});
  const passwordHash=await bcrypt.hash(data.password,12);
  const user=await prisma.user.create({data:{name:data.name,mobile:data.mobile,email:data.email||null,passwordHash,role:data.role,wallet:{create:{balance:0}}}});
  await createSession(user.id);
  return NextResponse.json({ok:true,role:user.role},{status:201});
 }catch(e){return NextResponse.json({error:e instanceof z.ZodError?e.issues[0]?.message:"Unable to register account"},{status:400})}
}
