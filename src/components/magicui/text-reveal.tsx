"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function TextReveal({ children, className = "" }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  let text = "";

  if (typeof children === "string") {
    text = children;
  } else if (typeof children === "object" && "props" in children) {
    text = children.props.children;
  }

  if (typeof text !== "string") {
    console.warn("TextReveal fallback: children must contain text.");
    return (
      <div ref={targetRef} className={`relative z-0 h-[200vh] ${className}`}>
        <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center py-20 text-white">
          {children}
        </div>
      </div>
    );
  }

  const words = text.split(" ");

  return (
    <div ref={targetRef} className={`relative z-0 h-[200vh] ${className}`}>
      <div className="sticky top-0 mx-auto flex h-[100%] max-w-4xl items-center py-20 bg-transparent">
        <span className="flex flex-wrap text-2xl font-bold text-white/20 md:text-3xl lg:text-4xl xl:text-5xl">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1">
      <span className="absolute opacity-30">{children}</span>
      <motion.span style={{ opacity }} className="text-white">
        {children}
      </motion.span>
    </span>
  );
}
