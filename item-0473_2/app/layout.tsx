import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
//theme
//import "primereact/resources/themes/lara-light-indigo/theme.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

//core
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "VidyaSwati App",
  description: "Compitive Exam Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} m-0`}>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
