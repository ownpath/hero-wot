import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        ztNeueRalewe: ["var(--font-zt-neue-ralewe)", "sans-serif"],
        playfair: ["var(--font-playfair)"],
      },
      flexGrow: {
        1: 1,
        2: 2,
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      addCommonColors: false,
      layout: {
        radius: {
          small: "4px",
          medium: "8px",
          large: "12px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        "guardian-1": {
          extend: "dark",
          colors: {
            background: "#FF8B00",
            hourglass: "#090E28",
            numbers: "#E2EFF0",
            comingSoon: "#FEC400",
            daysToGo: "#E1EFF0",
            aTaleAwaits: "#FEC400",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FF8B00",
            buttonText: "#000000",
            modal: "#090E28",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FEC400",
            masonryCardColor: "#090E28",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#090E28",
            masonryButtonBg: "#FF8B00",
            masonryButtonText: "#000000",
          },
        },
        "going-global-1": {
          extend: "dark",
          colors: {
            background: "#F4F0ED",
            hourglass: "#02A15F",
            numbers: "#F4F0ED",
            comingSoon: "#0B0A07",
            daysToGo: "#F4F0ED",
            aTaleAwaits: "#DCE8DF",
            becomePartOfStory: "#DCE8DF",
            buttonBackground: "#1D1B1B",
            buttonText: "#FFFFFF",
            modal: "#02A15F",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#0B0A07",
            masonryCardColor: "#02A15F",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#02A15F",
            masonryButtonText: "#FFFFFF",
          },
        },
        "going-global-2": {
          extend: "dark",
          colors: {
            background: "#FFFFFF",
            hourglass: "#05C850",
            numbers: "#F4F0ED",
            comingSoon: "#004DD1",
            daysToGo: "#F4F0ED",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#1D1B1B",
            buttonText: "#FFFFFF",
            modal: "#05C850",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#004DD1",
            masonryCardColor: "#05C850",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "hero-1": {
          extend: "dark",
          colors: {
            background: "#FFFFFF",
            hourglass: "#000000",
            numbers: "#FFFFFF",
            comingSoon: "#EE2326",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#EE2326",
            buttonText: "#FFFFFF",
            modal: "#000000",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#EE2326",
            masonryCardColor: "#000000",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "hero-2": {
          extend: "dark",
          colors: {
            background: "#FFFFFF",
            hourglass: "#EE2326",
            numbers: "#FFFFFF",
            comingSoon: "#000000",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#000000",
            buttonText: "#FFFFFF",
            modal: "#EE2326",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#000000",
            masonryCardColor: "#000000",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        vida: {
          extend: "light",
          colors: {
            background: "#FF5310",
            hourglass: "#FFFFFF",
            numbers: "#1D1B1B",
            comingSoon: "#FF5310",
            daysToGo: "#1D1B1B",
            aTaleAwaits: "#1D1B1B",
            becomePartOfStory: "#1D1B1B",
            buttonBackground: "#1D1B1B",
            buttonText: "#FFFFFF",
            modal: "#FFFFFF",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#FF5310",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "past-history": {
          extend: "light",
          colors: {
            background: "#70CCD3",
            hourglass: "#F1EBD7",
            numbers: "#020204",
            comingSoon: "#DF4752",
            daysToGo: "#020204",
            aTaleAwaits: "#020204",
            becomePartOfStory: "#020204",
            buttonBackground: "#020204",
            buttonText: "#FFFFFF",
            modal: "#F1EBD7",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#DF4752",
            masonryCardColor: "#F1EBD7",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#70CCD3",
            masonryButtonText: "#000000",
          },
        },
        "motorsports-1": {
          extend: "light",
          colors: {
            background: "#2D48B5",
            hourglass: "#FBFBFB",
            numbers: "#01030E",
            comingSoon: "#E22C0B",
            daysToGo: "#01030E",
            aTaleAwaits: "#01030E",
            becomePartOfStory: "#01030E",
            buttonBackground: "#01030E",
            buttonText: "#FFFFFF",
            modal: "#FBFBFB",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#E22C0B",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#2D48B5",
            masonryButtonText: "#FFFFFF",
          },
        },
        "motorsports-2": {
          extend: "light",
          colors: {
            background: "#49A4DA",
            hourglass: "#FBFBFB",
            numbers: "#352DA2",
            comingSoon: "#E22C0B",
            daysToGo: "#352DA2",
            aTaleAwaits: "#352DA2",
            becomePartOfStory: "#352DA2",
            buttonBackground: "#352DA2",
            buttonText: "#FFFFFF",
            modal: "#FBFBFB",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#E22C0B",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#49A4DA",
            masonryButtonText: "#FFFFFF",
          },
        },
        "motorsports-3": {
          extend: "dark",
          colors: {
            background: "#FFFFFF",
            hourglass: "#EE2326",
            numbers: "#FFFFFF",
            comingSoon: "#181819",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#EE2326",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#181819",
            masonryCardColor: "#000000",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "bravery-1": {
          extend: "dark",
          colors: {
            background: "#5A189A",
            hourglass: "#F72585",
            numbers: "#FDC500",
            comingSoon: "#E7E7E7",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#000000",
            buttonBackground: "#181819",
            buttonText: "#FFFFFF",
            modal: "#F72585",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#E7E7E7",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#5A189A",
            masonryButtonText: "#FFFFFF",
          },
        },
        "bravery-2": {
          extend: "dark",
          colors: {
            background: "#5A189A",
            hourglass: "#240046",
            numbers: "#FFFFFF",
            comingSoon: "#FDC500",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FDC500",
            buttonText: "#000000",
            modal: "#240046",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FDC500",
            masonryCardColor: "#240046",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#5A189A",
            masonryButtonText: "#FFFFFF",
          },
        },
        "bravery-3": {
          extend: "dark",
          colors: {
            background: "#240046",
            hourglass: "#F72585",
            numbers: "#FFFFFF",
            comingSoon: "#FDC500",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#5A189A",
            becomePartOfStory: "#000000",
            buttonBackground: "#FDC500",
            buttonText: "#000000",
            modal: "#F72585",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FDC500",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#240046",
            masonryButtonText: "#FFFFFF",
          },
        },
        "golf-1": {
          extend: "light",
          colors: {
            background: "#165432",
            hourglass: "#D1D5B4",
            numbers: "#FFFFFF",
            comingSoon: "#1A3F2D",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#165432",
            becomePartOfStory: "#165432",
            buttonBackground: "#1A3F2D",
            buttonText: "#FFFFFF",
            modal: "#D1D5B4",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#1A3F2D",
            masonryCardColor: "#D1D5B4",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#165432",
            masonryButtonText: "#FFFFFF",
          },
        },
        "golf-2": {
          extend: "light",
          colors: {
            background: "#194A44",
            hourglass: "#E9E8E6",
            numbers: "#961D24",
            comingSoon: "#FFFFFF",
            daysToGo: "#961D24",
            aTaleAwaits: "#C55127",
            becomePartOfStory: "#C55127",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#E9E8E6",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#FFFFFF",
            masonryCardColor: "#E9E8E6",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#194A44",
            masonryButtonText: "#FFFFFF",
          },
        },
        "golf-3": {
          extend: "dark",
          colors: {
            background: "#053321",
            hourglass: "#9BA148",
            numbers: "#FFFFFF",
            comingSoon: "#FDC500",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FDC500",
            buttonText: "#000000",
            modal: "#9BA148",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FDC500",
            masonryCardColor: "#9BA148",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#053321",
            masonryButtonText: "#FFFFFF",
          },
        },
        "guiding-1": {
          extend: "dark",
          colors: {
            background: "#FDE8A5",
            hourglass: "#B83724",
            numbers: "#FFFFFF",
            comingSoon: "#FDC500",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FDC500",
            buttonText: "#000000",
            modal: "#B83724",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FDC500",
            masonryCardColor: "#B83724",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#FDE8A5",
            masonryButtonText: "#FFFFFF",
          },
        },
        "guiding-2": {
          extend: "light",
          colors: {
            background: "#CC682C",
            hourglass: "#FFFFFF",
            numbers: "#BD3922",
            comingSoon: "#29273D",
            daysToGo: "#BD3922",
            aTaleAwaits: "#BD3922",
            becomePartOfStory: "#BD3922",
            buttonBackground: "#29273D",
            buttonText: "#FFFFFF",
            modal: "#FFFFFF",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#29273D",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#CC682C",
            masonryButtonText: "#FFFFFF",
          },
        },
        "guiding-3": {
          extend: "light",
          colors: {
            background: "#33ADDA",
            hourglass: "#E7E7E7",
            numbers: "#CD2128",
            comingSoon: "#FFFFFF",
            daysToGo: "#CD2128",
            aTaleAwaits: "#CD2128",
            becomePartOfStory: "#CD2128",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#E7E7E7",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#FFFFFF",
            masonryCardColor: "#E7E7E7",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#33ADDA",
            masonryButtonText: "#FFFFFF",
          },
        },
        "romantic-1": {
          extend: "dark",
          colors: {
            background: "#6E4646",
            hourglass: "#B20B13",
            numbers: "#F52A61",
            comingSoon: "#FEEDDD",
            daysToGo: "#FFFFFF",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FEEDDD",
            buttonText: "#000000",
            modal: "#B20B13",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FEEDDD",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#6E4646",
            masonryButtonText: "#FFFFFF",
          },
        },
        "romantic-2": {
          extend: "dark",
          colors: {
            background: "#F52A61",
            hourglass: "#282828",
            numbers: "#EF405B",
            comingSoon: "#FFFFFF",
            daysToGo: "#EF405B",
            aTaleAwaits: "#EF405B",
            becomePartOfStory: "#FFD3D4",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#282828",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FFFFFF",
            masonryCardColor: "#282828",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#F52A61",
            masonryButtonText: "#FFFFFF",
          },
        },
        "romantic-3": {
          extend: "light",
          colors: {
            background: "#90278E",
            hourglass: "#EC0975",
            numbers: "#FFF6ED",
            comingSoon: "#961D24",
            daysToGo: "#FFF6ED",
            aTaleAwaits: "#FFF6ED",
            becomePartOfStory: "#FFF6ED",
            buttonBackground: "#961D24",
            buttonText: "#FFFFFF",
            modal: "#EC0975",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#961D24",
            masonryCardColor: "#EC0975",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#90278E",
            masonryButtonText: "#FFFFFF",
          },
        },
        "guardian-1-alt": {
          extend: "dark",
          colors: {
            background: "#5387B0",
            hourglass: "#C54B3D",
            numbers: "#000000",
            comingSoon: "#FFFFFF",
            daysToGo: "#000000",
            aTaleAwaits: "#000000",
            becomePartOfStory: "#FFD3D4",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#C54B3D",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FFFFFF",
            masonryCardColor: "#C54B3D",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#5387B0",
            masonryButtonText: "#FFFFFF",
          },
        },
        "guardian-2": {
          extend: "dark",
          colors: {
            background: "#AC2411",
            hourglass: "#00517C",
            numbers: "#FFB503",
            comingSoon: "#FFFFFF",
            daysToGo: "#FFB503",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#AC2411",
            buttonText: "#FFFFFF",
            modal: "#00517C",
            headingText: "#FFFFFF",
            input: "#595959",
            placeHolder: "#C7C7C7",
            cta: "#FFFFFF",
            masonryCardColor: "#00517C",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#AC2411",
            masonryButtonText: "#FFFFFF",
          },
        },
        "guardian-3": {
          extend: "light",
          colors: {
            background: "#FFFDFA",
            hourglass: "#0060CD",
            numbers: "#FFFFFF",
            comingSoon: "#FDC500",
            daysToGo: "#FFF6ED",
            aTaleAwaits: "#FFF6ED",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FDC500",
            buttonText: "#000000",
            modal: "#0060CD",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#FDC500",
            masonryCardColor: "#0060CD",
            masonryCardText: "#FFFFFF",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "india-ict-1": {
          extend: "light",
          colors: {
            background: "#FFFDFA",
            hourglass: "#1DADF8",
            numbers: "#FEBD55",
            comingSoon: "#FFFFFF",
            daysToGo: "#FEBD55",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#1DADF8",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#FFFFFF",
            masonryCardColor: "#1DADF8",
            masonryCardText: "#000000",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "india-ict-2": {
          extend: "light",
          colors: {
            background: "#FFFFFF",
            hourglass: "#FF9934",
            numbers: "#FFFFFF",
            comingSoon: "#010080",
            daysToGo: "#138708",
            aTaleAwaits: "#138708",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#FF9934",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#010080",
            masonryCardColor: "#FF9934",
            masonryCardText: "#000000",
            masonryNavbar: "#202020",
            masonryButtonBg: "#FFFFFF",
            masonryButtonText: "#000000",
          },
        },
        "india-ict-3": {
          extend: "light",
          colors: {
            background: "#1E6EEE",
            hourglass: "#FD5F2B",
            numbers: "#FFB503",
            comingSoon: "#FFFFFF",
            daysToGo: "#FFB503",
            aTaleAwaits: "#FFFFFF",
            becomePartOfStory: "#FFFFFF",
            buttonBackground: "#FFFFFF",
            buttonText: "#000000",
            modal: "#FD5F2B",
            headingText: "#000000",
            input: "#F5F5F5",
            placeHolder: "#6B6F80",
            cta: "#FFFFFF",
            masonryCardColor: "#FFFFFF",
            masonryCardText: "#000000",
            masonryNavbar: "#FFFFFF",
            masonryButtonBg: "#1E6EEE",
            masonryButtonText: "#FFFFFF",
          },
        },
      },
    }),
  ],
};
