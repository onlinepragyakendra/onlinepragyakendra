"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
function RegisterForm(){
 const router=useRouter(), params=useSearchParams(); const [role,setRole]=useState(params.get("role")||"CUSTOMER");
 const [name,setName]=useState(""),[mobile,setMobile]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[msg,setMsg]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMsg("");try{const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,mobile,email,password,role})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Registration failed");router.push("/dashboard")}catch(e){setMsg(e instanceof Error?e.message:"Something went wrong")}finally{setBusy(false)}}
 return <div className="formwrap"><a className="brand" href="/">ONLINE <span>PRAGYA KENDRA</span></a><form className="formbox" onSubmit={submit}><h2>Create account</h2><p className="muted">Register to access the service portal.</p><label className="label">Account type</label><select className="field" value={role} onChange={e=>setRole(e.target.value)}><option value="CUSTOMER">Customer</option><option value="RETAILER">Retailer</option><option value="DISTRIBUTOR">Distributor</option></select><label className="label">Full name</label><input className="field" required value={name} onChange={e=>setName(e.target.value)} /><label className="label">Mobile number</label><input className="field" required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value)} /><label className="label">Email (optional)</label><input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} /><label className="label">Password (min. 8 characters)</label><input className="field" required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} />{msg&&<p className="notice">{msg}</p>}<button className="btn" disabled={busy} style={{width:"100%"}}>{busy?"Creating...":"Create account"}</button><p className="muted">Already registered? <a href="/login">Login</a></p></form></div>
}
export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
