import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "@/styles/Home.module.css";

// ============================================================================

type Props = {};

// ============================================================================

const Home = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        {/* @ts-ignore */}
        <meta content={t("description")} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div className={styles.center}>
          <h1>{t("maintenance")}</h1>
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
