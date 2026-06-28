import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientWrapper from "@/components/layout/ClientWrapper";
import Providers from "@/components/layout/Providers";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Label Noor | Grace in Every Thread",
  description: "Label Noor: Handcrafted Aligarh kurtis with minimalist grace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal overflow-x-hidden">
          <Providers>
            <ClientWrapper />
            <Header />
            <main className="flex-grow pt-20">{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
