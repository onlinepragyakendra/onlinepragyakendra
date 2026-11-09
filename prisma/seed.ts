import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma=new PrismaClient();
async function main(){
 const mobile=process.env.SEED_ADMIN_MOBILE;
 const password=process.env.SEED_ADMIN_PASSWORD;
 if(!mobile||!password){console.log("Set SEED_ADMIN_MOBILE and SEED_ADMIN_PASSWORD to create an admin.");return;}
 const passwordHash=await bcrypt.hash(password,12);
 await prisma.user.upsert({where:{mobile},update:{role:"ADMIN",isActive:true},create:{name:"Portal Administrator",mobile,passwordHash,role:"ADMIN",wallet:{create:{balance:0}}}});
 console.log("Admin account created/updated.");
}
main().finally(()=>prisma.$disconnect());
