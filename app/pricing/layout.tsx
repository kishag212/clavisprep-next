import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/pricing", "College Planning Plans & Pricing | ClavisPrep", "Compare ClavisPrep Free and Pro plans. Start with the free college match quiz and review available college-planning features before upgrading.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
