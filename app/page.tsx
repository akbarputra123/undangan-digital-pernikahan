"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./cover.module.css";
import { Mail } from "lucide-react";

/* ============================= */
/* 🔥 INNER CONTENT (PAKAI SEARCH PARAMS) */
/* ============================= */
function CoverContent() {
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [namaTamu, setNamaTamu] = useState("Tamu Undangan");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const to = searchParams.get("to");
    if (to) {
      const nama = decodeURIComponent(to)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setNamaTamu(nama);
    }
  }, [mounted, searchParams]);

  const handleClick = () => {
    localStorage.setItem("playMusic", "true");
  };

  useEffect(() => {
    const setScale = () => {
      if (window.innerWidth >= 768) {
        const scaleW = window.innerWidth / 390;
        const scaleH = window.innerHeight / 844;
        const scale = Math.min(scaleW, scaleH, 1) * 0.92;
        document.documentElement.style.setProperty(
          "--frame-scale",
          String(scale)
        );
      } else {
        document.documentElement.style.setProperty("--frame-scale", "1");
      }
    };

    setScale();
    window.addEventListener("resize", setScale);
    return () => window.removeEventListener("resize", setScale);
  }, []);

  return (
    <div className={styles["app-wrapper"]}>
      <main
        className={`${styles["cover-page"]} ${
          mounted ? styles["page-enter"] : ""
        }`}
        style={{ backgroundImage: "url('/bg-floral.png')" }}
      >
        {/* Background foto pasangan */}
        <div className={styles["second-bg"]} style={{ pointerEvents: "none" }}>
          <Image
            src="/cover.jpeg"
            alt="Foto Pasangan Pengantin"
            fill
            priority
            sizes="100vw"
            className={styles["bg-photo"]}
            style={{ objectPosition: "center top" }}
          />
        </div>

        {/* Overlay maroon */}
        <div
          className={styles["cover-overlay"]}
          style={{ pointerEvents: "none" }}
        />

        {/* Ornamen sudut */}
        <div className={`${styles.corner} ${styles["corner-tl"]}`}>✦</div>
        <div className={`${styles.corner} ${styles["corner-tr"]}`}>✦</div>
        <div className={`${styles.corner} ${styles["corner-bl"]}`}>💍</div>
        <div className={`${styles.corner} ${styles["corner-br"]}`}>💍</div>

        {/* Partikel */}
        <div className={styles.particles} style={{ pointerEvents: "none" }}>
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className={`${styles.particle} ${styles[`p-${i + 1}`]}`}
            >
              {["✦", "✧", "❀", "❁", "✶", "✷"][i % 6]}
            </span>
          ))}
        </div>

        {/* KONTEN UTAMA */}
        <div className={styles["cover-content"]}>
          {/* Label "The Wedding Of" */}
          <p className={`${styles["graduate-label"]} ${mounted ? styles["fade-1"] : ""}`}>
            The Wedding Of
          </p>

          {/* NAMA PASANGAN */}
          <h1 className={`${styles.nama} ${mounted ? styles["anim-slide-up"] : ""}`}>
            Bayani Gusti A, Md, Kep
            <br />
            &amp;
            <br />
            Faldi Kader
          </h1>

          {/* TANGGAL PERNIKAHAN */}
          <p className={`${styles["class-of"]} ${mounted ? styles["fade-6"] : ""}`}>
            Rabu, 23 September 2026
          </p>

          {/* DIVIDER GARIS EMAS */}
          <div className={`${styles["divider-line"]} ${mounted ? styles["anim-fade"] : ""}`} />

          {/* "kepada Yth." */}
          <p className={`${styles.kepada} ${mounted ? styles["anim-fade"] : ""}`}>
            kepada Yth.
          </p>

          {/* NAMA TAMU (dinamis dari URL) */}
          <h3 className={`${styles["nama-tamu"]} ${mounted ? styles["anim-fade"] : ""}`}>
            {namaTamu}
          </h3>

          {/* TOMBOL BUKA UNDANGAN */}
          <Link
            href="/home"
            onClick={handleClick}
            className={`${styles["btn-undangan"]} ${mounted ? styles["anim-bounce"] : ""}`}
          >
            <Mail size={16} />
            <span>Buka Undangan</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

/* ============================= */
/* 🔥 WRAPPER (WAJIB UNTUK NEXT) */
/* ============================= */
export default function CoverPage() {
  return (
    <Suspense fallback={<div />}>
      <CoverContent />
    </Suspense>
  );
}