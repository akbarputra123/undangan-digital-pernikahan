
"use client";

import { useEffect, useState } from "react";
import styles from "../bottomBar.module.css";

import {
  Home,
  Heart,
  CalendarDays,
  Image,
  MessageCircle,
  Gift,
  Sparkles,
} from "lucide-react";

type Section =
  | "home"
  | "love"
  | "event"
  | "gallery"
  | "journey"
  | "gift"
  | "chat";

export default function BottomBar() {
  const [active, setActive] = useState<Section>("home");

  /* =========================================================
     DEFAULT THEME
     ========================================================= */

  useEffect(() => {
    // Dark mode menjadi default
    document.documentElement.classList.add("dark");

    // Simpan agar tetap dark ketika halaman dibuka kembali
    localStorage.setItem("theme", "dark");
  }, []);

  /* =========================================================
     SCROLL KE SECTION
     ========================================================= */

  const scrollTo = (id: Section) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =========================================================
     ACTIVE SECTION
     ========================================================= */

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as Section);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className={styles.bottomBar}>
      <div className={styles.menu}>

        {/* HOME */}
        <button
          onClick={() => scrollTo("home")}
          className={`${styles.icon} ${
            active === "home" ? styles.active : ""
          }`}
          aria-label="Home"
        >
          <Home size={20} />
        </button>

        {/* LOVE */}
        <button
          onClick={() => scrollTo("love")}
          className={`${styles.icon} ${
            active === "love" ? styles.active : ""
          }`}
          aria-label="Love Story"
        >
          <Heart size={20} />
        </button>

        {/* EVENT */}
        <button
          onClick={() => scrollTo("event")}
          className={`${styles.icon} ${
            active === "event" ? styles.active : ""
          }`}
          aria-label="Event"
        >
          <CalendarDays size={20} />
        </button>

        {/* GALLERY */}
        <button
          onClick={() => scrollTo("gallery")}
          className={`${styles.icon} ${
            active === "gallery" ? styles.active : ""
          }`}
          aria-label="Gallery"
        >
          <Image size={20} />
        </button>

        {/* JOURNEY */}
        <button
          onClick={() => scrollTo("journey")}
          className={`${styles.icon} ${
            active === "journey" ? styles.active : ""
          }`}
          aria-label="Our Journey"
        >
          <Sparkles size={20} />
        </button>

        {/* GIFT */}
        <button
          onClick={() => scrollTo("gift")}
          className={`${styles.icon} ${
            active === "gift" ? styles.active : ""
          }`}
          aria-label="Wedding Gift"
        >
          <Gift size={20} />
        </button>

        {/* CHAT */}
        <button
          onClick={() => scrollTo("chat")}
          className={`${styles.icon} ${
            active === "chat" ? styles.active : ""
          }`}
          aria-label="Chat"
        >
          <MessageCircle size={20} />
        </button>

      </div>
    </div>
  );
}
