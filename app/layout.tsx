import type { Metadata } from "next";
import type { Viewport } from "next";
import { Pixelify_Sans } from "next/font/google";
import { SessionProviderComp } from "./components/SessionProvider";
import "./globals.css";

const tomorrow = Pixelify_Sans({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
    title: "Loïc Sutter - Photographer",
    description:
        "Explore genuine moments captured by Loïc Sutter, enhanced with a touch of AI. From vivid photographs to AI-generated narratives and sounds.",
};
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <SessionProviderComp>
                <body className={tomorrow.className}>{children}</body>
            </SessionProviderComp>
        </html>
    );
}
