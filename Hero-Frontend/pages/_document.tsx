import { Html, Head, Main, NextScript } from "next/document";
import { clsx } from "clsx";
import { montserrat, ztNeueRalewe, playfair } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={clsx(
          "min-h-screen bg-background antialiased",
          montserrat.variable,
          ztNeueRalewe.variable,
          playfair.variable
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
