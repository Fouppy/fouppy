import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";

// ============================================================================

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

// ============================================================================

export default appWithTranslation(App);
