import React from "react";
import NextHead from "next/head";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export const Head = () => {
  const baseUrl = "https://www.pawanmunjal.life";

  return (
    <NextHead>
      <title>{siteConfig.name}</title>
      <meta key="title" content={siteConfig.name} property="og:title" />
      <meta content={siteConfig.description} property="og:description" />
      <meta content={siteConfig.description} name="description" />
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />

      <meta property="og:image" content={`${baseUrl}/metapic.png`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />

      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
