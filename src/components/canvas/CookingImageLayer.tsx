"use client";

import Image from "next/image";

export default function CookingImageLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -20 }}>
      <Image
        src="/assets/healthy_cooking_bg.png"
        fill
        alt=""
        className="object-cover object-center opacity-[0.07]"
        priority
      />
      <div className="absolute inset-0 bg-[#080808]/80" />
    </div>
  );
}
