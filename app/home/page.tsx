"use client";

import {
  Volume2,
  VolumeX,
  CalendarDays,
  Clock,
  MapPin,
  Heart,
  Gift,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import layout from "../home.module.css";
import s1 from "../section1.module.css";
import s2 from "../section2.module.css";
import s3 from "../section3.module.css";
import s4 from "../section4.module.css";
import s5 from "../section5.module.css";
import s6 from "../section6.module.css";
import s7 from "../section7.module.css";

import BottomBar from "../components/BottomBar";

/* ============================= */
/* DATA PERJALANAN (LOVE STORY) */
/* ============================= */

const journeyData = [
  {
    date: "3 Februari 2025",
    title: "Pertemuan Awal",
    desc: "Allah mempertemukan kami untuk pertama kalinya. Sebuah awal yang tidak pernah kami duga, namun menjadi pintu bagi kisah indah ini.",
  },
  {
    date: "14 Februari 2025",
    title: "Menjalin Kasih",
    desc: "Dengan niat yang tulus dan doa yang tak pernah putus, kami memutuskan untuk saling mengenal lebih dalam dan menjalin kasih.",
  },
  {
    date: "10 Juni 2026",
    title: "Lamaran",
    desc: "Dengan restu kedua keluarga, kami mengikat janji untuk melangkah ke jenjang yang lebih serius menuju ridho Allah SWT.",
  },
  {
    date: "23 September 2026",
    title: "Menuju Halal",
    desc: "Dengan menyebut nama Allah, kami menyempurnakan separuh agama kami. InsyaAllah, hingga Jannah-Nya.",
  },
];

/* ============================= */
/* DATA REKENING / GIFT */
/* ============================= */

const giftAccounts = [
  {
    id: "bri-bayani",
    bank: "Bank BRI",
    number: "221201042602506",
    name: "Bayani Gusti",
  },
  {
    id: "bri-faldi",
    bank: "Bank BRI",
    number: "221201006753535",
    name: "Faldi Kader",
  },
];

const giftAddress = {
  alamat:
    "Desa Bajo, Kepulauan Botang Lomang, Jalan Jembatan Batu RT 07 / RW 02",
  penerima: "Bayani Gusti / Faldi Kader",
};

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0,
  });

  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [kehadiran, setKehadiran] = useState("Hadir");
  const [ucapanList, setUcapanList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const selectedData = ucapanList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.max(
    1,
    Math.ceil(ucapanList.length / itemsPerPage)
  );

  const jumlahHadir = ucapanList.filter(
    (item) => item.kehadiran === "Hadir"
  ).length;

  const jumlahTidakHadir = ucapanList.filter(
    (item) => item.kehadiran === "Tidak Hadir"
  ).length;

  const jumlahKonfirmasi = ucapanList.length;

  /* ============================= */
  /* COPY TO CLIPBOARD */
  /* ============================= */

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  /* ============================= */
  /* MUSIC */
  /* ============================= */

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("playMusic", "false");
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem("playMusic", "true");
        })
        .catch(() => {});
    }
  };

  /* ============================= */
  /* COUNTDOWN */
  /* 23 SEPTEMBER 2026 - 08:00 WIT */
  /* ============================= */

  useEffect(() => {
    const target = new Date(2026, 8, 23, 8, 0, 0).getTime();

    const updateCountdown = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);

      setTimeLeft({
        hari: Math.floor(totalSeconds / (3600 * 24)),
        jam: Math.floor((totalSeconds % (3600 * 24)) / 3600),
        menit: Math.floor((totalSeconds % 3600) / 60),
        detik: totalSeconds % 60,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ============================= */
  /* FIREBASE REALTIME */
  /* ============================= */

  useEffect(() => {
    const q = query(
      collection(db, "ucapan"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setUcapanList(data);
    });

    return () => unsubscribe();
  }, []);

  /* ============================= */
  /* SUBMIT UCAPAN */
  /* ============================= */

  const handleSubmit = async () => {
    if (!nama.trim() || !pesan.trim()) {
      alert("Isi nama & ucapan dulu!");
      return;
    }

    try {
      await addDoc(collection(db, "ucapan"), {
        nama: nama.trim(),
        pesan: pesan.trim(),
        kehadiran,
        createdAt: serverTimestamp(),
      });

      setNama("");
      setPesan("");
      setKehadiran("Hadir");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Gagal kirim ucapan");
    }
  };

  /* ============================= */
  /* RESTORE MUSIC */
  /* ============================= */

  useEffect(() => {
    if (
      localStorage.getItem("playMusic") === "true" &&
      audioRef.current
    ) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, []);

  /* ============================= */
  /* SCROLL ANIMATION */
  /* ============================= */

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            layout.show,
            entry.isIntersecting
          );
        });
      },
      { threshold: 0.25, rootMargin: "-50px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/sound.mp3" loop />

      {/* ============================= */}
      {/* SECTION 1 - COVER (FULL BG)   */}
      {/* ============================= */}

      <section
        id="home"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
        className={layout.section}
      >
        <div className={s1.card}>
          {/* FOTO FULL SCREEN */}
          <div className={s1.bgWrapper}>
            <img
              src="/cover1.jpeg"
              className={s1.bgImage}
              alt="Mempelai"
            />
          </div>

          {/* OVERLAY GELAP */}
          <div className={s1.overlay} />

          {/* KONTEN DI ATAS FOTO */}
          <div className={s1.content}>
            <p
              className={`${s1.title} ${layout.animate} ${layout.delay1}`}
            >
              The Wedding Of
            </p>

            <h1
              className={`${s1.nama} ${layout.animate} ${layout.delay3}`}
            >
              Yani &amp; Fall
            </h1>

            <p
              className={`${s1.desc} ${layout.animate} ${layout.delay4}`}
            >
              We are getting married — and we want you to be there
            </p>

            <p
              className={`${s1.tanggal} ${layout.animate} ${layout.delay5}`}
            >
              <CalendarDays size={16} />
              Rabu, 23 September 2026
            </p>

            <a
              href="#event"
              className={`${s1.btn} ${layout.animate} ${layout.delay5}`}
            >
              Save The Date
            </a>
          </div>
        </div>
      </section>

           {/* ============================= */}
      {/* SECTION 2 - SAMBUTAN (FULL BG) */}
      {/* ============================= */}

      <section
        id="love"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
        className={layout.section}
      >
        <div className={s2.card2}>
          {/* LAYER 1 — BACKGROUND FOTO */}
          <div className={s2.bgWrapper}>
            <img
              src="/cover1.jpeg"
              className={s2.bgImage}
              alt="Background"
            />
          </div>

          {/* LAYER 2 — OVERLAY GELAP */}
          <div className={s2.overlay} />

          {/* LAYER 3 — BG-FLORAL PALING DEPAN */}
          <div className={s2.floralLayer} />

          {/* LAYER 4 — KONTEN TEKS */}
          <div className={s2.content}>
            <h2
              className={`${s2.greeting} ${layout.animate} ${layout.delay1}`}
            >
              Assalamualaikum Wr. Wb.
            </h2>

            <p
              className={`${s2.text} ${layout.animate} ${layout.delay2}`}
            >
              Dengan memohon rahmat dan ridho Allah SWT,
              <br />
              kami bermaksud menyelenggarakan
              acara pernikahan putra-putri kami.
              Merupakan suatu kehormatan dan kebahagiaan
              bagi kami apabila Bapak/Ibu/Saudara/i
              berkenan hadir untuk memberikan doa restu.
            </p>

            {/* FOTO 2.JPEG DIPERBESAR */}
            <div
              className={`${s2.avatarWrapper2} ${layout.animate} ${layout.delay4} ${layout.zoom} ${layout.float}`}
            >
              <img
                src="/2.jpeg"
                className={s2.avatar2}
                alt="Foto pasangan"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ============================= */}
      {/* SECTION 3 - EVENT */}
      {/* ============================= */}

      <section
        id="event"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
        className={layout.section}
      >
        <div className={s3.card3}>
          <h2
            className={`${s3.script} ${layout.animate} ${layout.delay1}`}
          >
            Save The Date
          </h2>

          <div
            className={`${s3.countdown} ${layout.animate} ${layout.delay2}`}
          >
            <div>
              {timeLeft.hari}
              <br />
              Hari
            </div>
            <div>
              {timeLeft.jam}
              <br />
              Jam
            </div>
            <div>
              {timeLeft.menit}
              <br />
              Menit
            </div>
            <div>
              {timeLeft.detik}
              <br />
              Detik
            </div>
          </div>

          <img
            src="/4.jpeg"
            className={`${s3.fullImg} ${layout.animate} ${layout.delay3} ${layout.zoom}`}
            alt="Foto pasangan"
          />

          <h2
            className={`${s3.eventTitle} ${layout.animate} ${layout.delay4}`}
          >
            Acara Pernikahan
          </h2>

          <div
            className={`${s3.tanggal} ${layout.animate} ${layout.delay5}`}
          >
            <div className={s3.detailRow}>
              <CalendarDays size={16} />
              <span className={s3.detailText}>
                Rabu, 23 September 2026
              </span>
            </div>

            <div className={s3.detailRow}>
              <Clock size={16} />
              <span className={s3.detailText}>
                Ijab Kabul 08:00 WIT
              </span>
            </div>

            <div className={s3.detailRow}>
              <Clock size={16} />
              <span className={s3.detailText}>
                Khatam Qur'an 09:00 WIT — Selesai
              </span>
            </div>

            <div className={s3.detailRow}>
              <Clock size={16} />
              <span className={s3.detailText}>
                Saro-saro 15:00 WIT — Selesai
              </span>
            </div>

            <div className={s3.detailRow}>
              <MapPin size={16} />
              <span className={s3.detailText}>
                Desa Bajo Kep. Botang Lomang, Jl. Jembatan Batu RT 07/RW 02
              </span>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/oPvV8gEyFfHW1YGY9?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className={`${s3.btn} ${layout.animate} ${layout.delay5}`}
          >
            <MapPin size={16} />
            Lihat Lokasi
          </a>
        </div>
      </section>

      {/* ============================= */}
      {/* SECTION 4 - GALLERY */}
      {/* ============================= */}

      <section
        id="gallery"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
        className={layout.section}
      >
        <div className={s4.card4}>
          <h2
            className={`${s4.script} ${layout.animate} ${layout.delay1}`}
          >
            Our Moments Studio
          </h2>

          <div
            className={`${s4.grid} ${layout.animate} ${layout.delay2}`}
          >
            <img src="/1.jpeg" alt="Foto 1" />
            <img src="/2.jpeg" alt="Foto 2" />
            <img src="/3.jpeg" alt="Foto 3" />
            <img src="/4.jpeg" alt="Foto 4" />
            <img src="/5.jpeg" alt="Foto 5" />
            <img src="/6.jpeg" alt="Foto 6" />
          </div>
        </div>
      </section>
{/* ============================= */}
{/* SECTION 6 - OUR JOURNEY */}
{/* ============================= */}

<section
  id="journey"
  className={layout.section}
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  }}
>
  <div className={s6.card6}>
    {/* HEADER */}
    <div
      className={`${s6.headerRow} ${layout.animate} ${layout.delay1}`}
    >
      <Sparkles size={20} color="#d4af37" />

      <h2 className={s6.script}>
        Our Journey
      </h2>

      <Sparkles size={20} color="#d4af37" />
    </div>

    {/* DESKRIPSI */}
    <p
      className={`${s6.desc} ${layout.animate} ${layout.delay2}`}
    >
      Setiap langkah adalah cerita, dan ini milik kami berdua.
    </p>

    {/* TIMELINE */}
    <div
      className={`${s6.timeline} ${layout.animate} ${layout.delay3}`}
    >
      <div className={s6.line} />

      {journeyData.map((item, i) => (
        <div
          key={i}
          className={s6.item}
        >
          <div className={s6.dot} />

          <div className={s6.date}>
            {item.date}
          </div>

          <div className={s6.title}>
            {item.title}
          </div>

          <div className={s6.text}>
            {item.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


{/* ============================= */}
{/* SECTION 7 - WEDDING GIFT */}
{/* ============================= */}

<section
  id="gift"
  className={layout.section}
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  }}
>
  <div className={s7.card7}>
    {/* HEADER */}
    <div
      className={`${s7.headerRow} ${layout.animate} ${layout.delay1}`}
    >
      <Gift size={22} color="#d4af37" />

      <h2 className={s7.script}>
        Wedding Gift
      </h2>
    </div>

    {/* DESKRIPSI */}
    <p
      className={`${s7.desc} ${layout.animate} ${layout.delay2}`}
    >
      Doa restu Anda adalah hadiah terindah bagi kami.
      <br />
      Namun jika ingin memberi tanda kasih, kami sediakan kanal berikut.
    </p>

    {/* ============================= */}
    {/* REKENING */}
    {/* ============================= */}

    <div
      className={`${s7.accountList} ${layout.animate} ${layout.delay3}`}
    >
      {giftAccounts.map((acc) => (
        <div
          key={acc.id}
          className={s7.accountCard}
        >
          <div className={s7.bankName}>
            {acc.bank}
          </div>

          <div className={s7.accountNumber}>
            {acc.number}
          </div>

          <div className={s7.accountName}>
             {acc.name}
          </div>

          <button
            onClick={() =>
              copyToClipboard(acc.number, acc.id)
            }
            className={`${s7.copyBtn} ${
              copiedId === acc.id
                ? s7.copied
                : ""
            }`}
          >
            {copiedId === acc.id ? (
              <>
                <Check size={14} />
                Tersalin
              </>
            ) : (
              <>
                <Copy size={14} />
                Salin Nomor
              </>
            )}
          </button>
        </div>
      ))}
    </div>

    {/* ============================= */}
    {/* ALAMAT KADO */}
    {/* ============================= */}

    <div
      className={`${s7.addressCard} ${layout.animate} ${layout.delay4}`}
    >
      <div className={s7.addressHeader}>
        <MapPin size={16} />
        Kirim Hadiah / Kado
      </div>

      <div className={s7.addressText}>
        {giftAddress.alamat}
      </div>

      <div className={s7.addressReceiver}>
        Penerima: {giftAddress.penerima}
      </div>

      <button
        onClick={() =>
          copyToClipboard(
            giftAddress.alamat,
            "alamat"
          )
        }
        className={`${s7.addressBtn} ${
          copiedId === "alamat"
            ? s7.copied
            : ""
        }`}
      >
        {copiedId === "alamat" ? (
          <>
            <Check size={14} />
            Tersalin
          </>
        ) : (
          <>
            <Copy size={14} />
            Salin Alamat
          </>
        )}
      </button>
    </div>

    {/* FOOTER */}
    <p
      className={`${s7.footer} ${layout.animate} ${layout.delay5}`}
    >
      Terima kasih atas kasih dan doa yang tulus 🤍
    </p>
  </div>
</section>

      {/* ============================= */}
      {/* SECTION 5 - RSVP */}
      {/* ============================= */}

      <section
        id="chat"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
        className={layout.section}
      >
        <div className={s5.card5}>
          <h2
            className={`${s5.script} ${layout.animate} ${layout.delay1}`}
          >
            Ucapan &amp; Konfirmasi
          </h2>

          <p
            className={`${s5.desc} ${layout.animate} ${layout.delay2}`}
          >
            Kirim doa &amp; konfirmasi kehadiran Anda
          </p>

          {/* STATISTIK */}
          <div
            className={`${s5.statistics} ${layout.animate} ${layout.delay2}`}
          >
            <div className={s5.statCard}>
              <div className={s5.statNumberGold}>
                {jumlahHadir}
              </div>
              <div className={s5.statLabel}>Hadir</div>
            </div>

            <div className={s5.statCard}>
              <div className={s5.statNumberMaroon}>
                {jumlahTidakHadir}
              </div>
              <div className={s5.statLabel}>Tidak Hadir</div>
            </div>

            <div className={s5.statCard}>
              <div className={s5.statNumberDeep}>
                {jumlahKonfirmasi}
              </div>
              <div className={s5.statLabel}>Total</div>
            </div>
          </div>

          {/* FORM */}
          <div
            className={`${s5.form} ${layout.animate} ${layout.delay3}`}
          >
            <input
              placeholder="Nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />

            <textarea
              placeholder="Tulis ucapan & doa untuk mempelai..."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
            />

            <div className={s5.selectWrapper}>
              <select
                value={kehadiran}
                onChange={(e) => setKehadiran(e.target.value)}
              >
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
              </select>
            </div>

            <button onClick={handleSubmit} className={s5.btn}>
              <Heart size={16} /> Kirim Ucapan
            </button>
          </div>

          {/* LIST UCAPAN */}
          <div className={s5.listWrapper}>
            <div className={s5.list}>
              {selectedData.map((item) => (
                <div key={item.id} className={s5.item}>
                  <div className={s5.header}>
                    <strong>{item.nama}</strong>
                    <span className={s5.status}>
                      {item.kehadiran === "Hadir" ? "✔" : "✖"}
                    </span>
                  </div>
                  <p className={s5.message}>{item.pesan}</p>
                  <small className={s5.time}>{item.kehadiran}</small>
                </div>
              ))}
            </div>
          </div>

          {/* PAGINATION */}
          <div className={s5.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <BottomBar />

      <button
        onClick={toggleMusic}
        className={`${layout.musicBtn} ${
          isPlaying ? layout.playing : ""
        }`}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </>
  );
}