"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AeroFatigue Edu 页面异常", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="shell grid min-h-screen place-items-center py-20">
          <section className="panel max-w-xl p-10 text-center">
            <p className="eyebrow">页面保护已启动</p>
            <h1 className="mt-4 text-3xl font-black">页面暂时无法显示</h1>
            <p className="muted mt-4 text-lg">请返回课程首页重新进入。原始资料与本地记录不会因此被删除。</p>
            <button className="lab-button mt-7" onClick={() => { window.location.href = "/"; }}>返回课程首页</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
