import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Public routes only. Omit lastModified until reliable page dates are available.
  const routes = [
    "", "/about", "/features", "/how-it-works", "/pricing",
    "/college-match", "/scholarships", "/essay-coach", "/calculator",
    "/colleges", "/resources", "/blog", "/contact",
  ];

  return routes.map((route) => ({ url: `https://clavisprep.com${route}` }));
}
