import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astro Horary",
  description: "Ask the stars",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}