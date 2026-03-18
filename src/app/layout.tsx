import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BindPredict - Protein Binding Prediction",
  description: "Three.js molecular viewer, free energy calculator, docking viewer, virtual screening",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
