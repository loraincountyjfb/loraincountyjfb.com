import type { APIRoute } from 'astro';

const isProduction = process.env.NODE_ENV === "production";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
${isProduction ? "Disallow: /" : "Disallow: /"}


Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};