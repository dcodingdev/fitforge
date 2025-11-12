import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-background px-4 ${inter.className}`}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
