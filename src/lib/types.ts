// Define common types for page components across the site

export interface HeroContent {
  _type: 'hero';
  title: string;
  description: string;
  link: string;
  linkText: string;
  image?: {
    url?: string;
  };
}

export interface ContentBlock {
  _type: 'content';
  title: string;
  description: any[];
  features?: {
    text: string;
    icon?: {
      url?: string;
    };
  }[];
  actions?: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'text';
  }[];
  media?: {
    type: 'image' | 'video';
    position: 'left' | 'right';
    image?: {
      url?: string;
      alt?: string;
    };
    video?: string;
    width?: number;
    animation?: boolean;
  };
  spacing?: 'none' | 'small' | 'medium' | 'large';
  background?: 'white' | 'primary-light' | 'light-gray';
  verticalAlignment?: 'top' | 'center' | 'bottom';
}

export interface ThreeColumnContent {
  _type: 'threeColumn';
  sectionTitle: string;
  columns: {
    title: string;
    description: any[];
    image?: {
      url?: string;
    };
  }[];
}

export interface LogosContent {
  _type: 'logos';
  title?: string;
  logos: {
    image: {
      url?: string;
    };
    alt: string;
    link?: string;
  }[];
}

export interface SplitContentWithImageContent {
  _type: 'splitContentWithImage';
  title?: string;
  leftBox: {
    title: string;
    content: any[];
  };
  rightBox: {
    title: string;
    content: any[];
  };
  ctaLink?: {
    text: string;
    url: string;
  };
  circleColor: 'peach' | 'blue' | 'green' | 'yellow';
}

export interface CaseStudiesContent {
  _type: 'caseStudies';
  title: string;
  studies: {
    clientLogo: {
      url?: string;
    };
    content: any[];
    ctaLink?: {
      text: string;
      url: string;
    };
  }[];
}

export type PageContent = 
  | HeroContent 
  | ContentBlock 
  | ThreeColumnContent 
  | LogosContent 
  | SplitContentWithImageContent 
  | CaseStudiesContent;

export interface PageData {
  title: string;
  content?: PageContent[];
} 