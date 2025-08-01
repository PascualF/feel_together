import type { Metadata } from "next";
import { Geist, Open_Sans} from "next/font/google";
import "./globals.css";
import AppWrapper from "./components/AppWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const opensans = Open_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feel Together",
  description: "Mood tracking, alone or together!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${opensans.variable} antialiased w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col`}
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
