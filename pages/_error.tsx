/**
 * NOTE: This requires `@sentry/nextjs` version 7.3.0 or higher.
 *
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://reactjs.org/docs/error-boundaries.html
 */

import * as Sentry from "@sentry/nextjs";
import type { NextPageContext } from "next";
import NextErrorComponent from "next/error";

// ============================================================================

type Props = {
  err?: NextPageContext["err"] | string;
  pathname?: string;
  req?: NextPageContext["req"];
  res?: NextPageContext["res"];
  statusCode?: number;
};

// ============================================================================

const Error = ({ statusCode }: Props) => {
  if (statusCode) {
    return <NextErrorComponent statusCode={statusCode} />;
  }

  return <p>An error occurred on client</p>;
};

// ============================================================================

Error.getInitialProps = async (contextData: Props) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData as NextPageContext);
};

// ============================================================================

export default Error;
