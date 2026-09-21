import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "P10 Landing Reveal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}