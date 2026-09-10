import type { Metadata } from "next";

export function publicPageMetadata(path: string, title: string, description: string): Metadata {
  const url = `https://clavisprep.com${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "ClavisPrep", type: "website" },
    twitter: { card: "summary", title, description },
  };
}
