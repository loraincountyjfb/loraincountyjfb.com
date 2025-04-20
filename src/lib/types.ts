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
    title: string;
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
  sectionDescription: any[];
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

export interface SliderContent {
  _type: 'slider';
  title: string;
  description?: string;
  slides: {
    image: {
      url?: string;
    };
    alt?: string;
    caption?: string;
  }[];
  autoplay?: boolean;
  interval?: number;
}

export interface CalendarContent {
  _type: 'calendar';
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
}

export interface FacebookCalloutContent {
  _type: 'facebookCallout';
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
  image?: {
    url?: string;
  };
}

export interface RelatedVideosContent {
  _type: 'relatedVideos';
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
  videos: {
    video: {
      url?: string;
      alt?: string;
      link?: string;
    };
    title: string;
  }[];
}

// Sponsors content block
export interface Sponsors {
  _type: 'sponsors';
  sponsors: {
    title: string;
    numberOfColumns: number;
    sponsorsList: string[];
  }[];
}

export interface TimelineContent {
  _type: 'timeline';
  timelineEvents: {
    title: string;
    year: number;
    description: any[];
    image: {
      url?: string;
    };
  }[];
}

export interface NewsContent {
  _type: 'news';
  title: string;
  description: any[];
  news: {
    title: string;
    image?: {
      url?: string;
    };
    link?: string;
    linkText?: string;
  }[];
}

export interface DonorImagesContent {
  _type: 'donorImages';
  title: string;
  description: any[];
  link?: string;
  linkText?: string;
  donorImages: {
    title: string;
    image?: {
      url?: string;
    };
  }[];
}

export interface WinnersContent {
  _type: 'winners';
  title: string;
  description: any[];
  winners: {
    title: string;
    year: number;
    description: any[];
    image?: {
      url?: string;
    };
  }[];
}

export type PageContent = 
  | HeroContent 
  | ContentBlock 
  | ThreeColumnContent 
  | LogosContent 
  | SplitContentWithImageContent 
  | CaseStudiesContent
  | SliderContent
  | CalendarContent
  | FacebookCalloutContent
  | RelatedVideosContent
  | Sponsors
  | TimelineContent
  | NewsContent
  | DonorImagesContent
  | WinnersContent;

export interface PageData {
  title: string;
  content?: PageContent[];
} 