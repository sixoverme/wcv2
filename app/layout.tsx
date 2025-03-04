import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Woven Circles | Community Mutual Aid",
  description: "A digital space for grassroots mutual aid and community resources",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-earth-50`}>
        <AuthProvider>
          <main className="container mx-auto px-4 pb-20 pt-4 max-w-4xl">{children}</main>
          <Navigation />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'