/**
 * Kurumsal sosyal medya hesapları. Alt bilgide simge olarak, yapısal veride sameAs olarak kullanılır.
 */
export const SOCIAL_LINKS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/ergentekstil/" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/ergentekstil/" },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];
