import { RadioConfig } from './types';

export const radioConfig: RadioConfig = {
  stationName: "RADIO IQRA FM",
  tagline: "La voix du saint coran",
  // Correction: Utilisation de l'URL de flux direct (sans .m3u)
  streamUrl: "https://stream.zeno.fm/ztmkyozjspltv.m3u", 
  logoUrl: "https://raw.githubusercontent.com/sadekhinformatique/IQRA_IMAGES/refs/heads/main/iqra%20logo%20ok.png",
  themeColor: "#3b82f6", // Blue-500
  socials: [
    { platform: 'facebook', url: 'https://facebook.com/profile.php?id=61571862830361' },
    { platform: 'twitter', url: 'https://x.com/iqra_radio4578' },
    { platform: 'instagram', url: 'https://instagram.com/radioiqratv_officielle?igsh=bTB1NDF6aGNtM3Uy' },
    { platform: 'whatsapp', url: 'https://whatsapp.com' },
    { platform: 'website', url: 'https://radioiqraburkina.com' },
    { platform: 'tiktok', url: 'https://tiktok.com/@radio.iqra.tv' },
  ]
};