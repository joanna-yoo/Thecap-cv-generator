export interface ContactLink {
  text: string;
  url: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  github: string;
  website: string;
  location: string;
  links: ContactLink[];
}

export interface CvRole {
  title: string;
  date?: string;
  details: string[];
}

export interface CvItem {
  primary?: string;
  primaryRight?: string;
  secondary?: string;
  secondaryRight?: string;
  roles?: CvRole[]; // New: Supports multiple positions
  details: string[];
  break?: boolean;
}

export interface CvSection {
  title: string;
  items: CvItem[];
  break?: boolean;
}

export interface CvProperties {
  [key: string]: string | string[];
}

export interface CvData {
  properties?: CvProperties;
  contact: ContactInfo;
  sections: CvSection[];
}