/** v1–v5: women (`v*.jfif`); v6–v10: men — all in `public/images/`. */
export const leaders: Array<{
  name: string;
  rank: string;
  points: number;
  image?: string;
}> = [
  { name: "Ayesha Khan", rank: "Super Platinum", points: 248, image: "public/images/v1.jfif" },
  { name: "Zainab Tariq", rank: "Platinum", points: 180, image: "public/images/v2.jfif" },
  { name: "Sara Malik", rank: "Gold", points: 96, image: "public/images/v3.jfif" },
  { name: "Fatima Noor", rank: "Platinum", points: 142, image: "public/images/v4.jfif" },
  { name: "Hira Sohail", rank: "Super Platinum", points: 260, image: "public/images/v5.jfif" },
  { name: "Usman Tariq", rank: "Platinum", points: 165, image: "public/images/v6.jfif" },
  { name: "Saad Malik", rank: "Gold", points: 88, image: "public/images/v7.jfif" },
  { name: "Bilal Ahmed", rank: "Classic", points: 42, image: "public/images/v8.jfif" },
  { name: "Hamza Ali", rank: "Platinum", points: 121, image: "public/images/v9.jfif" },
  { name: "Muneeb Shah", rank: "Gold", points: 76, image: "public/images/v10.jfif" },
];

export const services = [
  {
    title: "Visa Consultancy",
    description: "Expert guidance for choosing the right destination and visa path.",
  },
  {
    title: "Documentation Support",
    description: "Complete preparation and review of official application documents.",
  },
  {
    title: "Business Promotion",
    description: "Structured growth model to build long-term business opportunities.",
  },
  {
    title: "Referral Program",
    description: "Automated multi-level referral rewards with transparent tracking.",
  },
];

export const benefits = [
  "Global Opportunities",
  "Passive Income Potential",
  "Referral Rewards",
  "Rank Growth",
];

export const countries = ["UK", "Canada", "Australia", "Germany", "UAE", "Italy"];

export const rewardMilestones = [
  { points: 20, reward: "Domestic Tour" },
  { points: 52, reward: "International Tour" },
  { points: 116, reward: "Business Tour" },
  { points: 200, reward: "Business Opportunity" },
];

export const referralRows = [
  { name: "Ali Raza", level: "Level 1", points: 5, joined: "2026-03-02" },
  { name: "Maryam Iqbal", level: "Level 2", points: 2, joined: "2026-03-10" },
  { name: "Danish Khan", level: "Level 3", points: 1, joined: "2026-03-18" },
  { name: "Noor Fatima", level: "Level 4", points: 1, joined: "2026-03-20" },
];
