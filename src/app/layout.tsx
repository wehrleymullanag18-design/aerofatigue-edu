import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "AeroFatigue Edu｜预应力—温度循环疲劳虚拟实验",
  description: "面向设备认知、操作训练、安全考核和答辩展示的本地虚拟实验教学平台。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorBoundary>
          <AppHeader />
          <main>{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
