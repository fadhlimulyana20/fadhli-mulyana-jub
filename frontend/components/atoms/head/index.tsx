import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface props {
    title: string;
    description: string;
    ogTitle?: string;
    ogType?: string;
    ogUrl?: string;
    ogImage?: string;
    keywords?: string;
    twitterUsername?: string;
    canonical?: string;
}

export default function Header({
    title,
    description,
    ogTitle = "",
    ogType = "page",
    ogUrl = "",
    ogImage = "",
    keywords = "",
    twitterUsername = "",
    canonical="",
}: props) {
    const router = useRouter()

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description}></meta>
            <meta name="og:description" content={description}></meta>
            <meta name="twitter:description" content={description}></meta>
            <meta name="twitter:card" content={ogTitle === "" ? title : ogTitle} />
            <meta name="twitter:site" content={twitterUsername} />
            <meta name="twitter:title" content={ogTitle === "" ? title : ogTitle} />
            <meta name="twitter:description" content={description} />
            {/* <meta name="twitter:image" content={ogImage} /> */}
            <meta property="og:title" content={ogTitle === "" ? title : ogTitle} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={ogUrl === "" ? "https://kuadran.co" + router.asPath : ogUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Kuadran" />
            <meta name="keywords" content={keywords}></meta>
            <link rel="canonical" href={canonical} />
        </Head>
    )
}
