import React from "react";
import NextHead from "next/head";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export const Head = () => {
  const baseUrl = "https://www.pawanmunjal.life";

  return (
    <NextHead>
      <title>Share your heartfelt wishes for #OurHeroAt70</title>
      <meta
        name="description"
        content="As we approach our chairman’s 70th birthday, we invite you to share your love, cherished memories, and heartfelt wishes.
"
      />

      <meta property="og:url" content="https://www.pawanmunjal.life/" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Share your heartfelt wishes for #OurHeroAt70"
      />
      <meta
        property="og:description"
        content="As we approach our chairman’s 70th birthday, we invite you to share your love, cherished memories, and heartfelt wishes.
"
      />
      <meta
        property="og:image"
        content="https://www.pawanmunjal.life/metapic.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="pawanmunjal.life" />
      <meta property="twitter:url" content="https://www.pawanmunjal.life/" />
      <meta
        name="twitter:title"
        content="Share your heartfelt wishes for #OurHeroAt70"
      />
      <meta
        name="twitter:description"
        content="As we approach our chairman’s 70th birthday, we invite you to share your love, cherished memories, and heartfelt wishes.
"
      />
      <meta name="twitter:image" content="metapic"></meta>

      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
