'use client';

import React from "react";

export const GridBackground = () => {
  return (
    <div className="fixed inset-0 -z-50">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>
  );
};