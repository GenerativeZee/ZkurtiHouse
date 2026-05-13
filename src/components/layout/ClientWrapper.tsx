"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const AIAssistant = dynamic(() => import("@/components/ui/AIAssistant"), { ssr: false });

export default function ClientWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="grain-overlay" />
  );

  return (
    <>
      <CustomCursor />
      <AIAssistant />
      <div className="grain-overlay" />
    </>
  );
}
