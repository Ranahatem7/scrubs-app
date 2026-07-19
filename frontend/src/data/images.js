// Unsplash — free for commercial use, no attribution required.
// Replace these with real MedTrack product photography before launch.

const u = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const images = {
  hero: u("1761234852472-85aeea9c3eac", 1600), // woman in green scrubs, stethoscope

  category: {
    tops: u("1769072610024-5b8a50f05c73", 800),      // surgeon in blue scrubs
    pants: u("1621862926530-37a46ba900bb", 800),     // full-body, blue scrub pants
    fullScrub: u("1776104501657-a4d9fb6ce7f4", 800), // sterile gown, full set
    jackets: u("1765222385397-6c2ea556086f", 800),   // nurse, layered warm-up
    labCoats: u("1676286529851-4555b4d2def0", 800),  // lab coat, black and white
  },

  product: {
    graphiteTop: u("1762190102324-116a615896da", 700),
    midnightTop: u("1621862912856-0909fb7f14b7", 700),
    onyxPant: u("1769072610024-5b8a50f05c73", 700),
    boneLabCoat: u("1676286529851-4555b4d2def0", 700),
  },
};