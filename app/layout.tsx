import type { Metadata } from "next";
import { DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ClavisPrep — The Key to Your College Future",
  description: "AI-powered college prep. Get your personalized reach, match, and safety school list in 5 minutes.",
  keywords: "college prep, AI college counselor, reach match safety, college application tracker",
  openGraph: {
    title: "ClavisPrep — The Key to Your College Future",
    description: "AI-powered college prep. Get your personalized college list in 5 minutes.",
    url: "https://clavisprep.com",
    siteName: "ClavisPrep",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={dmSans.variable}>
        {children}
      </body>
    </html>
  );
}