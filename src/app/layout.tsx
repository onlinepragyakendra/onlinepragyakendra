import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Pragya Kendra | Digital Services",
  description: "B2C and G2C digital services, retailer and distributor portal."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
