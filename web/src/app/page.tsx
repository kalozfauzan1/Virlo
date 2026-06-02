"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { store } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (store.getSkipLanding()) {
      router.replace("/dashboard");
    } else {
      router.replace("/landing");
    }
  }, [router]);

  return null;
}
