import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-gray-100 text-gray-900">
        <header className="p-4 bg-blue-600 text-white text-center">
          <h1 className="text-xl font-bold">PopLab - Angebotsmanagement</h1>
        </header>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
