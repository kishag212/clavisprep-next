import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/college-match", "Free College Match Quiz | ClavisPrep", "Find colleges to research based on your interests, grades, location, and preferences. Take the free ClavisPrep college match quiz to start your list.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
