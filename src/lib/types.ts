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
    link?: string;
    linkText?: string;
  }[];
}

export interface ScheduleContent {
  _type: 'schedule';
  title: string;
  description: any[];
  scheduleItems: {
    day: string;
    startTime: string;
    items: {
      category: string;
      item: string;
    }[];
  }[];
  note?: string;
}

export interface RequirementsContent {
  _type: 'requirements';
  title: string;
  requirementsTitle: string;
  requirementsLocation: string;
  requirementItems: {
    item: string;
  }[];
}

export interface AwardTabsContent {
  _type: 'awardTabs';
  title: string;
  tabs: {
    title: string;
    content: {
      category: string;
      items: {
        title: string;
        value: string;
      }[];
    }[];
  }[];
}


// Field definitions for each form type
export interface FormFields {
  beef: {
    weight: boolean;
    grade: boolean;
    age: boolean;
    breed: boolean;
  };
  pig: {
    weight: boolean;
    litterSize: boolean;
    age: boolean;
    breed: boolean;
  };
  chicken: {
    weight: boolean;
    eggProduction: boolean;
    age: boolean;
    breed: boolean;
  };
  sheep: {
    weight: boolean;
    woolQuality: boolean;
    age: boolean;
    breed: boolean;
  };
  general: {
    // Default fields that appear in all forms
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    notes: boolean;
  };
}

export interface FormContent {
  _type: 'form';
  title: string;
  description: string;
  backgroundImage?: {
    url?: string;
    alt?: string;
  };
  submitButtonText?: string;
  textPosition?: 'left' | 'right';
  id?: string;
  formType: string;
  link?: string;
  linkText?: string;
}

export interface VideosContent {
  _type: 'videos';
  heroLayout: 'simpleButtons' | 'imageWithText' | 'featureBlocks' | 'teamFormat';
  title: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitle?: string;
  mainImage?: { url?: string };
  secondaryImage?: { url?: string };
  buttons?: {
    text: string;
    link: string;
  }[];
  featureBlocks?: {
    title: string;
    icon?: { asset?: { url?: string } };
    link?: string;
    backgroundColor?: string;
  }[];
  socialLinks?: {
    platform: string;
    url: string;
    customIcon?: { asset?: { url?: string } };
  }[];
  backgroundColor?: string;
  textColor?: string;
}

export interface GalleryContent {
  _type: 'gallery';
  title: string;
  description?: string;
  images: {
    asset: {
      url?: string;
      alt?: string;
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
  | WinnersContent
  | ScheduleContent
  | RequirementsContent
  | AwardTabsContent
  | FormContent
  | VideosContent
  | GalleryContent;

export interface PageData {
  title: string;
  content?: PageContent[];
} 