import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "출산 | 육아 휴직 계산기",
  description: "출산 휴가와 육아 휴직 일정을 자동으로 계산하고 관리하는 스마트 도구",
  generator: "ggumi",
  keywords: ["출산 휴가", "육아 휴직", "육아 휴직 급여", "출산 휴가 계산", "육아 휴직 계산기"],
  authors: [{ name: "ggumi" }],
  creator: "ggumi",
  publisher: "ggumi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "출산 | 육아 휴직 계산기",
    description: "휴가 일정 & 급여 계산",
    url: "https://hyyyyjin.github.io/maternity-leave-calculator/",
    siteName: "출산 | 육아 휴직 계산기",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "출산 | 육아 휴직 계산기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "출산 | 육아 휴직 계산기",
    description: "휴가 일정 & 급여 계산",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
