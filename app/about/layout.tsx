import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/about", "About ClavisPrep | College Planning for Families", "Learn about ClavisPrep and its mission to make college planning more accessible with practical tools for students and families.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
