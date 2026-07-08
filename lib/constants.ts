export const SITE_URL = "https://a2m-tech.com";

export const LINKS = {
  calendly: "https://calendly.com/a2m-tech",
  linkedin: "https://www.linkedin.com/company/a2m-tech",
  phone: "tel:+46101146559",
  phoneDisplay: "010-114 65 59",
  email: "mailto:anas-mofleh@hotmail.com",
  emailDisplay: "anas-mofleh@hotmail.com",
  orgNumber: "559506-4915",
  address: "Närlundavägen 11, 252 75 Helsingborg",
} as const;

export const TEAM = [
  {
    name: "Anas Muhannad Mofleh",
    roleKey: "anasRole" as const,
    bioKey: "anasBio" as const,
    tags: ["consulting", "mobile", "security"] as const,
    linkedin: "https://www.linkedin.com/in/anas-mofleh",
    email: "mailto:anas-mofleh@hotmail.com",
  },
  {
    name: "Abdulrahman Mofleh",
    roleKey: "abdulrahmanRole" as const,
    bioKey: "abdulrahmanBio" as const,
    tags: ["data", "ml", "cloud"] as const,
    linkedin: "https://www.linkedin.com/in/abdulrahman-mofleh",
    github: "https://github.com/abodi99",
    website: "https://abdulrahman-mofleh.com",
    email: "mailto:abed.mofleh.93@gmail.com",
  },
] as const;
