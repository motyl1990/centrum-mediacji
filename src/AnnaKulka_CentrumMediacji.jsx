import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "O mnie", href: "#o-mnie" },
  { label: "Usługi", href: "#uslugi" },
  { label: "Cennik", href: "#cennik" },
  { label: "Kontakt", href: "#kontakt" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      const start = window.scrollY;
      const distance = top - start;
      const duration = 900;
      let startTime = null;
      const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + distance * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    setMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a2a4a", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: auto; }
        ::selection { background: #c8d8f0; color: #0d1e3d; }
        a { text-decoration: none; color: inherit; }

        .nav-link {
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a2a4a;
          font-weight: 500;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #2a5caa;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #2a5caa; }

        .btn-primary {
          display: inline-block;
          padding: 14px 36px;
          background: #1a2a4a;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }
        .btn-primary:hover { background: #2a5caa; transform: translateY(-1px); }

        .btn-outline {
          display: inline-block;
          padding: 13px 36px;
          border: 1.5px solid #1a2a4a;
          color: #1a2a4a;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          background: transparent;
          transition: background 0.3s, color 0.3s;
        }
        .btn-outline:hover { background: #1a2a4a; color: #fff; }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2a5caa;
          margin-bottom: 16px;
          display: block;
        }
        .section-title {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          line-height: 1.2;
          color: #0d1e3d;
        }

        .service-card {
          border: 1px solid #e0e8f5;
          padding: 36px 32px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          background: #fff;
          cursor: default;
        }
        .service-card:hover {
          border-color: #2a5caa;
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(42,92,170,0.1);
        }

        .price-card {
          border: 1px solid #e0e8f5;
          padding: 40px 36px;
          transition: border-color 0.3s, box-shadow 0.3s;
          background: #fff;
          position: relative;
        }
        .price-card.featured {
          background: #0d1e3d;
          color: #fff;
          border-color: #0d1e3d;
        }
        .price-card:not(.featured):hover {
          border-color: #2a5caa;
          box-shadow: 0 16px 48px rgba(42,92,170,0.1);
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #c8d5e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #1a2a4a;
          background: #f8fafd;
          outline: none;
          transition: border-color 0.3s;
        }
        .input-field:focus { border-color: #2a5caa; background: #fff; }

        .divider-line {
          width: 48px;
          height: 2px;
          background: #2a5caa;
          margin-bottom: 24px;
        }

        /* ── RESPONSIVE GRIDS ── */
        .grid-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .grid-contact {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }
        .grid-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .hero-image {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .grid-two-col {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .grid-contact {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .grid-form-row {
            grid-template-columns: 1fr;
          }
          .hero-image {
            display: none;
          }
          .desktop-nav { display: none !important; }
          .mobile-menu { display: flex; flex-direction: column; gap: 24px; padding: 32px; }
          .footer-links { display: none; }
          .hero-section {
            padding-top: 120px !important;
            padding-bottom: 60px !important;
            min-height: auto !important;
          }
          .section-padding {
            padding-top: 64px !important;
            padding-bottom: 64px !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .mobile-menu-overlay { display: none !important; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 clamp(24px, 5vw, 80px)",
        height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e8eef8" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "1.2rem", fontWeight: 600, letterSpacing: "0.04em", color: "#0d1e3d" }}>
          Centrum Mediacji
        </div>
        <div className="desktop-nav" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAV_LINKS.map(l => <a key={l.href} href={l.href} onClick={e => scrollToSection(e, l.href)} className="nav-link">{l.label}</a>)}
          <a href="#kontakt" onClick={e => scrollToSection(e, "#kontakt")} className="btn-primary" style={{ padding: "10px 28px" }}>Umów spotkanie</a>
        </div>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <div style={{ width: 24, height: 2, background: "#1a2a4a", marginBottom: 6, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
          <div style={{ width: 24, height: 2, background: "#1a2a4a", marginBottom: 6, opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: "#1a2a4a", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className="mobile-menu-overlay" style={{
        position: "fixed", inset: 0, zIndex: 99,
        background: "#fff",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s ease",
        paddingTop: 72,
      }}>
        <div className="mobile-menu">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={e => scrollToSection(e, l.href)}
              style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "2rem", color: "#0d1e3d", fontWeight: 600 }}>
              {l.label}
            </a>
          ))}
          <a href="#kontakt" className="btn-primary" style={{ textAlign: "center" }} onClick={e => scrollToSection(e, "#kontakt")}>Umów spotkanie</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero-section" style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #f0f5ff 0%, #ffffff 50%, #e8f0fb 100%)",
        display: "flex", alignItems: "center",
        padding: "100px clamp(24px, 5vw, 80px) 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, borderRadius: "50%", border: "1px solid #c8d8f0", opacity: 0.5 }} />
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", border: "1px solid #aac4e8", opacity: 0.4 }} />
        <div style={{ position: "absolute", bottom: 80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(42,92,170,0.04)" }} />

        <div className="grid-two-col" style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div style={{ animation: "fadeUp 1s ease 0.1s both" }}>
            <span className="section-label">Mediator Sądowy</span>
            <h1 style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 600,
              lineHeight: 1.08,
              color: "#0d1e3d",
              marginBottom: 28,
              animation: "fadeUp 1s ease 0.2s both",
            }}>
              Każde<br />
              <span style={{ fontStyle: "italic", color: "#2a5caa" }}>porozumienie</span><br />
              zaczyna się<br />od odwagi.
            </h1>
            <p style={{
              fontSize: "1.05rem", lineHeight: 1.75, color: "#4a5e80", maxWidth: 420,
              marginBottom: 40, fontWeight: 300,
              animation: "fadeUp 1s ease 0.35s both",
            }}>
              Pomagam stronom w konflikcie znaleźć trwałe rozwiązanie — bez sali sądowej, z szacunkiem dla obu stron.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeUp 1s ease 0.45s both" }}>
              <a href="#kontakt" onClick={e => scrollToSection(e, "#kontakt")} className="btn-primary">Umów konsultację</a>
              <a href="#uslugi" onClick={e => scrollToSection(e, "#uslugi")} className="btn-outline">Dowiedz się więcej</a>
            </div>
          </div>

          <div className="hero-image" style={{ animation: "fadeUp 1s ease 0.3s both" }}>
            <div style={{
              width: "clamp(260px, 35vw, 420px)",
              aspectRatio: "4/5",
              background: "linear-gradient(145deg, #dce8f8, #b8cef0)",
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "absolute", inset: -12, border: "1px solid #aac4e8", zIndex: -1 }} />
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "4rem", color: "#0d1e3d", opacity: 0.15, lineHeight: 1 }}>AK</div>
                <div style={{ width: 48, height: 1, background: "#2a5caa", margin: "16px auto" }} />
                <p style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "1.1rem", color: "#0d1e3d", fontStyle: "italic", opacity: 0.7 }}>
                  "Mediacja to rozmowa,<br />która zmienia wszystko."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O MNIE */}
      <section id="o-mnie" className="section-padding" style={{ padding: "100px clamp(24px, 5vw, 80px)", background: "#fff" }}>
        <div className="grid-two-col" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              aspectRatio: "1/1.1",
              background: "linear-gradient(135deg, #e8f0fb 0%, #d0e2f8 100%)",
              position: "relative",
              maxWidth: 420,
            }}>
              <div style={{ position: "absolute", bottom: -16, right: -16, width: "70%", height: "70%", background: "#f0f5ff", zIndex: -1 }} />
              <div style={{ padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "1rem", color: "#2a5caa", fontStyle: "italic", marginBottom: 12 }}>
                  Mediator · Psycholog · Pedagog
                </div>
                <div style={{ width: 36, height: 1, background: "#2a5caa" }} />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <span className="section-label">O mnie</span>
            <div className="divider-line" />
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Anna Kulka —<br />
              <span style={{ fontStyle: "italic" }}>Psycholog i mediator</span>
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "#4a5e80", marginBottom: 20, fontWeight: 300 }}>
              Centrum Mediacji to miejsce, w którym konflikt staje się początkiem porozumienia — a nie walki. W swojej pracy opieram się na wiedzy psychologicznej, doświadczeniu zawodowym oraz rzeczywistym rozumieniu relacji międzyludzkich, aby pomagać stronom znaleźć rozwiązania realne, trwałe i satysfakcjonujące.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "#4a5e80", marginBottom: 20, fontWeight: 300 }}>
              Na co dzień pracuję jako psycholog w środowisku szkolnym, gdzie wspieram dzieci, młodzież, nauczycieli oraz rodziców w rozwiązywaniu trudnych sytuacji. To doświadczenie nauczyło mnie skutecznej komunikacji, pracy z emocjami i budowania porozumienia nawet w najbardziej napiętych konfliktach.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "#4a5e80", marginBottom: 32, fontWeight: 300 }}>
              Jestem magistrem psychologii i pedagogiki. Jako mama nastolatka dobrze rozumiem realne wyzwania wychowawcze i rodzinne — co pozwala mi prowadzić mediacje z empatią, spokojem i praktycznym podejściem.
            </p>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[["Mediator", "Wpisana na listę MŚ"], ["Psycholog", "Mgr psychologii i pedagogiki"], ["Szkoła", "Wieloletnia praktyka"]].map(([t, s]) => (
                <div key={t}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#0d1e3d", marginBottom: 2 }}>{t}</div>
                  <div style={{ fontSize: "0.75rem", color: "#7a90b0" }}>{s}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* USŁUGI */}
      <section id="uslugi" className="section-padding" style={{ padding: "100px clamp(24px, 5vw, 80px)", background: "#f6f9ff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="section-label">Specjalizacje</span>
              <div className="divider-line" style={{ margin: "0 auto 24px" }} />
              <h2 className="section-title">Prowadzę mediacje w sprawach</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: "📋", title: "Cywilnych", points: ["Spory o zapłatę (pożyczki, umowy, odszkodowania)", "Podział majątku wspólnego", "Spory sąsiedzkie", "Spory z umów cywilnych"] },
              { icon: "💼", title: "Pracowniczych", points: ["Spory o zapłatę i świadectwo pracy", "Konflikty dot. warunków zatrudnienia", "Konflikty wewnątrz organizacji", "Mobbing i dyskryminacja"] },
              { icon: "👨‍👩‍👧", title: "Rodzinnych", points: ["Kwestie alimentacyjne", "Kontakty z małoletnimi", "Sprawy wychowawcze", "Warunki rozwodu lub separacji", "Kwestie dotyczące dzieci"] },
              { icon: "⚖️", title: "Sądowych", points: ["Kierowanych przez sąd we wszystkich wyżej wymienionych sprawach", "Jako alternatywa dla postępowania procesowego"] },
              { icon: "🏫", title: "Szkolnych i rówieśniczych", points: ["Uczeń – uczeń", "Uczeń – nauczyciel", "Nauczyciel – nauczyciel", "Rodzic – nauczyciel", "Szkoła – rodzice"] },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="service-card" style={{ height: "100%" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 16 }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "1.45rem", fontWeight: 600, color: "#0d1e3d", marginBottom: 16 }}>{s.title}</h3>
                  <div style={{ width: 28, height: 1, background: "#2a5caa", marginBottom: 16 }} />
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {s.points.map((p, j) => (
                      <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.88rem", color: "#5a6e8a", lineHeight: 1.65, fontWeight: 300 }}>
                        <span style={{ color: "#2a5caa", marginTop: 2, flexShrink: 0 }}>—</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CENNIK */}
      <section id="cennik" className="section-padding" style={{ padding: "100px clamp(24px, 5vw, 80px)", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="section-label">Cennik</span>
              <div className="divider-line" style={{ margin: "0 auto 24px" }} />
              <h2 className="section-title">Przejrzyste warunki</h2>
              <p style={{ fontSize: "0.95rem", color: "#7a90b0", marginTop: 16, fontWeight: 300 }}>Każda sprawa jest wyceniana indywidualnie. Poniżej orientacyjne stawki.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { title: "Konsultacja wstępna", price: "Bezpłatna", unit: "30 minut online", features: ["Omówienie sprawy", "Ocena możliwości mediacji", "Odpowiedzi na pytania"], featured: false, cta: "Umów spotkanie" },
              { title: "Mediacja sądowa", price: "Zgodnie z przepisami", unit: "rozporządzenia Ministra Sprawiedliwości", features: ["Protokół z posiedzenia", "Projekt ugody w cenie", "Możliwość zatwierdzenia przez sąd"], featured: true, cta: "Zapytaj o szczegóły" },
              { title: "Mediacja prywatna", price: "Wycena indywidualna", unit: "zależna od rodzaju i złożoności sprawy", features: ["Pełna poufność", "Elastyczne terminy", "Online lub stacjonarnie", "Umowa o mediację"], featured: false, cta: "Zapytaj o wycenę" },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`price-card${p.featured ? " featured" : ""}`}>
                  {p.featured && (
                    <div style={{ position: "absolute", top: -1, right: 24, background: "#2a5caa", color: "#fff", fontSize: "0.7rem", letterSpacing: "0.14em", padding: "4px 12px", textTransform: "uppercase" }}>
                      Najczęściej wybierana
                    </div>
                  )}
                  <div style={{ fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: p.featured ? "#7aaae0" : "#2a5caa", marginBottom: 12 }}>{p.title}</div>
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: (p.price === "Wycena indywidualna" || p.price === "Zgodnie z przepisami") ? "1.7rem" : "2.4rem", fontWeight: 600, color: p.featured ? "#fff" : "#0d1e3d", lineHeight: 1.2 }}>{p.price}</div>
                  <div style={{ fontSize: "0.8rem", color: p.featured ? "#8aaccc" : "#9aaac0", marginBottom: 28, marginTop: 4 }}>{p.unit}</div>
                  <div style={{ width: "100%", height: 1, background: p.featured ? "rgba(255,255,255,0.1)" : "#e8eef8", marginBottom: 24 }} />
                  <ul style={{ listStyle: "none", marginBottom: 32 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ fontSize: "0.88rem", color: p.featured ? "#b8d0ea" : "#5a6e8a", marginBottom: 10, display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 300 }}>
                        <span style={{ color: p.featured ? "#7aaae0" : "#2a5caa", marginTop: 2 }}>—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#kontakt" onClick={e => scrollToSection(e, "#kontakt")} style={{
                    display: "block", textAlign: "center",
                    padding: "12px 24px",
                    background: p.featured ? "#2a5caa" : "transparent",
                    border: `1.5px solid ${p.featured ? "#2a5caa" : "#1a2a4a"}`,
                    color: p.featured ? "#fff" : "#1a2a4a",
                    fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    transition: "all 0.3s",
                  }}>{p.cta}</a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CYTAT */}
      <section style={{ background: "#0d1e3d", padding: "80px clamp(24px, 5vw, 80px)", textAlign: "center" }}>
        <FadeIn>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontSize: "4rem", fontFamily: "'Cormorant Garant', serif", color: "#2a5caa", lineHeight: 0.8, marginBottom: 24 }}>"</div>
            <p style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontStyle: "italic", color: "#dde8f8", lineHeight: 1.5, fontWeight: 400 }}>
              Mediacja nie jest kompromisem,<br />w którym wszyscy tracą. To szukanie rozwiązania, na które wszyscy mogą się zgodzić.
            </p>
            <div style={{ width: 32, height: 1, background: "#2a5caa", margin: "32px auto 16px" }} />
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.16em", color: "#5a78a0", textTransform: "uppercase" }}>Anna Kulka</p>
          </div>
        </FadeIn>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="section-padding" style={{ padding: "100px clamp(24px, 5vw, 80px)", background: "#f6f9ff" }}>
        <div className="grid-contact" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <span className="section-label">Kontakt</span>
            <div className="divider-line" />
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Zacznijmy<br />
              <span style={{ fontStyle: "italic" }}>tę rozmowę</span>
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#4a5e80", marginBottom: 40, fontWeight: 300 }}>
              Pierwsza konsultacja jest bezpłatna. Skontaktuj się, aby omówić Twoją sprawę i sprawdzić, czy mediacja jest odpowiednim rozwiązaniem.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📍", label: "Lokalizacja", value: "Rypin i okolice" },
                { icon: "📞", label: "Telefon", value: "725-514-482", href: "tel:+48725514482" },
                { icon: "✉️", label: "E-mail", value: "mediacje.ugoda@wp.pl", href: "mailto:mediacje.ugoda@wp.pl" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.1rem", marginTop: 2 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#2a5caa", marginBottom: 2 }}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} style={{ fontSize: "0.95rem", color: "#1a2a4a", fontWeight: 300, transition: "color 0.2s" }}
                          onMouseOver={e => e.target.style.color = "#2a5caa"} onMouseOut={e => e.target.style.color = "#1a2a4a"}>
                          {c.value}
                        </a>
                      : <div style={{ fontSize: "0.95rem", color: "#1a2a4a", fontWeight: 300 }}>{c.value}</div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center", gap: 16 }}>
                <div style={{ fontSize: "3rem" }}>✓</div>
                <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "1.8rem", color: "#0d1e3d" }}>Wiadomość wysłana</h3>
                <p style={{ color: "#7a90b0", fontWeight: 300 }}>Odezwę się do Ciebie w ciągu 48 godzin.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="grid-form-row">
                  <div>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a90b0", display: "block", marginBottom: 8 }}>Imię i nazwisko</label>
                    <input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jan Kowalski" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a90b0", display: "block", marginBottom: 8 }}>E-mail</label>
                    <input className="input-field" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="jan@email.pl" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a90b0", display: "block", marginBottom: 8 }}>Rodzaj sprawy</label>
                  <select className="input-field" style={{ cursor: "pointer" }}>
                    <option>Mediacja sądowa</option>
                    <option>Mediacja pozasądowa</option>
                    <option>Mediacja rodzinna</option>
                    <option>Mediacja gospodarcza</option>
                    <option>Inne</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a90b0", display: "block", marginBottom: 8 }}>Wiadomość</label>
                  <textarea className="input-field" rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Krótko opisz swoją sytuację..." style={{ resize: "vertical" }} />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9aaac0", fontWeight: 300 }}>
                  Twoje dane są bezpieczne. Pełna poufność zgodna z ustawą o mediacji.
                </p>
                <button className="btn-primary" onClick={handleSubmit} style={{ width: "100%", padding: 16 }}>
                  Wyślij wiadomość
                </button>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d1e3d", padding: "40px clamp(24px, 5vw, 80px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "1rem", color: "#6888aa" }}>
          © 2026 Anna Kulka · Centrum Mediacji
        </div>
        <div className="footer-links" style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={e => scrollToSection(e, l.href)}
              style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a6080", transition: "color 0.3s" }}
              onMouseOver={e => e.target.style.color = "#7aaae0"} onMouseOut={e => e.target.style.color = "#4a6080"}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#3a5070" }}>Mediator wpisany na listę Ministra Sprawiedliwości</div>
      </footer>
    </div>
  );
}
