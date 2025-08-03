import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

// export const metadata: Metadata = {
//   title: "KOIDANG",
//   description: "KOIDANG",
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 1,
//     userScalable: false,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
