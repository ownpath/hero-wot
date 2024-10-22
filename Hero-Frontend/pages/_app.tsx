import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { montserrat } from "@/config/fonts";
import "@/styles/globals.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <main className={`${montserrat.variable} font-sans`}>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider>
            <Component {...pageProps} />
          </NextThemesProvider>
        </QueryClientProvider>
      </main>
    </NextUIProvider>
  );
}

// export const fonts = {
//   sans: fontSans.style.fontFamily,
//   mono: fontMono.style.fontFamily,
// };
