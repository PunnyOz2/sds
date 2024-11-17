import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Dino.module.css"; // Import CSS module

function Dino() {
  const router = useRouter();
  const dinoRef = useRef<HTMLDivElement | null>(null);
  const cactusRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const pollStatus = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hello`);
        if (response.status === 200) {
          router.push("/streaming");
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollStatus);
  }, [router]);

  const jump = () => {
    if (dinoRef.current && !dinoRef.current.classList.contains(styles.jump)) {
      dinoRef.current.classList.add(styles.jump);
      setTimeout(() => {
        dinoRef.current?.classList.remove(styles.jump);
      }, 300);
    }
  };

  useEffect(() => {
    const isAlive = setInterval(() => {
      if (!dinoRef.current || !cactusRef.current) return;

      const dinoTop = parseInt(
        getComputedStyle(dinoRef.current).getPropertyValue("top")
      );
      const cactusLeft = parseInt(
        getComputedStyle(cactusRef.current).getPropertyValue("left")
      );

      if (cactusLeft < 40 && cactusLeft > 0 && dinoTop >= 140) {
        alert("Game Over! Your Score: " + score);
        setScore(0);
      } else {
        setScore((prev) => prev + 1);
      }
    }, 10);

    return () => clearInterval(isAlive);
  }, [score]);

  useEffect(() => {
    document.addEventListener("keydown", jump);
    return () => document.removeEventListener("keydown", jump);
  }, []);

  return (
    <div className={styles.game}>
      Score: {score}
      <div ref={dinoRef} className={styles.dino}></div>
      <div ref={cactusRef} className={styles.cactus}></div>
    </div>
  );
}

export default Dino;
