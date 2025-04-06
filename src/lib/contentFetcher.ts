import type { PageData } from './types';
import { loadQuery } from '../../lib/load-query';

/**
 * Shared query fragment for page content
 */
export const PAGE_CONTENT_QUERY = `
  title,
  content[]{
  _type,
  title,
  description,
  link,
  linkText,
  "image": image{
    "url": asset->url
  },
  // Three Column fields
  sectionTitle,
  "columns": columns[]{
    title,
    description,
    "image": image{
      "url": asset->url
    }
  },
  // Content block fields
  "features": features[]{
    text,
    "icon": icon{
      "url": asset->url
    }
  },
  "actions": actions[]{
    text,
    link,
    variant
  },
  "media": media{
    type,
    position,
    "image": image{
      "url": asset->url,
      alt
    },
    video,
    width,
    animation 
  },
  spacing,
  background,
  verticalAlignment,
  // Logos fields
  "logos": logos[]{
    "image": image{
      "url": asset->url
    },
    alt,
    link
  },
  // Split Content With Image fields
  "leftBox": leftBox{
    title,
    content
  },
  "rightBox": rightBox{
    title,
    content
  },
  "ctaLink": ctaLink{
    text,
    url
  },
  circleColor,
  // Case Studies fields
  "studies": studies[]{
    "clientLogo": clientLogo{
      "url": asset->url
    },
    content,
    "ctaLink": ctaLink{
      text,
      url
    }
  }
}`;

/**
 * Fetch a page by slug
 */
export async function fetchPageBySlug(slug: string, preview: boolean = false): Promise<PageData> {
  const { data: page } = await loadQuery({
    query: `*[_type == "page" && slug.current == $slug][0]{${PAGE_CONTENT_QUERY}}`,
    params: { slug },
    enabled: true
  });

  // Return found page or fallback page data
  return page || { title: '404 - Page Not Found', content: [] };
}

/**
 * Fetch the homepage content
 */
export async function fetchHomepage(preview: boolean = false): Promise<PageData> {
  const { data: homepage } = await loadQuery({
    query: `*[_type == "home"][0]{${PAGE_CONTENT_QUERY}}`,
    params: {},
    enabled: true
  });

  // Return found homepage or fallback page data
  return homepage || { 
    title: 'Mosaic eMarketing - Digital Marketing Agency', 
    content: []
  };
}

/**
 * Determines if the current request is in preview mode
 */
export function isPreviewMode(url: string): boolean {
  return url.includes('preview');
} 