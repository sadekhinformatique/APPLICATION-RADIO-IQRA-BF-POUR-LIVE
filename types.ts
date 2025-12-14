export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'whatsapp' | 'website' | 'youtube';
  url: string;
}

export interface RadioConfig {
  /** The name of the radio station displayed prominently */
  stationName: string;
  /** The slogan or subtitle */
  tagline: string;
  /** The direct URL to the MP3/AAC stream */
  streamUrl: string;
  /** URL to the station's logo image */
  logoUrl: string;
  /** Accent color for buttons and visualizers (hex code or Tailwind color name) */
  themeColor: string;
  /** List of social media links */
  socials: SocialLink[];
}
