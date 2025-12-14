import React from 'react';
import { SocialLink } from '../types';
import { Facebook, Twitter, Instagram, Globe, Youtube, Phone } from 'lucide-react';

interface SocialLinksProps {
  links: SocialLink[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'whatsapp': return <Phone className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-all duration-300 hover:-translate-y-1 border border-slate-700 shadow-md"
          aria-label={`Visit our ${link.platform}`}
        >
          {getIcon(link.platform)}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;