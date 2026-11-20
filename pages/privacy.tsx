import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "@/styles/Privacy.module.css";

// ============================================================================

type Props = {};

const CONTACT = "kuragcp.perpetual074@passmail.com";

// ============================================================================

const Privacy = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>Privacy Policy – kura rclone</title>
        <meta
          content="Privacy policy of kura rclone, a private backup tool."
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <article className={styles.article}>
          <h1>Privacy Policy – kura rclone</h1>
          <p className={styles.updated}>Last updated: November 20, 2026</p>

          <p>
            <strong>kura rclone</strong> is a private tool used only by its
            owner, Fouppy, to back up personal documents from a self-hosted
            server to the owner&apos;s own Google Drive.
          </p>

          <h2>Data accessed</h2>
          <p>
            The application uses a single Google permission,{" "}
            <code>drive.file</code>: it can only see and manage the files and
            folders it creates itself in the owner&apos;s Google Drive. It
            cannot read any other file in the Drive.
          </p>

          <h2>How data is used</h2>
          <p>
            Files are encrypted on the owner&apos;s server before being
            uploaded, and are only used to keep an off-site backup. Google user
            data is not used for any other purpose, including advertising or
            analytics.
          </p>

          <h2>Sharing</h2>
          <p>
            No data is shared with, sold to, or transferred to any third party.
          </p>

          <h2>Storage and deletion</h2>
          <p>
            Backups are stored in the owner&apos;s Google Drive. Access can be
            revoked at any time from the Google Account settings (Security →
            Third-party connections), and the backup folder can be deleted from
            Google Drive.
          </p>

          <h2>Contact</h2>
          <p>
            For any question about this policy:{" "}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>
        </article>
      </main>
    </>
  );
};

// ============================================================================

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

// ============================================================================

export default Privacy;
