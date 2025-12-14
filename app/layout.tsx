import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "CSV Plot Studio - Interactive Data Visualization",
  description:
    "Upload CSV files and create interactive, publication-ready charts directly in your browser. Powered by Plotly.js and Next.js.",
  keywords: "CSV, visualization, charts, plotting, data analysis, Plotly",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
