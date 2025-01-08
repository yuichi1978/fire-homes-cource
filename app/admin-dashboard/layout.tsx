import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="max-w-screen-lg mx-auto px-4 py-10">{children}</div>;
}
