export const siteConfig = {
  business: {
    name: "Seen Fitness",
    tagline: "A fitness program that actually sees you.",
    address: { street: "123 Main Street", city: "Lilburn", state: "GA", zip: "30047", country: "US" },
    phone: "(770) 555-0123",
    email: "hello@seenfitness.com",
    hours: { monday: "6:00 AM – 8:00 PM", tuesday: "6:00 AM – 8:00 PM", wednesday: "6:00 AM – 8:00 PM", thursday: "6:00 AM – 8:00 PM", friday: "6:00 AM – 6:00 PM", saturday: "8:00 AM – 12:00 PM", sunday: "Closed" },
    geo: { lat: 33.8901, lng: -84.1430 },
    socials: { instagram: "https://instagram.com/seenfitness", facebook: "https://facebook.com/seenfitness" },
    priceRange: "$$",
    foundedYear: 2026,
  },
  seo: {
    titleTemplate: "%s | Seen Fitness — Lilburn, GA",
    defaultTitle: "Seen Fitness | Small Group Fitness in Lilburn, GA",
    defaultDescription: "Small group fitness classes with real coaching in Lilburn, GA. Strength, kickboxing, and somatic movement. Coaches who know your name.",
    keywords: ["gym Lilburn GA", "fitness classes Lilburn", "personal training Gwinnett County", "yoga near me Lilburn", "kickboxing Lilburn GA", "strength training Stone Mountain"],
    ogImage: "/og-default.png",
  },
  hero: {
    badge: "Now Open · Lilburn, GA",
    headline: "You've been looking for a fitness program that actually sees you.",
    subheadline: "We spent 20+ years coaching in other people's spaces. Now we're building our own—and we're building it with you. A place where coaches know your name, your goals, and what you need to get there.",
    ctaText: "View schedule & reserve your spot",
    ctaHref: "/schedule",
  },
  classTypes: [
    { name: "Strength & Conditioning", slug: "strength-conditioning", shortDescription: "Learn what your body can actually do when someone's paying attention. Real coaching, real progression—from unsure to confident under the bar.", longDescription: "Our strength & conditioning classes are capped at 12 people so your coach tracks your progress week to week. Whether you're touching a barbell for the first time or chasing a new PR, every session is programmed with progressive overload and individual scaling. You'll learn proper form, build functional strength, and develop the confidence that carries over into everything else you do.", capacity: 12, icon: "Dumbbell" },
    { name: "Kickboxing & Self-Defense", slug: "kickboxing", shortDescription: "Walk in carrying your day. Walk out carrying yourself differently. Empowering, challenging, and built around skills that stay with you.", longDescription: "Our kickboxing classes are capped at 16 with a coach who adjusts every drill to your level. You'll learn real striking technique, build cardio endurance, and develop self-defense awareness—all in a supportive environment where beginners and experienced athletes train side by side. Every class ends with you feeling stronger than when you walked in.", capacity: 16, icon: "Flame" },
    { name: "Somatic Movement", slug: "somatic-movement", shortDescription: "The class no one expects to love—and can't stop talking about. Psychology meets movement. Restore the connection between your mind and body.", longDescription: "Capped at 8 so your coach can give truly individual guidance. Somatic movement blends breathwork, gentle stretching, and mindful movement patterns to release chronic tension and restore your body's natural ease. This isn't yoga—it's a practice rooted in neuroscience that helps you reconnect with how your body was meant to move. Perfect for stress relief, injury recovery, or anyone who feels disconnected from their body.", capacity: 8, icon: "Wind" },
  ],
  instructors: [
    { name: "Coach Name", slug: "coach-name", role: "Co-Founder & Head Coach", bio: "20+ years of coaching experience. Certified in strength & conditioning, kickboxing, and somatic movement. Passionate about creating spaces where everyone belongs.", specialties: ["Strength & Conditioning", "Kickboxing"], photo: "/instructors/placeholder.jpg" },
    { name: "Coach Name 2", slug: "coach-name-2", role: "Co-Founder & Movement Specialist", bio: "Background in psychology and movement science. Believes that fitness starts with feeling safe in your own body.", specialties: ["Somatic Movement", "Strength & Conditioning"], photo: "/instructors/placeholder.jpg" },
  ],
  testimonials: [
    { quote: "This is the first gym where I didn't feel like I had to already be fit to walk through the door.", name: "Sarah M.", memberSince: "2026" },
    { quote: "The coaches actually remember what we worked on last week. That's never happened to me at a gym.", name: "James T.", memberSince: "2026" },
    { quote: "I came for the kickboxing and stayed for the community. This place is special.", name: "Maria L.", memberSince: "2026" },
  ],
  neighborhoods: [
    { name: "Lilburn", description: "Our home base. Located right in the heart of Lilburn, GA.", driveTime: "0 min" },
    { name: "Stone Mountain", description: "Just a quick drive from Stone Mountain village.", driveTime: "10 min" },
    { name: "Tucker", description: "Easy access from Tucker via Highway 29.", driveTime: "12 min" },
    { name: "Norcross", description: "A short drive from Norcross and the Peachtree Corners area.", driveTime: "15 min" },
    { name: "Snellville", description: "Convenient for Snellville residents via Highway 78.", driveTime: "12 min" },
    { name: "Lawrenceville", description: "Quick access from Lawrenceville and greater Gwinnett County.", driveTime: "18 min" },
  ],
  about: {
    storyHeadline: "Two coaches. One mission. A gym that sees you.",
    storyBody: [
      "We spent 20 years coaching in other people's spaces—big-box gyms, boutique studios, corporate wellness programs. We watched talented people walk in, get ignored, and walk out.",
      "So we built Seen Fitness. A place where classes are small enough that your coaches actually know your name by day one. Where the programming meets you where you are, not where some algorithm thinks you should be.",
      "We're not trying to be the biggest gym in Gwinnett County. We're trying to be the one you actually look forward to walking into.",
    ],
    mission: "To create a fitness community where every person is coached, known, and challenged—regardless of where they're starting from.",
  },
  footer: {
    tagline: "Founded by two coaches who'd rather know your name than count your reps.",
    legalName: "Seen Fitness LLC",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type ClassType = (typeof siteConfig.classTypes)[number];
export type Instructor = (typeof siteConfig.instructors)[number];
export type Neighborhood = (typeof siteConfig.neighborhoods)[number];
