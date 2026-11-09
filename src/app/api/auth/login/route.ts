import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
const schema=z.object({mobile:z.string().regex(/^[0-9]{10}$/),password:z.string().min(1)});
export async function POST(req:Request){
 try{const data=schema.parse(await req.json());const user=await prisma.user.findUnique({where:{mobile:data.mobile}});
 if(!user||!user.isActive||!(await bcrypt.compare(data.password,user.passwordHash)))return NextResponse.json({error:"Invalid login details or inactive account"},{status:401});
 await createSession(user.id);return NextResponse.json({ok:true,role:user.role});
 }catch{return NextResponse.json({error:"Invalid request"},{status:400})}
}
