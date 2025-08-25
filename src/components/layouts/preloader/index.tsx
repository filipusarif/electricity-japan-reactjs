import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onFinish: () => void;
}

export default function Preloader({ onFinish }: PreloaderProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLHeadingElement>(null);

  const text = "Predicting Future Energy Consumption";

  useEffect(() => {
    const innerWords = gsap.utils.toArray<HTMLElement>("[data-word-inner]");

    const tl = gsap.timeline({
      onComplete: onFinish, // selesai semua baru panggil
    });

    // posisi awal
    tl.set(innerWords, { yPercent: 120, opacity: 1 });

    // animasi masuk per kata
    tl.to(innerWords, {
      yPercent: 0,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.15,
    });

    // jeda biar user sempat baca
    tl.to({}, { duration: 1 });

    // fade out teks biar halus
    tl.to(innerWords, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // transisi keluar layar
    tl.to(screenRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut",
    });
  }, [onFinish]);

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
    >
      <h1
        ref={textWrapRef}
        className="text-white text-2xl md:text-4xl font-bold tracking-widest flex flex-wrap gap-2 px-4 text-center"
      >
        {text.split(" ").map((word, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <span data-word-inner className="inline-block will-change-transform">
              {word}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
