import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "@/styles/Home.module.css";

// ============================================================================

const inter = Inter({ subsets: ["latin"] });

// ============================================================================

type Props = {};

// ============================================================================

const Home = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  const linkOptions = {
    rel: "noopener noreferrer",
    target: "_blank",
  };

  return (
    <>
      <Head>
        <title>Fouppy</title>
        <meta content={t("description")} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>

          <div>
            <a href="https://vercel.com/" {...linkOptions}>
              By{" "}
              <Image
                alt="Vercel Logo"
                className={styles.vercelLogo}
                height={24}
                priority
                src="/vercel.svg"
                width={100}
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            alt="Next.js Logo"
            className={styles.logo}
            height={37}
            priority
            src="/next.svg"
            width={180}
          />

          <div className={styles.thirteen}>
            <Image
              alt="13"
              height={31}
              priority
              src="/thirteen.svg"
              width={40}
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            className={styles.card}
            href="https://nextjs.org/docs/"
            {...linkOptions}
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>

            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>
        </div>
      </main>
    </>
  );
};

// ============================================================================

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
  revalidate: 60,
});

// ============================================================================

export default Home;
