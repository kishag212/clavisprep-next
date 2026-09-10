import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/how-it-works", "How ClavisPrep Works | Your College Planning Guide", "See how ClavisPrep helps you explore colleges, organize your next steps, and build a college plan based on your interests and goals.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
