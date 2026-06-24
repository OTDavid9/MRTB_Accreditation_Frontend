"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // ONLY render the header if the path is exactly "/"
  if (pathname !== "/") return null;

  return <Header />;
}