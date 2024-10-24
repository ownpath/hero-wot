export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PawanMunjal.live",
  description: "Happy Birthday Legend!",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "postgreeting",
      href: "/postgreeting",
    },
    {
      label: "completeprofile",
      href: "/completeprofile",
    },
    {
      label: "adminpanel",
      href: "/adminpanel",
    },
    {
      label: "login",
      href: "/login",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
