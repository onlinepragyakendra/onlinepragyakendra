import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function Dashboard(){
 const user=await getCurrentUser();if(!user)redirect("/login");
 const wallet=await prisma.wallet.findUnique({where:{userId:user.id}});
 const txns=await prisma.transaction.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:8});
 const money=(paise:number)=>`₹${(paise/100).toFixed(2)}`;
 return <div className="dashboard"><aside className="side"><div className="brand" style={{color:"white"}}>ONLINE PRAGYA</div><p style={{color:"#a8bdcf",fontSize:12}}>{user.role} PANEL</p><Link href="/dashboard">Overview</Link><Link href="/#services">Services</Link><Link href="/dashboard/wallet">Wallet</Link><Link href="/dashboard/transactions">Transactions</Link>{user.role==="ADMIN"&&<Link href="/dashboard/admin">Admin controls</Link>}</aside><main className="main"><div className="eyebrow">DASHBOARD</div><h1 style={{fontSize:30}}>Welcome, {user.name}</h1><p className="muted">Your {user.role.toLowerCase()} account overview.</p><div className="tiles"><div className="tile"><span className="muted">Wallet balance</span><strong>{money(wallet?.balance??0)}</strong></div><div className="tile"><span className="muted">Account status</span><strong style={{fontSize:18}}>{user.isActive?"Active":"Inactive"}</strong></div><div className="tile"><span className="muted">KYC status</span><strong style={{fontSize:18}}>{user.kycStatus}</strong></div></div><div className="card"><h2>Recent transactions</h2>{txns.length===0?<p className="muted">No transactions yet. Your activity will appear here.</p>:<table className="table"><thead><tr><th>Reference</th><th>Description</th><th>Status</th><th>Amount</th></tr></thead><tbody>{txns.map(t=><tr key={t.id}><td>{t.reference}</td><td>{t.description}</td><td>{t.status}</td><td>{money(t.amount)}</td></tr>)}</tbody></table>}</div><p className="notice" style={{marginTop:18}}>Service transactions are disabled until the relevant provider APIs, compliance requirements and production credentials are configured.</p></main></div>
}
