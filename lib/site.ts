// Central brand + link configuration. Edit here to update the whole site.

export const site = {
  name: "isa23",
  aliases: ["Screen Sage", "Omniversal Seeker"],
  // Update to the production domain after deploying.
  url: "https://isa23-links.vercel.app",
  tagline: "Where spirituality, science, and story collide",
  emojiTagline: "Where spirituality, science & story collide 🕉️⚛️💟",
  bio: "I help people see themselves clearly and evolve intentionally.",
  descriptor: "Podcast · software · photography · words.",
  equation: "0 = 1 = ∞",

  store: "https://screenseiji.gumroad.com/",

  screenSage: {
    youtube: "https://www.youtube.com/@screenseiji",
    tiktok: "https://www.tiktok.com/@screenseiji",
    instagram: "https://www.instagram.com/screenseiji/",
    website: "https://screenseiji.vercel.app/",
  },

  podcast: {
    name: "Seeker's Soliloquy",
    // Spotify show embed renders the latest episodes with inline playback.
    spotifyShowId: "2w5Gt1BLDsrcSjDyVIdbow",
    spotify: "https://open.spotify.com/show/2w5Gt1BLDsrcSjDyVIdbow",
    apple: "https://podcasts.apple.com/us/podcast/seekers-soliloquy/id1818254857",
    youtube:
      "https://youtube.com/playlist?list=PLFIy7SP1cnaoFKI1RVLYcxcsAphPf796h&si=ojqohZzYw_iNJfa4",
  },
} as const;

export const sameAs = [
  site.screenSage.youtube,
  site.screenSage.tiktok,
  site.screenSage.instagram,
  site.podcast.spotify,
  site.podcast.apple,
];
