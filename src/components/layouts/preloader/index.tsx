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
    const ctx = gsap.context(() => {
      const innerWords = gsap.utils.toArray<HTMLElement>("[data-word-inner]");

      const tl = gsap.timeline();

      tl.set(innerWords, { yPercent: 120, opacity: 1 });

      tl.to(innerWords, {
        yPercent: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.15, 
      });

      tl.to({}, { duration: 0.6 });

      tl.to(screenRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        onComplete: onFinish,
      });
    }, textWrapRef);

    return () => ctx.revert();
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
            <span
              data-word-inner
              className="inline-block will-change-transform"
            >
              {word}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
