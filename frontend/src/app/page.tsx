"use client";

import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  useEffect(() => {
    // Redirect to the dashboard after component mounts
    window.location.href = "/dashboard";
  }, []);

  return (
    <>
      <Head>
        <meta http-equiv="refresh" content="0; url=/dashboard" />
      </Head>
    </>
  );
}
