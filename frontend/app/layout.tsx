import type { Metadata, Viewport } from "next"
import { Orbitron, Inter } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { AriaCoach } from "@/components/aria-coach"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ARISE Eats | AI-Powered Food Delivery",
  description: "Order delicious food with AI-powered recommendations. Get personalized suggestions based on your mood, time, and cravings.",
  keywords: ["food delivery", "AI recommendations", "restaurant delivery", "ARISE Eats"],
  authors: [{ name: "ARISE Eats Team" }],
  openGraph: {
    title: "ARISE Eats | AI-Powered Food Delivery",
    description: "The smartest way to satisfy your cravings. AI-powered food recommendations delivered to your door.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0f0a1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-background ${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/30">
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
          <AriaCoach />
        </CartProvider>
      </body>
    </html>
  )
}
