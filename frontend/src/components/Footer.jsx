
const cols = [
  {
    title: "Explore",
    links: ["Home", "Packages", "Thalis", "Menu", "Stories"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Kitchen", "Careers", "Press", "Blog"],
  },
  {
    title: "Help",
    links: ["Contact", "FAQs", "Delivery Areas", "Refund Policy", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 pt-24 pb-10 px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,var(--primary),var(--gold),var(--primary),transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--primary)_8%,transparent))]" />

      <div className="mx-auto max-w-7xl">
        {/* CTA */}
        <div className="relative rounded-[2rem] p-10 md:p-14 mb-20 overflow-hidden bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] shadow-[0_50px_120px_-30px_color-mix(in_oklab,var(--primary)_60%,transparent)]">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/40 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="relative grid md:grid-cols-2 gap-8 items-center text-primary-foreground">
            <div>
              <h3 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                Hungry already?<br />
                <span className="shimmer-text">Let's plate it up.</span>
              </h3>
              <p className="mt-4 text-primary-foreground/85 max-w-md">
                First order ke saath ek free dessert — bas WhatsApp pe 'HELLO' bhejo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              {/* <Spicy3DButton variant="ghost" className="!bg-white !text-primary !border-white">
                📞 Call Us
              </Spicy3DButton>
              <Spicy3DButton className="!bg-foreground !shadow-none">
                Order on WhatsApp →
              </Spicy3DButton> */}
            </div>
          </div>
        </div>

        {/* main grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] grid place-items-center text-primary-foreground text-xl shadow-lg [transform:perspective(400px)_rotateY(-15deg)]">
                🍲
              </div>
              <div>
                <div className="font-display text-xl font-bold">Rasoi Royale</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold">
                  Est. 2021
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Bringing royal flavors of India to your everyday table — one steaming thali at a time.
            </p>
            <div className="flex gap-3 mt-5">
              {["📷", "🐦", "📘", "▶️"].map((i, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-card border border-border grid place-items-center text-lg hover:bg-primary hover:text-primary-foreground hover:[transform:perspective(400px)_rotateY(20deg)_translateY(-3px)] transition-all duration-300"
                >
                  {i}
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-lg font-bold mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-3 pt-8 border-t border-border text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Rasoi Royale. Cooked with ♥ in India.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
