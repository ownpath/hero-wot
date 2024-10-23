import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
});

export const ztNeueRalewe = localFont({
  src: [
    {
      path: "../public/fonts/ZTNeueRalewe-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/ZTNeueRalewe-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-zt-neue-ralewe",
});

export const fonts = {
  montserrat: montserrat.style.fontFamily,
  ztNeueRalewe: ztNeueRalewe.style.fontFamily,
  playfair: playfair.style.fontFamily,
};
