import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";
import emailjs from "@emailjs/browser";

const MENU_DATA = {
  Coffee: [
    { id: 1, name: "Espresso", desc: "Bold, rich single shot from premium Arabica", price: 120, tag: "Bestseller" },
    { id: 2, name: "Cappuccino", desc: "Velvety microfoam with perfect espresso balance", price: 180, tag: "" },
    { id: 3, name: "Cold Brew", desc: "12-hour steeped, smooth & intensely flavored", price: 220, tag: "New" },
    { id: 4, name: "Hazelnut Latte", desc: "Creamy latte kissed with hazelnut richness", price: 240, tag: "" },
  ],
  Tea: [
    { id: 5, name: "Masala Chai", desc: "Aromatic Indian spiced milk tea", price: 80, tag: "Classic" },
    { id: 6, name: "Green Tea Elixir", desc: "Jasmine-infused premium green tea", price: 140, tag: "" },
    { id: 7, name: "Kashmiri Kahwa", desc: "Saffron & cardamom Kashmiri blend", price: 180, tag: "Specialty" },
  ],
  Mojitos: [
    { id: 8, name: "Classic Mint Mojito", desc: "Fresh mint, lime, soda – perfectly chilled", price: 160, tag: "" },
    { id: 9, name: "Watermelon Mojito", desc: "Summer-fresh watermelon & mint fusion", price: 180, tag: "Popular" },
    { id: 10, name: "Blue Lagoon Mojito", desc: "Tropical blue curacao with citrus burst", price: 190, tag: "Signature" },
    { id: 11, name: "Virgin Mojito", desc: "The timeless refreshing classic", price: 150, tag: "" },
  ],
  Shakes: [
    { id: 12, name: "Oreo Overload", desc: "Thick Oreo milkshake with whipped cream", price: 220, tag: "Bestseller" },
    { id: 13, name: "Chocolate Shake", desc: "Rich Belgian chocolate milkshake", price: 200, tag: "" },
    { id: 14, name: "Nutella Shake", desc: "Indulgent Nutella with roasted hazelnut", price: 240, tag: "Premium" },
    { id: 15, name: "Mango Madness", desc: "Alphonso mango thick shake", price: 210, tag: "Seasonal" },
  ],
  Starters: [
    { id: 16, name: "Honey Chilli Potato", desc: "Crispy potato tossed in sweet chilli glaze", price: 180, tag: "Bestseller" },
    { id: 17, name: "Loaded Fries", desc: "Seasoned fries with cheese sauce & jalapeños", price: 200, tag: "" },
    { id: 18, name: "Peri Peri Fries", desc: "House-spiced fries with peri peri seasoning", price: 190, tag: "" },
    { id: 19, name: "Veg Spring Rolls", desc: "Crispy Asian-style mixed veg rolls", price: 160, tag: "" },
  ],
  Burgers: [
    { id: 20, name: "Veg Burger", desc: "Crispy patty with fresh slaw & signature sauce", price: 180, tag: "" },
    { id: 21, name: "Cheese Burger", desc: "Double cheese with caramelized onions", price: 220, tag: "Popular" },
    { id: 22, name: "Paneer Tikka Burger", desc: "Spiced paneer tikka in brioche bun", price: 240, tag: "Signature" },
    { id: 23, name: "Mushroom Swiss", desc: "Sautéed mushroom with Swiss cheese", price: 230, tag: "" },
  ],
  Pizza: [
    { id: 24, name: "Margherita", desc: "San Marzano tomato, fresh basil, mozzarella", price: 280, tag: "" },
    { id: 25, name: "Paneer Tikka Pizza", desc: "Spiced paneer, peppers & tikka sauce", price: 340, tag: "Bestseller" },
    { id: 26, name: "Farm Fresh Veggie", desc: "Garden vegetables on herb-infused tomato base", price: 320, tag: "" },
    { id: 27, name: "BBQ Corn Pizza", desc: "Sweet corn with smoky BBQ sauce", price: 300, tag: "" },
  ],
  Pasta: [
    { id: 28, name: "White Sauce Pasta", desc: "Creamy béchamel with herbs & parmesan", price: 240, tag: "" },
    { id: 29, name: "Mix Sauce Pasta", desc: "Dual sauce – creamy meets tangy arrabbiata", price: 260, tag: "Signature" },
    { id: 30, name: "Arrabbiata", desc: "Spicy tomato-basil with garlic & chilli", price: 230, tag: "" },
    { id: 31, name: "Pesto Pasta", desc: "Basil pesto with pine nuts & parmesan", price: 270, tag: "Premium" },
  ],
  Sandwiches: [
    { id: 32, name: "Club Sandwich", desc: "Triple-decker with veggies & cream cheese", price: 200, tag: "" },
    { id: 33, name: "Grilled Paneer", desc: "Spiced paneer with mint chutney & onion", price: 220, tag: "Popular" },
    { id: 34, name: "Bombay Toast", desc: "Classic Bombay-style masala toast", price: 160, tag: "Classic" },
  ],
  Momos: [
    { id: 35, name: "Steamed Veg Momos", desc: "Delicate veg dumplings with chilli sauce", price: 160, tag: "" },
    { id: 36, name: "Pan Fried Momos", desc: "Crispy pan-fried dumplings", price: 180, tag: "Popular" },
    { id: 37, name: "Paneer Momos", desc: "Cottage cheese filled steamed dumplings", price: 190, tag: "" },
  ],
  Desserts: [
    { id: 38, name: "Brownie + Ice Cream", desc: "Warm fudge brownie with vanilla scoop", price: 220, tag: "Bestseller" },
    { id: 39, name: "Gulab Jamun", desc: "Soft milk dumplings in rose saffron syrup", price: 140, tag: "Classic" },
    { id: 40, name: "Waffles", desc: "Belgian waffle with maple & fresh berries", price: 260, tag: "Premium" },
    { id: 41, name: "Cheesecake", desc: "New York style baked cheesecake", price: 280, tag: "" },
  ],
};

const FEATURED_ITEMS = [
  { name: "White Sauce Pasta", desc: "Silky béchamel, herbs, parmesan perfection", price: 240, emoji: "🍝", gradient: "from-amber-900/40 to-orange-900/40" },
  { name: "Mix Sauce Pasta", desc: "The ultimate dual-sauce experience", price: 260, emoji: "🫙", gradient: "from-red-900/40 to-orange-900/40" },
  { name: "Veg Burger", desc: "Fresh, crispy, loaded with flavour", price: 180, emoji: "🍔", gradient: "from-green-900/40 to-emerald-900/40" },
  { name: "Cheese Burger", desc: "Double cheese, zero regrets", price: 220, emoji: "🧀", gradient: "from-yellow-900/40 to-amber-900/40" },
  { name: "Loaded Fries", desc: "Cheese, jalapeños & house sauce", price: 200, emoji: "🍟", gradient: "from-amber-900/40 to-yellow-900/40" },
  { name: "Honey Chilli Potato", desc: "Sweet heat you'll crave again", price: 180, emoji: "🌶️", gradient: "from-red-900/40 to-pink-900/40" },
  { name: "Mojito Collection", desc: "6 flavours of refreshment", price: 160, emoji: "🍹", gradient: "from-teal-900/40 to-cyan-900/40" },
  { name: "Cold Coffee", desc: "Smooth, bold, perfectly chilled", price: 180, emoji: "☕", gradient: "from-stone-900/40 to-amber-900/40" },
  { name: "Chocolate Shake", desc: "Rich Belgian chocolate indulgence", price: 200, emoji: "🍫", gradient: "from-brown-900/40 to-amber-900/40" },
];

const REVIEWS = [
  { name: "Priya Sharma", rating: 5, text: "Absolutely stunning ambience! The Mix Sauce Pasta is to die for. Perfect date night spot in Kanpur. Will definitely be back!", avatar: "PS", date: "2 weeks ago" },
  { name: "Arjun Verma", rating: 5, text: "Best café in Kanpur hands down. The Cold Brew is exceptional and the vibe is super premium. Feels like a 5-star experience at affordable prices.", avatar: "AV", date: "1 month ago" },
  { name: "Sneha Agarwal", rating: 5, text: "Celebrated my birthday here and it was magical! The team decorated beautifully. Food was amazing, staff super warm. 10/10!", avatar: "SA", date: "3 weeks ago" },
  { name: "Rohit Gupta", rating: 5, text: "Finally, Kanpur has a café that matches big city standards. Honey Chilli Potato and Mojito combo is UNREAL. My new office haunt!", avatar: "RG", date: "1 week ago" },
  { name: "Kavya Singh", rating: 5, text: "The interiors are Instagram-worthy! Every corner is a photo opportunity. Food is fresh and delicious. Loved the Oreo Shake!", avatar: "KS", date: "5 days ago" },
];

const GALLERY_ITEMS = [
  { cat: "Food", label: "Loaded Fries", emoji: "🍟", h: "tall" },
  { cat: "Drinks", label: "Mojito Trio", emoji: "🍹", h: "short" },
  { cat: "Interior", label: "Golden Hour", emoji: "✨", h: "short" },
  { cat: "Food", label: "Pasta Bowl", emoji: "🍝", h: "tall" },
  { cat: "Birthday", label: "Celebrations", emoji: "🎂", h: "short" },
  { cat: "Couple", label: "Couple Corner", emoji: "💕", h: "tall" },
  { cat: "Drinks", label: "Cold Coffee", emoji: "☕", h: "short" },
  { cat: "Interior", label: "Night Vibes", emoji: "🌙", h: "tall" },
  { cat: "Food", label: "Burger Stack", emoji: "🍔", h: "short" },
  { cat: "Events", label: "Group Hangout", emoji: "🎉", h: "short" },
];

const NAV_LINKS = ["Home", "Menu", "Gallery", "About", "Contact"];
const PAGES = ["home", "menu", "gallery", "about", "contact", "reserve", "order"];

// ── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(" "); }

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ n = 5 }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ color: "#C89B3C", fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

// ── ScrollReveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Gold divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div style={{ width: 40, height: 1, background: "#C89B3C" }} />
      <span style={{ color: "#C89B3C", fontSize: 18 }}>✦</span>
      <div style={{ width: 40, height: 1, background: "#C89B3C" }} />
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ color: "#C89B3C", fontFamily: "'Poppins',sans-serif", fontSize: 12, letterSpacing: "0.22em", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>
      {children}
    </p>
  );
}

// ── Section Heading ───────────────────────────────────────────────────────────
function SectionHeading({ children, light = true }) {
  return (
    <h2 style={{
      fontFamily: "'Playfair Display',serif",
      fontSize: "clamp(2rem, 5vw, 3.2rem)",
      fontWeight: 700,
      color: light ? "#F5F1EA" : "#111111",
      lineHeight: 1.15,
      marginBottom: 8,
    }}>
      {children}
    </h2>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? "rgba(15,15,15,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,155,60,0.15)" : "none",
        transition: "all 0.4s ease",
        padding: "0 5%",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <button onClick={() => setPage("home")} style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#C89B3C", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.02em" }}>
            KANPUR <span style={{ color: "#F5F1EA" }}>CAFÉ</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => setPage(l.toLowerCase())} style={{
                fontFamily: "'Poppins',sans-serif", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
                color: page === l.toLowerCase() ? "#C89B3C" : "#F5F1EA",
                background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
              }}>{l}</button>
            ))}
            <button onClick={() => setPage("reserve")} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
              background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "10px 22px", borderRadius: 2, cursor: "pointer", transition: "opacity 0.2s",
            }}>Reserve</button>
            <button onClick={() => setPage("order")} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
              background: "transparent", color: "#C89B3C", border: "1px solid #C89B3C", padding: "9px 18px", borderRadius: 2, cursor: "pointer", position: "relative",
            }}>
              Order {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: "#C89B3C", color: "#0F0F0F", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#F5F1EA", fontSize: 24, cursor: "pointer" }}>☰</button>
        </div>
        {open && (
          <div style={{ background: "rgba(15,15,15,0.98)", borderTop: "1px solid rgba(200,155,60,0.2)", padding: "16px 5%", display: "flex", flexDirection: "column", gap: 16 }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => { setPage(l.toLowerCase()); setOpen(false); }} style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: page === l.toLowerCase() ? "#C89B3C" : "#F5F1EA", background: "none", border: "none", cursor: "pointer", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</button>
            ))}
            <button onClick={() => { setPage("reserve"); setOpen(false); }} style={{ background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "12px", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 2, cursor: "pointer" }}>Reserve a Table</button>
          </div>
        )}
      </nav>
      {/* Floating Reserve Button (mobile) */}
      <div className="md:hidden" style={{ position: "fixed", bottom: 80, right: 20, zIndex: 998 }}>
        <button onClick={() => setPage("reserve")} style={{
          background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "14px 20px",
          borderRadius: 50, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 8px 32px rgba(200,155,60,0.4)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>📅 Reserve</button>
      </div>
      {/* Mobile Bottom Nav */}
      <div className="md:hidden" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 997,
        background: "rgba(15,15,15,0.97)", borderTop: "1px solid rgba(200,155,60,0.15)",
        display: "flex", justifyContent: "space-around", padding: "8px 0",
      }}>
        {[["🏠", "home"], ["🍽️", "menu"], ["📸", "gallery"], ["ℹ️", "about"], ["📞", "contact"]].map(([icon, p]) => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            color: page === p ? "#C89B3C" : "#888", fontSize: 10, fontFamily: "'Poppins',sans-serif", textTransform: "capitalize",
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            {p}
          </button>
        ))}
      </div>
    </>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────
function HomePage({ setPage, addToCart }) {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [galFilter, setGalFilter] = useState("All");

  useEffect(() => {
    const t = setInterval(() => setReviewIdx(i => (i + 1) % REVIEWS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const galCats = ["All", "Food", "Drinks", "Interior", "Birthday", "Couple", "Events"];
  const filtered = galFilter === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.cat === galFilter);

  return (
    <div style={{ background: "#0F0F0F", color: "#F5F1EA" }}>
      {/* HERO */}
      <section style={{
        minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0F0F0F 0%, #1a0f05 50%, #0F0F0F 100%)",
        overflow: "hidden",
      }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,155,60,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,155,60,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Grain */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />
        {/* Pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "repeating-linear-gradient(45deg, #C89B3C 0, #C89B3C 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ textAlign: "center", padding: "0 5%", maxWidth: 900, position: "relative", zIndex: 1 }}>
          <div style={{ opacity: 1, transform: "none" }}>
            <SectionLabel>Welcome to Kanpur's Finest</SectionLabel>
            <GoldDivider />
            <h1 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              fontWeight: 700, lineHeight: 1.1, color: "#F5F1EA",
              marginBottom: 24, marginTop: 16,
            }}>
              Where Great Food Meets<br /><span style={{ color: "#C89B3C", fontStyle: "italic" }}>Great Conversations</span>
            </h1>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(245,241,234,0.7)", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 40px" }}>
              Experience handcrafted beverages, delicious food, cozy interiors, and unforgettable moments at Kanpur Café — Kanpur's most loved destination.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setPage("menu")} style={{
                fontFamily: "'Poppins',sans-serif", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
                background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "16px 36px", cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(200,155,60,0.35)"; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}
              >View Menu</button>
              <button onClick={() => setPage("reserve")} style={{
                fontFamily: "'Poppins',sans-serif", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
                background: "transparent", color: "#F5F1EA", border: "1px solid rgba(245,241,234,0.4)", padding: "16px 36px", cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C89B3C"; e.currentTarget.style.color = "#C89B3C"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,241,234,0.4)"; e.currentTarget.style.color = "#F5F1EA"; }}
              >Reserve a Table</button>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite" }}>
          <div style={{ width: 24, height: 40, border: "1px solid rgba(200,155,60,0.4)", borderRadius: 12, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 6 }}>
            <div style={{ width: 4, height: 8, background: "#C89B3C", borderRadius: 2, animation: "scrolldown 1.5s infinite" }} />
          </div>
        </div>
        <style>{`
          @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-8px)} }
          @keyframes scrolldown { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(12px)} }
        `}</style>
      </section>

      {/* EXPERIENCE SECTION */}
      <section style={{ padding: "100px 5%", background: "#0F0F0F" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, alignItems: "center" }}>
            <Reveal>
              <SectionLabel>Our Signature Experience</SectionLabel>
              <SectionHeading>More Than Just a Café.</SectionHeading>
              <GoldDivider />
              <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.7)", lineHeight: 1.8, marginTop: 16, marginBottom: 24, fontSize: "0.95rem" }}>
                Step into a world where the aroma of freshly brewed coffee blends with laughter, where every seat tells a story, and every bite creates a memory. Kanpur Café was born from a simple dream — to create Kanpur's most beautiful, welcoming, and unforgettable café experience.
              </p>
              <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.7)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                From intimate date nights to loud birthday celebrations, from quiet study sessions to group hangouts — we've crafted every corner with intention, every dish with love.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: "☕", label: "Premium Coffee", sub: "Single origin beans" },
                  { icon: "🌿", label: "Fresh Ingredients", sub: "Sourced daily" },
                  { icon: "✨", label: "Cozy Ambience", sub: "Instagrammable spaces" },
                  { icon: "❤️", label: "Made With Love", sub: "Every single dish" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", padding: "24px 20px",
                    borderRadius: 4, transition: "border-color 0.2s, transform 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,155,60,0.5)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,155,60,0.15)"; e.currentTarget.style.transform = ""; }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                    <p style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 12 }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 5%", background: "linear-gradient(90deg, #1A1A1A 0%, #0F0F0F 100%)", borderTop: "1px solid rgba(200,155,60,0.1)", borderBottom: "1px solid rgba(200,155,60,0.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, textAlign: "center" }}>
          {[["10,000+", "Happy Customers"], ["5,000+", "Reservations"], ["4.8 ★", "Google Rating"], ["2019", "Est. Year"]].map(([n, l]) => (
            <Reveal key={l}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.5rem", fontWeight: 700, color: "#C89B3C" }}>{n}</p>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "rgba(245,241,234,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED MENU */}
      <section style={{ padding: "100px 5%", background: "#0F0F0F" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <SectionLabel>Crafted With Passion</SectionLabel>
              <SectionHeading>Our Signature Dishes</SectionHeading>
              <GoldDivider />
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
            {FEATURED_ITEMS.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <MenuCard item={item} addToCart={addToCart} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <button onClick={() => setPage("menu")} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
              background: "transparent", color: "#C89B3C", border: "1px solid #C89B3C", padding: "14px 40px", cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C89B3C"; e.currentTarget.style.color = "#0F0F0F"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C89B3C"; }}
            >Explore Full Menu →</button>
          </div>
        </div>
      </section>

      {/* WHY PEOPLE LOVE US */}
      <section style={{ padding: "100px 5%", background: "#1A1A1A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <SectionLabel>Why Kanpur Loves Us</SectionLabel>
            <SectionHeading>A Café That Cares</SectionHeading>
            <GoldDivider />
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 24, marginTop: 60 }}>
            {[
              { icon: "🌿", title: "Fresh Ingredients", desc: "We source fresh produce daily to ensure every bite is as flavourful as the first" },
              { icon: "🛋️", title: "Cozy Ambience", desc: "Thoughtfully designed spaces that make you feel instantly at home" },
              { icon: "⚡", title: "Fast Service", desc: "Warm, prompt service because your time and experience matter to us" },
              { icon: "💎", title: "Affordable Luxury", desc: "Premium café experience at prices that make sense for Kanpur" },
              { icon: "💕", title: "Perfect For Dates", desc: "Romantic lighting, private corners, and a vibe that sets the mood" },
              { icon: "🎉", title: "Celebrations Welcome", desc: "Birthday setups, group parties, and special occasions done right" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{
                  background: "#0F0F0F", border: "1px solid rgba(200,155,60,0.12)", padding: "36px 28px", textAlign: "center",
                  transition: "border-color 0.2s, transform 0.2s", cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C89B3C"; e.currentTarget.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,155,60,0.12)"; e.currentTarget.style.transform = ""; }}
                >
                  <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.55)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "100px 5%", background: "#0F0F0F" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <SectionLabel>What People Say</SectionLabel>
            <SectionHeading>Our Guests, Our Pride</SectionHeading>
            <GoldDivider />
          </Reveal>
          <div style={{ marginTop: 60, position: "relative" }}>
            <div style={{
              background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", padding: "48px 40px",
              transition: "all 0.4s ease", minHeight: 240,
            }}>
              <div style={{ fontSize: 60, color: "#C89B3C", lineHeight: 1, marginBottom: 16, fontFamily: "'Playfair Display',serif" }}>"</div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: "1.05rem", color: "rgba(245,241,234,0.85)", lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>
                {REVIEWS[reviewIdx].text}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#C89B3C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#0F0F0F", fontSize: 15 }}>{REVIEWS[reviewIdx].avatar}</div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontWeight: 600, fontSize: 16 }}>{REVIEWS[reviewIdx].name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Stars />
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "rgba(245,241,234,0.4)" }}>{REVIEWS[reviewIdx].date}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIdx(i)} style={{
                  width: i === reviewIdx ? 28 : 8, height: 8, borderRadius: 4, border: "none",
                  background: i === reviewIdx ? "#C89B3C" : "rgba(200,155,60,0.3)", cursor: "pointer", transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section style={{ padding: "100px 5%", background: "#1A1A1A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionLabel>Instagram Moments</SectionLabel>
              <SectionHeading>Every Corner a Photo</SectionHeading>
              <GoldDivider />
            </div>
          </Reveal>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {galCats.map(c => (
              <button key={c} onClick={() => setGalFilter(c)} style={{
                fontFamily: "'Poppins',sans-serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                background: galFilter === c ? "#C89B3C" : "transparent", color: galFilter === c ? "#0F0F0F" : "#F5F1EA",
                border: `1px solid ${galFilter === c ? "#C89B3C" : "rgba(245,241,234,0.2)"}`,
                padding: "8px 18px", cursor: "pointer", borderRadius: 2, transition: "all 0.2s",
              }}>{c}</button>
            ))}
          </div>
          <div style={{ columns: "repeat(auto-fill, minmax(200px, 1fr))", columnGap: 8 }}>
            {filtered.map((item, i) => (
              <div key={i} style={{
                breakInside: "avoid", marginBottom: 8,
                background: "#0F0F0F", border: "1px solid rgba(200,155,60,0.1)",
                height: item.h === "tall" ? 280 : 180,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", position: "relative",
                transition: "transform 0.3s, border-color 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "#C89B3C"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(200,155,60,0.1)"; }}
              >
                <div style={{ fontSize: 48, marginBottom: 8 }}>{item.emoji}</div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "rgba(245,241,234,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</p>
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(200,155,60,0.05) 0%, transparent 100%)` }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "rgba(245,241,234,0.6)" }}>
              Follow us <span style={{ color: "#C89B3C" }}>@KanpurCafe</span> for daily updates ✨
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "120px 5%", textAlign: "center",
        background: "linear-gradient(135deg, #1a0f05 0%, #0F0F0F 50%, #0a0a0a 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,155,60,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Reveal>
          <SectionLabel>Ready to Visit?</SectionLabel>
          <SectionHeading>Your Table is Waiting</SectionHeading>
          <GoldDivider />
          <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.65)", maxWidth: 500, margin: "16px auto 40px", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Join thousands of happy guests who've made Kanpur Café their favourite escape. Reserve your spot for an unforgettable experience.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("reserve")} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700,
              background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "18px 44px", cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 16px 48px rgba(200,155,60,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}
            >Reserve a Table →</button>
            <button onClick={() => setPage("order")} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
              background: "transparent", color: "#F5F1EA", border: "1px solid rgba(245,241,234,0.25)", padding: "18px 44px", cursor: "pointer",
            }}>Order Online</button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ── Menu Card (shared) ────────────────────────────────────────────────────────
function MenuCard({ item, addToCart, full = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#1A1A1A" : "#111", border: `1px solid ${hov ? "#C89B3C" : "rgba(200,155,60,0.12)"}`,
        borderRadius: 4, overflow: "hidden", transition: "all 0.3s ease",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,155,60,0.1)" : "none",
      }}
    >
      <div style={{
        height: 160, display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, rgba(26,26,26,0.8) 0%, rgba(15,15,15,0.9) 100%)`,
        fontSize: 64, position: "relative", overflow: "hidden",
      }}>
        <span style={{ transform: hov ? "scale(1.15)" : "scale(1)", transition: "transform 0.4s ease", display: "block" }}>
          {item.emoji || "🍽️"}
        </span>
        {item.tag && (
          <span style={{
            position: "absolute", top: 12, right: 12, background: "#C89B3C", color: "#0F0F0F",
            fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "4px 10px", borderRadius: 2,
          }}>{item.tag}</span>
        )}
      </div>
      <div style={{ padding: "20px 20px 24px" }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{item.name}</h3>
        <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#C89B3C", fontSize: 18, fontWeight: 700 }}>₹{item.price}</span>
          {addToCart && (
            <button onClick={() => addToCart(item)} style={{
              background: hov ? "#C89B3C" : "transparent", color: hov ? "#0F0F0F" : "#C89B3C",
              border: "1px solid #C89B3C", padding: "7px 16px", fontSize: 11, fontFamily: "'Poppins',sans-serif",
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
              transition: "all 0.2s", borderRadius: 2,
            }}>Add +</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MENU PAGE ─────────────────────────────────────────────────────────────────
function MenuPage({ addToCart }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const cats = ["All", ...Object.keys(MENU_DATA)];
  const allItems = Object.entries(MENU_DATA).flatMap(([c, items]) => items.map(i => ({ ...i, cat: c })));
  const filtered = allItems.filter(i =>
    (cat === "All" || i.cat === cat) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ padding: "60px 5%", background: "linear-gradient(180deg, #1a0f05 0%, #0F0F0F 100%)", textAlign: "center", borderBottom: "1px solid rgba(200,155,60,0.1)" }}>
        <SectionLabel>Fresh & Handcrafted</SectionLabel>
        <SectionHeading>Our Menu</SectionHeading>
        <GoldDivider />
        <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.6)", fontSize: "0.9rem", marginTop: 12 }}>
          Every dish crafted with love, every drink brewed with care
        </p>
      </div>
      <div style={{ padding: "40px 5%", maxWidth: 1200, margin: "0 auto" }}>
        {/* Search */}
        <div style={{ marginBottom: 32, position: "relative", maxWidth: 480 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search menu..."
            style={{
              width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA",
              padding: "14px 20px 14px 48px", fontFamily: "'Poppins',sans-serif", fontSize: 14,
              outline: "none", borderRadius: 2,
            }}
          />
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "rgba(200,155,60,0.5)" }}>🔍</span>
        </div>
        {/* Category Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 12, letterSpacing: "0.06em",
              background: cat === c ? "#C89B3C" : "#1A1A1A", color: cat === c ? "#0F0F0F" : "rgba(245,241,234,0.7)",
              border: `1px solid ${cat === c ? "#C89B3C" : "rgba(200,155,60,0.15)"}`,
              padding: "8px 18px", cursor: "pointer", borderRadius: 2, transition: "all 0.2s",
            }}>{c}</button>
          ))}
        </div>
        {/* Results count */}
        <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.4)", fontSize: 13, marginBottom: 28 }}>
          {filtered.length} items {cat !== "All" ? `in ${cat}` : ""}
        </p>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {filtered.map(item => (
            <MenuCard key={item.id} item={{ ...item, emoji: FEATURED_ITEMS.find(f => f.name === item.name)?.emoji || "🍽️" }} addToCart={addToCart} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(245,241,234,0.3)", fontFamily: "'Poppins',sans-serif" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>No items found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GALLERY PAGE ──────────────────────────────────────────────────────────────
function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const cats = ["All", "Food", "Drinks", "Interior", "Birthday", "Couple", "Events"];
  const items = GALLERY_ITEMS.concat(GALLERY_ITEMS).map((g, i) => ({ ...g, id: i }));
  const filtered = filter === "All" ? items : items.filter(g => g.cat === filter);

  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ padding: "60px 5%", textAlign: "center", borderBottom: "1px solid rgba(200,155,60,0.1)", background: "linear-gradient(180deg, #1a0f05 0%, #0F0F0F 100%)" }}>
        <SectionLabel>Visual Stories</SectionLabel>
        <SectionHeading>Gallery</SectionHeading>
        <GoldDivider />
      </div>
      <div style={{ padding: "40px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              fontFamily: "'Poppins',sans-serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
              background: filter === c ? "#C89B3C" : "transparent", color: filter === c ? "#0F0F0F" : "#F5F1EA",
              border: `1px solid ${filter === c ? "#C89B3C" : "rgba(245,241,234,0.2)"}`,
              padding: "8px 18px", cursor: "pointer", borderRadius: 2, transition: "all 0.2s",
            }}>{c}</button>
          ))}
        </div>
        <div style={{ columns: "repeat(auto-fill, minmax(240px, 1fr))", columnGap: 10 }}>
          {filtered.map((item) => (
            <div key={item.id} onClick={() => setLightbox(item)} style={{
              breakInside: "avoid", marginBottom: 10,
              background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.1)",
              height: item.h === "tall" ? 300 : 200,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", position: "relative", transition: "transform 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
            >
              <span style={{ fontSize: 56, marginBottom: 8 }}>{item.emoji}</span>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "rgba(245,241,234,0.5)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{item.label}</p>
              <span style={{ position: "absolute", top: 10, right: 10, background: "#C89B3C", color: "#0F0F0F", fontSize: 10, fontFamily: "'Poppins',sans-serif", fontWeight: 700, padding: "3px 8px", borderRadius: 2 }}>{item.cat}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.3)", padding: "60px 80px", textAlign: "center", maxWidth: 480 }}>
            <span style={{ fontSize: 100 }}>{lightbox.emoji}</span>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 24, marginTop: 20 }}>{lightbox.label}</h3>
            <p style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{lightbox.cat}</p>
            <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.4)", fontSize: 12, marginTop: 24 }}>Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────
function AboutPage() {
  const team = [
    { name: "Rahul Sharma", role: "Founder & Head Chef", init: "RS" },
    { name: "Priya Mehta", role: "Co-Founder & Creative Director", init: "PM" },
    { name: "Aditya Singh", role: "Barista Champion", init: "AS" },
    { name: "Neha Gupta", role: "Guest Experience Manager", init: "NG" },
  ];
  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ padding: "60px 5%", textAlign: "center", borderBottom: "1px solid rgba(200,155,60,0.1)", background: "linear-gradient(180deg, #1a0f05 0%, #0F0F0F 100%)" }}>
        <SectionLabel>Our Story</SectionLabel>
        <SectionHeading>About Kanpur Café</SectionHeading>
        <GoldDivider />
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 5%" }}>
        {/* Story */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 60, marginBottom: 100 }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#C89B3C", fontSize: 28, marginBottom: 20 }}>Our Story</h3>
              <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.7)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: 16 }}>
                Founded in 2019, Kanpur Café was born from a simple yet powerful dream — to create a space where Kanpur's vibrant youth could come together, share stories, and make memories over exceptional food and coffee.
              </p>
              <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.7)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                What started as a small coffee shop has grown into Kanpur's most beloved café destination, with over 10,000 happy customers and counting. Every dish, every corner, every experience is designed to make you feel something special.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "🎯", title: "Our Mission", desc: "To craft extraordinary experiences through exceptional food, warm hospitality, and spaces that inspire connection." },
                { icon: "🌟", title: "Our Vision", desc: "To become India's most loved café brand — one city, one cup, one unforgettable memory at a time." },
                { icon: "💫", title: "Our Values", desc: "Quality, Authenticity, Community, Innovation, and an unwavering commitment to our guests' happiness." },
              ].map((v, i) => (
                <div key={i} style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", padding: "24px", display: "flex", gap: 16, borderRadius: 4 }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{v.icon}</span>
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 16, marginBottom: 6 }}>{v.title}</h4>
                    <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.55)", fontSize: 13, lineHeight: 1.6 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal>
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 28, marginBottom: 40, textAlign: "center" }}>Our Journey</h3>
          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto 100px" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, #C89B3C 0%, rgba(200,155,60,0.1) 100%)", transform: "translateX(-50%)" }} />
            {[
              { year: "2019", title: "Founded", desc: "Kanpur Café opens its doors with 30 seats and a dream" },
              { year: "2020", title: "1,000 Customers", desc: "Despite challenges, we reached our first milestone" },
              { year: "2021", title: "Menu Expansion", desc: "Added full food menu & expanded to 70 seats" },
              { year: "2022", title: "Best Café Award", desc: "Kanpur's Best New Café by local food critics" },
              { year: "2023", title: "Digital Presence", desc: "50K+ Instagram followers; viral Honey Chilli Potato" },
              { year: "2024", title: "10,000 Guests", desc: "We reached 10,000 happy customers!" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end", marginBottom: 32, position: "relative" }}>
                <div style={{ width: "44%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", padding: "20px 24px", borderRadius: 4 }}>
                  <span style={{ color: "#C89B3C", fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>{item.year}</span>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 15, marginTop: 4 }}>{item.title}</h4>
                  <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <div style={{ position: "absolute", left: "50%", top: 20, width: 14, height: 14, background: "#C89B3C", borderRadius: "50%", transform: "translateX(-50%)", border: "3px solid #0F0F0F" }} />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24, marginBottom: 100 }}>
            {[["10,000+", "Happy Customers"], ["5,000+", "Reservations"], ["4.8 ★", "Google Rating"], ["50+", "Menu Items"]].map(([n, l]) => (
              <div key={l} style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", padding: "40px 24px", textAlign: "center", borderRadius: 4 }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 700, color: "#C89B3C" }}>{n}</p>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "rgba(245,241,234,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>{l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Team */}
        <Reveal>
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 28, marginBottom: 40, textAlign: "center" }}>Meet Our Team</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 24 }}>
            {team.map((m, i) => (
              <div key={i} style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.12)", padding: "36px 24px", textAlign: "center", borderRadius: 4, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#C89B3C"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(200,155,60,0.12)"}
              >
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#C89B3C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22, color: "#0F0F0F", margin: "0 auto 16px" }}>{m.init}</div>
                <h4 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 17 }}>{m.name}</h4>
                <p style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.06em", marginTop: 6 }}>{m.role}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const hours = [
    ["Monday – Friday", "10:00 AM – 11:00 PM"],
    ["Saturday", "9:00 AM – 11:30 PM"],
    ["Sunday", "9:00 AM – 10:30 PM"],
  ];
  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ padding: "60px 5%", textAlign: "center", borderBottom: "1px solid rgba(200,155,60,0.1)", background: "linear-gradient(180deg, #1a0f05 0%, #0F0F0F 100%)" }}>
        <SectionLabel>Find Us</SectionLabel>
        <SectionHeading>Get In Touch</SectionHeading>
        <GoldDivider />
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 60 }}>
          {/* Info */}
          <div>
            <Reveal>
              <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 22, marginBottom: 24 }}>Visit Us</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <a href="tel:+919876543210" style={{ display: "flex", gap: 16, alignItems: "flex-start", textDecoration: "none" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>📞</span>
                    <div>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Call Us</p>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 15 }}>+91 98765 43210</p>
                    </div>
                  </a>
                  <a href="https://wa.me/919876543210" style={{ display: "flex", gap: 16, alignItems: "flex-start", textDecoration: "none" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>💬</span>
                    <div>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>WhatsApp</p>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 15 }}>Chat With Us</p>
                    </div>
                  </a>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>📍</span>
                    <div>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Address</p>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 14, lineHeight: 1.6 }}>Near Mall Road, Civil Lines<br />Kanpur, Uttar Pradesh 208001</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>✉️</span>
                    <div>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Email</p>
                      <p style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 14 }}>hello@kanpurcafe.com</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hours */}
              <div style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", padding: "28px", borderRadius: 4 }}>
                <h4 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 18, marginBottom: 20 }}>Opening Hours</h4>
                {hours.map(([d, t]) => (
                  <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(200,155,60,0.08)" }}>
                    <span style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.6)", fontSize: 13 }}>{d}</span>
                    <span style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 13, fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
              {/* Socials */}
              <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
                {["📸 Instagram", "📘 Facebook", "🐦 Twitter"].map(s => (
                  <button key={s} style={{
                    fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "rgba(245,241,234,0.6)",
                    background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", padding: "8px 14px",
                    cursor: "pointer", borderRadius: 2, transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#C89B3C"; e.currentTarget.style.color = "#C89B3C"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,155,60,0.15)"; e.currentTarget.style.color = "rgba(245,241,234,0.6)"; }}
                  >{s}</button>
                ))}
              </div>
            </Reveal>
          </div>
          {/* Form */}
          <Reveal delay={200}>
            <div style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", padding: "40px", borderRadius: 4 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 24, marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.6)", fontSize: 14 }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 22, marginBottom: 28 }}>Send Us a Message</h3>
                  {["name", "email"].map(field => (
                    <div key={field} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{field}</label>
                      <input type={field === "email" ? "email" : "text"} value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        style={{ width: "100%", background: "#0F0F0F", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "12px 16px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2, boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Message</label>
                    <textarea value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))} rows={5}
                      style={{ width: "100%", background: "#0F0F0F", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "12px 16px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", resize: "vertical", borderRadius: 2, boxSizing: "border-box" }} />
                  </div>
                  <button onClick={() => setSent(true)} style={{
                    width: "100%", background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "16px",
                    fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", cursor: "pointer", transition: "opacity 0.2s",
                  }}>Send Message →</button>
                </>
              )}
            </div>
            {/* Map placeholder */}
            <div style={{ marginTop: 20, background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.15)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 40 }}>🗺️</span>
              <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13 }}>Civil Lines, Kanpur</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{
                fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "#C89B3C", border: "1px solid #C89B3C",
                padding: "7px 18px", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Open in Maps ↗</a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

// ── RESERVATION PAGE ──────────────────────────────────────────────────────────
function ReservationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "", guests: "2", seating: "Indoor", special: "" });
  const times = ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const saveReservation = async () => {
    try {
      const { error } = await supabase.from("reservations").insert([
        {
          name: form.name,
          phone: form.phone,
          email: form.email,
          reservation_date: form.date,
          reservation_time: form.time,
          guests: parseInt(form.guests),
        },
      ]);

      if (error) {
        console.error(error);
        alert("Reservation save failed");
        return;
      }

      await emailjs.send(
        "service_bcmk4ol",
        "template_1w0mqza",
        {
          name: form.name,
          phone: form.phone,
          email: form.email,
          date: form.date,
          time: form.time,
          guests: form.guests,
          seating: form.seating,
          special: form.special || "None",
        },
        {
          publicKey: "_hrbqtl462n0KvsAU",
        },
      );

      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (step === 3) return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "0 5%", maxWidth: 520 }}>
        <div style={{ fontSize: 80, marginBottom: 24, animation: "pulse 1s ease" }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: "2.2rem", marginBottom: 16 }}>Table Reserved!</h2>
        <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.65)", lineHeight: 1.7, marginBottom: 32 }}>
          Your table is confirmed, <strong style={{ color: "#C89B3C" }}>{form.name}</strong>! We've sent details to <strong style={{ color: "#C89B3C" }}>{form.email}</strong>.
        </p>
        <div style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.3)", padding: "28px", marginBottom: 32, textAlign: "left", borderRadius: 4 }}>
          {[["👤 Name", form.name], ["📅 Date", form.date], ["⏰ Time", form.time], ["👥 Guests", `${form.guests} people`], ["🪑 Seating", form.seating]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(200,155,60,0.08)" }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13 }}>{l}</span>
              <span style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 13, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13 }}>
          📞 Need to modify? Call us at +91 98765 43210
        </p>
        <style>{`@keyframes pulse{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ padding: "60px 5%", textAlign: "center", borderBottom: "1px solid rgba(200,155,60,0.1)", background: "linear-gradient(180deg, #1a0f05 0%, #0F0F0F 100%)" }}>
        <SectionLabel>Secure Your Spot</SectionLabel>
        <SectionHeading>Reserve a Table</SectionHeading>
        <GoldDivider />
      </div>
      <div style={{ maxWidth: 640, margin: "60px auto", padding: "0 5%" }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          {[1, 2].map((s, i) => (
            <>
              <div key={s} style={{
                width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: step >= s ? "#C89B3C" : "#1A1A1A", border: `1px solid ${step >= s ? "#C89B3C" : "rgba(200,155,60,0.2)"}`,
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: step >= s ? "#0F0F0F" : "rgba(245,241,234,0.4)",
              }}>{s}</div>
              {i < 1 && <div style={{ flex: 1, height: 1, background: step > 1 ? "#C89B3C" : "rgba(200,155,60,0.2)", margin: "0 12px" }} />}
            </>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 22, marginBottom: 32 }}>Your Details</h3>
            {[["Your Name", "name", "text"], ["Mobile Number", "phone", "tel"], ["Email Address", "email", "email"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                  style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "14px 18px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2, boxSizing: "border-box" }} />
              </div>
            ))}
            <button onClick={() => setStep(2)} disabled={!form.name || !form.phone} style={{
              width: "100%", background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "16px",
              fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", cursor: form.name && form.phone ? "pointer" : "not-allowed", opacity: form.name && form.phone ? 1 : 0.5,
            }}>Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 22, marginBottom: 32 }}>Booking Details</h3>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} min={new Date().toISOString().split("T")[0]}
                style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "14px 18px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Time</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {times.map(t => (
                  <button key={t} onClick={() => set("time", t)} style={{
                    background: form.time === t ? "#C89B3C" : "#1A1A1A", color: form.time === t ? "#0F0F0F" : "#F5F1EA",
                    border: `1px solid ${form.time === t ? "#C89B3C" : "rgba(200,155,60,0.15)"}`,
                    padding: "9px 4px", fontFamily: "'Poppins',sans-serif", fontSize: 12, cursor: "pointer", borderRadius: 2,
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Guests</label>
                <select value={form.guests} onChange={e => set("guests", e.target.value)} style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "14px 18px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2 }}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "8+"].map(n => <option key={n} value={n}>{n} {n === "1" ? "Person" : "People"}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Seating</label>
                <select value={form.seating} onChange={e => set("seating", e.target.value)} style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "14px 18px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2 }}>
                  {["Indoor", "Window Side", "Couple Corner", "Party Section", "Outdoor"].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C89B3C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Special Instructions</label>
              <textarea value={form.special} onChange={e => set("special", e.target.value)} rows={3} placeholder="Birthday setup, dietary needs, etc."
                style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "14px 18px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", resize: "vertical", borderRadius: 2, boxSizing: "border-box" }} />
            </div>

<div style={{ display: "flex", gap: 12 }}>
<button
  onClick={() => setStep(1)}
  style={{
    flex: 1,
    background: "transparent",
    color: "#F5F1EA",
    border: "1px solid rgba(245,241,234,0.2)",
    padding: "16px",
    fontFamily: "'Poppins',sans-serif",
    fontSize: 13,
    cursor: "pointer",
    borderRadius: 2
  }}
>
  ← Back
</button>

<button
  onClick={saveReservation}
  disabled={!form.date || !form.time}
  style={{
    flex: 2,
    background: "#C89B3C",
    color: "#0F0F0F",
    border: "none",
    padding: "16px",
    fontFamily: "'Poppins',sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: form.date && form.time ? "pointer" : "not-allowed",
    opacity: form.date && form.time ? 1 : 0.5,
    borderRadius: 2
  }}
>
  Confirm Reservation ✓
</button>
</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ORDER PAGE ────────────────────────────────────────────────────────────────
function OrderPage({ cart, setCart }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);

  const cats = ["All", ...Object.keys(MENU_DATA)];
  const allItems = Object.entries(MENU_DATA).flatMap(([c, items]) => items.map(i => ({ ...i, cat: c })));
  const filtered = allItems.filter(i => (cat === "All" || i.cat === cat) && (!search || i.name.toLowerCase().includes(search.toLowerCase())));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = total >= 500 ? 0 : 40;
  const gst = Math.round(total * 0.05);
  const discount = promoApplied ? Math.round(total * 0.1) : 0;
  const grand = total + delivery + gst - discount;

  const addItem = (item) => {
    setCart(c => {
      const ex = c.find(x => x.id === item.id);
      if (ex) return c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...item, qty: 1 }];
    });
  };
  const removeItem = (id) => setCart(c => c.map(x => x.id === id ? { ...x, qty: x.qty - 1 } : x).filter(x => x.qty > 0));

  if (checkoutStep === 2) return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>🎊</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: "2rem", marginBottom: 12 }}>Order Confirmed!</h2>
      <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.6)", marginBottom: 8 }}>Order #KC{Math.floor(Math.random() * 9000 + 1000)}</p>
      <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 14, marginBottom: 32 }}>Estimated delivery: 30–45 minutes</p>
      <button onClick={() => { setCart([]); setCheckoutStep(0); }} style={{ background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "14px 36px", fontFamily: "'Poppins',sans-serif", fontWeight: 700, cursor: "pointer" }}>Order Again</button>
    </div>
  );

  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ padding: "60px 5%", textAlign: "center", borderBottom: "1px solid rgba(200,155,60,0.1)", background: "linear-gradient(180deg, #1a0f05 0%, #0F0F0F 100%)" }}>
        <SectionLabel>Delivered To You</SectionLabel>
        <SectionHeading>Order Online</SectionHeading>
        <GoldDivider />
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 5%", display: "grid", gridTemplateColumns: "1fr 360px", gap: 40 }}>
        {/* Menu */}
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "12px 16px 12px 44px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2, boxSizing: "border-box" }} />
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(200,155,60,0.5)" }}>🔍</span>
            </div>
            <select value={cat} onChange={e => setCat(e.target.value)} style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "12px 16px", fontFamily: "'Poppins',sans-serif", fontSize: 14, outline: "none", borderRadius: 2 }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {filtered.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div key={item.id} style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.12)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: "#0F0F0F" }}>
                    {FEATURED_ITEMS.find(f => f.name === item.name)?.emoji || "🍽️"}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 15, marginBottom: 4 }}>{item.name}</h4>
                    <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.4)", fontSize: 11, marginBottom: 10, lineHeight: 1.5 }}>{item.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Playfair Display',serif", color: "#C89B3C", fontSize: 16, fontWeight: 700 }}>₹{item.price}</span>
                      {inCart ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => removeItem(item.id)} style={{ width: 28, height: 28, background: "#C89B3C", color: "#0F0F0F", border: "none", cursor: "pointer", fontWeight: 700, borderRadius: 2 }}>−</button>
                          <span style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{inCart.qty}</span>
                          <button onClick={() => addItem(item)} style={{ width: 28, height: 28, background: "#C89B3C", color: "#0F0F0F", border: "none", cursor: "pointer", fontWeight: 700, borderRadius: 2 }}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => addItem(item)} style={{ background: "transparent", color: "#C89B3C", border: "1px solid #C89B3C", padding: "6px 14px", fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 600, textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Add</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div style={{ position: "sticky", top: 90, height: "fit-content" }}>
          <div style={{ background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.2)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(200,155,60,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 18 }}>Your Cart</h3>
              <span style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 13 }}>{cart.reduce((s, i) => s + i.qty, 0)} items</span>
            </div>
            {cart.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
                <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.4)", fontSize: 13 }}>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ padding: "16px 24px", maxHeight: 280, overflowY: "auto" }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(200,155,60,0.06)" }}>
                      <div>
                        <p style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 13, marginBottom: 2 }}>{item.name}</p>
                        <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.4)", fontSize: 11 }}>₹{item.price} × {item.qty}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => removeItem(item.id)} style={{ width: 24, height: 24, background: "#0F0F0F", color: "#C89B3C", border: "1px solid rgba(200,155,60,0.2)", cursor: "pointer", fontSize: 14, borderRadius: 2 }}>−</button>
                        <span style={{ fontFamily: "'Poppins',sans-serif", color: "#F5F1EA", fontSize: 13, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => addItem(item)} style={{ width: 24, height: 24, background: "#0F0F0F", color: "#C89B3C", border: "1px solid rgba(200,155,60,0.2)", cursor: "pointer", fontSize: 14, borderRadius: 2 }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Promo */}
                <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(200,155,60,0.1)" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={promo} onChange={e => setPromo(e.target.value.toUpperCase())} placeholder="Promo code"
                      style={{ flex: 1, background: "#0F0F0F", border: "1px solid rgba(200,155,60,0.2)", color: "#F5F1EA", padding: "9px 12px", fontFamily: "'Poppins',sans-serif", fontSize: 12, outline: "none", borderRadius: 2 }} />
                    <button onClick={() => { if (promo === "KANPUR10") setPromoApplied(true); }} style={{ background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "9px 14px", fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 2 }}>Apply</button>
                  </div>
                  {promoApplied && <p style={{ fontFamily: "'Poppins',sans-serif", color: "#4ade80", fontSize: 11, marginTop: 6 }}>✓ KANPUR10 applied – 10% off!</p>}
                  <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.3)", fontSize: 10, marginTop: 6 }}>Try: KANPUR10</p>
                </div>
                {/* Bill */}
                <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(200,155,60,0.1)" }}>
                  {[["Subtotal", `₹${total}`], ["Delivery", delivery === 0 ? "FREE" : `₹${delivery}`], ["GST (5%)", `₹${gst}`], ...(promoApplied ? [["Discount", `-₹${discount}`]] : [])].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                      <span style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13 }}>{l}</span>
                      <span style={{ fontFamily: "'Poppins',sans-serif", color: l === "Discount" ? "#4ade80" : l === "Delivery" && delivery === 0 ? "#4ade80" : "#F5F1EA", fontSize: 13 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", borderTop: "1px solid rgba(200,155,60,0.15)", marginTop: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", color: "#F5F1EA", fontSize: 16, fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", color: "#C89B3C", fontSize: 16, fontWeight: 700 }}>₹{grand}</span>
                  </div>
                </div>
                <div style={{ padding: "0 24px 24px" }}>
                  <button onClick={() => setCheckoutStep(c => c + 1)} style={{
                    width: "100%", background: "#C89B3C", color: "#0F0F0F", border: "none", padding: "15px",
                    fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer", borderRadius: 2,
                  }}>
                    {checkoutStep === 0 ? "Proceed to Checkout →" : "Pay ₹" + grand + " →"}
                  </button>
                  {delivery > 0 && <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.3)", fontSize: 11, marginTop: 8, textAlign: "center" }}>Add ₹{500 - total} more for free delivery</p>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#0A0A0A", borderTop: "1px solid rgba(200,155,60,0.12)", padding: "60px 5% 100px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#C89B3C", marginBottom: 16 }}>
              KANPUR <span style={{ color: "#F5F1EA" }}>CAFÉ</span>
            </div>
            <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13, lineHeight: 1.7 }}>
              Where Great Food Meets Great Conversations. Kanpur's most loved café since 2019.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["📸", "📘", "🐦", "▶️"].map((icon, i) => (
                <button key={i} style={{ width: 36, height: 36, border: "1px solid rgba(200,155,60,0.2)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, borderRadius: 2, transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#C89B3C"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(200,155,60,0.2)"}
                >{icon}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Quick Links</h4>
            {["Home", "Menu", "Gallery", "About", "Contact", "Reserve"].map(l => (
              <button key={l} onClick={() => setPage(l.toLowerCase())} style={{ display: "block", fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13, background: "none", border: "none", cursor: "pointer", marginBottom: 10, padding: 0, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#C89B3C"}
                onMouseLeave={e => e.target.style.color = "rgba(245,241,234,0.5)"}
              >{l}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Hours</h4>
            {[["Mon–Fri", "10AM – 11PM"], ["Saturday", "9AM – 11:30PM"], ["Sunday", "9AM – 10:30PM"]].map(([d, t]) => (
              <div key={d} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13 }}>{d}</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 13 }}>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", color: "#C89B3C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Contact</h4>
            <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.5)", fontSize: 13, lineHeight: 1.7 }}>
              Civil Lines, Kanpur<br />Uttar Pradesh 208001<br /><br />
              <span style={{ color: "#C89B3C" }}>+91 98765 43210</span><br />
              hello@kanpurcafe.com
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(200,155,60,0.1)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.3)", fontSize: 12 }}>© 2024 Kanpur Café. All rights reserved.</p>
          <p style={{ fontFamily: "'Poppins',sans-serif", color: "rgba(245,241,234,0.3)", fontSize: 12 }}>Crafted with ❤️ for Kanpur</p>
        </div>
      </div>
    </footer>
  );
}

// ── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProg(progress);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return <div style={{ position: "fixed", top: 0, left: 0, width: `${prog}%`, height: 2, background: "linear-gradient(90deg, #C89B3C, #f0c96a)", zIndex: 9999, transition: "width 0.1s" }} />;
}

// ── Back to Top ───────────────────────────────────────────────────────────────
function BackToTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!vis) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
      position: "fixed", bottom: 140, right: 20, zIndex: 990,
      width: 44, height: 44, background: "#1A1A1A", border: "1px solid rgba(200,155,60,0.3)",
      color: "#C89B3C", fontSize: 18, cursor: "pointer", borderRadius: 2,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#C89B3C"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(200,155,60,0.3)"}
    >↑</button>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((item) => {
    setCart(c => {
      const ex = c.find(x => x.id === item.id);
      if (ex) return c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...item, qty: 1 }];
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div style={{ fontFamily: "'Poppins',sans-serif", background: "#0F0F0F", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0F0F0F; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) sepia(1) saturate(2) hue-rotate(340deg); }
        select option { background: #1A1A1A; color: #F5F1EA; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0F0F0F; } ::-webkit-scrollbar-thumb { background: #C89B3C; border-radius: 3px; }
        .hidden { display: none; }
        @media (min-width: 768px) { .hidden { display: flex; } .md\\:flex { display: flex; } .md\\:hidden { display: none !important; } }
      `}</style>
      <ScrollProgress />
      <Navbar page={page} setPage={setPage} cartCount={cartCount} />
      <main style={{ paddingBottom: page !== "home" ? 0 : 0 }}>
        {page === "home" && <HomePage setPage={setPage} addToCart={addToCart} />}
        {page === "menu" && <MenuPage addToCart={addToCart} />}
        {page === "gallery" && <GalleryPage />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
        {page === "reserve" && <ReservationPage />}
        {page === "order" && <OrderPage cart={cart} setCart={setCart} />}
      </main>
      {page !== "order" && <Footer setPage={setPage} />}
      <BackToTop />
    </div>
  );
}
