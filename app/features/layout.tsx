import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/features", "College Planning Tools & Features | ClavisPrep", "Explore ClavisPrep tools for college matching, activity planning, essay support, and organizing your college application journey.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
