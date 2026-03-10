"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

/* ─────────────────── Intersection Observer Hook ─────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─────────────────── Waitlist Form Component ─────────────────── */
function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "bottom" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-warm/10 border border-warm/20">
        <svg className="w-5 h-5 text-warm flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-warm text-sm">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 ${variant === "hero" ? "flex-col sm:flex-row" : "flex-col sm:flex-row max-w-lg mx-auto"}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@practice.com"
        required
        className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder:text-neutral-500 text-sm transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 bg-warm hover:bg-warm-dark text-background font-medium rounded-lg text-sm transition-all disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "Joining..." : "Join Waitlist"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-xs sm:absolute sm:bottom-[-24px]">{message}</p>
      )}
    </form>
  );
}

/* ─────────────────── Section Components ─────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="logo-text text-xl">
          <span className="zhen text-gradient-warm">Zhen</span>
          <span className="text-neutral-400">AI</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#ai" className="hover:text-foreground transition-colors">AI</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#waitlist" className="px-4 py-2 bg-warm/10 text-warm border border-warm/20 rounded-lg hover:bg-warm/20 transition-all">
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-warm/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm/10 border border-warm/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-warm animate-pulse_slow" />
            <span className="text-warm text-xs font-medium tracking-wide uppercase">Early Access Coming Soon</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
            Your practice runs on
            <br />
            <span className="text-gradient-warm">ancient wisdom.</span>
            <br />
            Your software should too.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-neutral-400 max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            AI-powered practice management built by an acupuncturist with 15 years at the table. Tongue diagnosis. Herbal prescribing. Pattern synthesis. Finally, software that speaks TCM.
          </p>

          {/* Waitlist */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <WaitlistForm variant="hero" />
            <p className="text-neutral-500 text-xs mt-3">No spam. Just early access and occasional updates.</p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block w-[400px] h-[500px]">
          <div className="relative w-full h-full">
            {/* Mockup card */}
            <div className="absolute inset-0 rounded-2xl bg-surface border border-border overflow-hidden glow-warm">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-xs text-neutral-500 font-mono">deqi — patient view</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center text-warm text-sm">患</div>
                  <div>
                    <div className="text-sm font-medium">Chen Wei</div>
                    <div className="text-xs text-neutral-500">Liver Qi Stagnation · 3rd visit</div>
                  </div>
                </div>
                <div className="section-divider" />
                <div className="space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">AI Pattern Analysis</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Liver Qi Stagnation", "Spleen Qi Deficiency", "Blood Stasis"].map((p) => (
                      <span key={p} className="px-2 py-1 rounded text-xs bg-cyan/10 text-cyan border border-cyan/20">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Tongue Analysis</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-10 rounded bg-gradient-to-br from-red-900/40 to-purple-900/30 border border-border flex items-center justify-center">
                      <span className="text-[10px] text-neutral-400">IMG</span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Pale body, thin white coat<br />
                      <span className="text-cyan">87% confidence</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Suggested Points</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["LR3", "LI4", "SP6", "ST36", "PC6", "GB34"].map((p) => (
                      <span key={p} className="px-2 py-1 rounded text-xs bg-warm/10 text-warm border border-warm/20">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Herbal Formula</div>
                  <div className="text-xs text-neutral-300">Xiao Yao San (modified)</div>
                  <div className="text-[11px] text-neutral-500">Chai Hu 9g · Bai Shao 12g · Dang Gui 9g · Bai Zhu 9g...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const ref = useReveal();

  return (
    <section className="py-24 md:py-32">
      <div className="section-divider max-w-6xl mx-auto mb-24" />
      <div ref={ref} className="reveal max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Generic EHR software.<br />
          <span className="text-neutral-500">Built for Western medicine.</span><br />
          <span className="text-neutral-500">Shoehorned into your practice.</span>
        </h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-12">
          You studied pulse diagnosis for years. Your software doesn&apos;t even have a field for it.
          You think in patterns and elements. Your EHR thinks in ICD-10 codes.
          Enough.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { icon: "⊘", title: "No tongue diagnosis", desc: "Your most powerful diagnostic tool, completely ignored" },
            { icon: "⊘", title: "No pattern differentiation", desc: "Forced into Western diagnostic boxes that don't fit" },
            { icon: "⊘", title: "No herbal support", desc: "Prescribing formulas in the margins of a notes field" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl bg-surface border border-border">
              <div className="text-red-400/70 text-2xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const ref = useReveal();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "SOAP Notes from Audio",
      desc: "Record the consult. Get structured notes. TCM terminology auto-detected.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      ),
      title: "AI Pattern Synthesis",
      desc: "Intake data → pattern differentiation. Cross-referenced with classical texts.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.72.608 5.18 1.64" />
        </svg>
      ),
      title: "Trigger Point Mapping",
      desc: "Visual body maps. Point selection. Treatment protocols tracked across visits.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      title: "Patient Portal",
      desc: "Intake forms. Treatment summaries. Herbal instructions. All patient-facing.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      title: "Scheduling & Billing",
      desc: "Book. Bill. Get paid. Insurance codes mapped to TCM diagnoses automatically.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: "AI Herbal Prescriber",
      desc: "Formula suggestions based on pattern. Modifications. Dosing. Interactions flagged.",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="section-divider max-w-6xl mx-auto mb-24" />
      <div ref={ref} className="reveal max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything your practice needs.
            <br />
            <span className="text-gradient-warm">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-neutral-400 text-lg">Purpose-built for TCM. Not adapted. Not retrofitted. Built.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger visible">
          {features.map((f) => (
            <div key={f.title} className="feature-card p-6 rounded-xl bg-surface border border-border group">
              <div className="w-10 h-10 rounded-lg bg-warm/10 flex items-center justify-center text-warm mb-4 group-hover:bg-warm/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIShowcase() {
  const ref = useReveal();

  const capabilities = [
    {
      tag: "VISION AI",
      title: "Tongue Diagnosis",
      desc: "Upload a photo. Get an AI-assisted analysis — body color, coat, shape, moisture, sublingual veins. Mapped to patterns. Tracked over time.",
      visual: (
        <div className="relative">
          <div className="w-full h-32 rounded-lg bg-gradient-to-br from-red-950/50 to-purple-950/30 border border-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-1">👅</div>
              <div className="text-[10px] text-neutral-500 font-mono">analyzing...</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Body Color</span>
              <span className="text-cyan">Pale-red</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Coating</span>
              <span className="text-cyan">Thin white</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Shape</span>
              <span className="text-cyan">Slightly swollen, tooth marks</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: "FORMULA ENGINE",
      title: "Herbal Prescriber",
      desc: "Pattern in → formula out. Base formulas from classical texts. AI-suggested modifications based on presentation. Dosage calculations. Herb-drug interaction alerts.",
      visual: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-warm/10 text-warm border border-warm/20">Liver Qi Stagnation</span>
            <span className="text-neutral-600">→</span>
          </div>
          <div className="p-3 rounded-lg bg-background/50 border border-border">
            <div className="text-xs font-medium text-warm mb-2">Xiao Yao San (逍遥散)</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-neutral-400">
              <span>Chai Hu 柴胡 9g</span>
              <span>Dang Gui 当归 9g</span>
              <span>Bai Shao 白芍 12g</span>
              <span>Bai Zhu 白术 9g</span>
              <span>Fu Ling 茯苓 12g</span>
              <span>Gan Cao 甘草 3g</span>
            </div>
          </div>
          <div className="text-[10px] text-cyan">+ Bo He 3g, Sheng Jiang 3pc (modifications)</div>
        </div>
      ),
    },
    {
      tag: "PATTERN AI",
      title: "Pattern Synthesis",
      desc: "Symptoms, tongue, pulse, history — all synthesized into differentiation. Primary and secondary patterns identified. Confidence scores. Classical references.",
      visual: (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {["Irritability", "Rib-side pain", "Wiry pulse", "Pale tongue", "Sighing", "PMS"].map((s) => (
              <span key={s} className="px-2 py-1 rounded bg-surface-light border border-border text-neutral-400 text-center">{s}</span>
            ))}
          </div>
          <div className="flex items-center justify-center py-2">
            <svg className="w-4 h-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="p-2 rounded-lg border border-cyan/20 bg-cyan/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cyan">Liver Qi Stagnation</span>
              <span className="text-[10px] text-cyan/70">94%</span>
            </div>
          </div>
          <div className="p-2 rounded-lg border border-border bg-surface-light">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Spleen Qi Deficiency</span>
              <span className="text-[10px] text-neutral-500">71%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: "AUDIO AI",
      title: "Consult Transcription",
      desc: "Hit record during intake. AI transcribes and structures into SOAP format. Chief complaint extraction. TCM terminology auto-tagged.",
      visual: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse_slow" />
            <span className="text-[11px] text-neutral-400 font-mono">Recording — 04:32</span>
          </div>
          <div className="space-y-1.5">
            {[
              { label: "S", text: "Bilateral rib-side pain, worse with stress..." },
              { label: "O", text: "Wiry pulse, pale-red tongue, thin white coat" },
              { label: "A", text: "Liver Qi Stagnation w/ Spleen Qi Def" },
              { label: "P", text: "LR3, LI4, SP6, ST36 · Xiao Yao San mod" },
            ].map((line) => (
              <div key={line.label} className="flex gap-2 text-[11px]">
                <span className="w-4 h-4 rounded flex-shrink-0 bg-warm/10 text-warm flex items-center justify-center text-[10px] font-bold">{line.label}</span>
                <span className="text-neutral-400">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="ai" className="py-24 md:py-32">
      <div className="section-divider max-w-6xl mx-auto mb-24" />
      <div ref={ref} className="reveal max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 mb-6">
            <span className="text-cyan text-xs font-medium tracking-wide uppercase">AI-Powered</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Intelligence that understands
            <br />
            <span className="text-gradient-cyan">your medicine.</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">Not generic AI bolted on. Models trained on TCM texts, clinical patterns, and real practitioner workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilities.map((c) => (
            <div key={c.title} className="ai-card p-6 rounded-xl bg-surface border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] text-cyan font-mono tracking-wider">{c.tag}</span>
                  <h3 className="text-lg font-semibold mt-1">{c.title}</h3>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mb-5 leading-relaxed">{c.desc}</p>
              {c.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const ref = useReveal();

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Get started. See what TCM-native software feels like.",
      features: [
        "5 active patients",
        "Basic charting",
        "Appointment scheduling",
        "Limited AI (10 queries/mo)",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "/mo",
      desc: "For the solo practitioner ready to level up.",
      features: [
        "Unlimited patients",
        "Full AI suite",
        "Tongue diagnosis AI",
        "Herbal prescriber",
        "Audio → SOAP notes",
        "Pattern synthesis",
        "Patient portal",
        "Billing & insurance",
        "Priority support",
      ],
      cta: "Join Waitlist",
      popular: true,
    },
    {
      name: "Clinic",
      price: "$99",
      period: "/mo",
      desc: "Multi-practitioner. Full analytics. Total control.",
      features: [
        "Everything in Pro",
        "Up to 10 practitioners",
        "Clinic analytics dashboard",
        "Role-based access",
        "Custom intake forms",
        "API access",
        "Dedicated support",
      ],
      cta: "Join Waitlist",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="section-divider max-w-6xl mx-auto mb-24" />
      <div ref={ref} className="reveal max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple pricing.
            <br />
            <span className="text-gradient-warm">No acupuncture puns.</span>
          </h2>
          <p className="text-neutral-400 text-lg">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card rounded-xl p-6 border ${
                tier.popular
                  ? "pricing-popular bg-surface relative"
                  : "bg-surface border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-warm text-background text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-neutral-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">{tier.desc}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                    <svg className="w-4 h-4 text-warm flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`block w-full py-3 text-center rounded-lg text-sm font-medium transition-all ${
                  tier.popular
                    ? "bg-warm text-background hover:bg-warm-dark"
                    : "bg-surface-light border border-border text-neutral-300 hover:border-warm/30 hover:text-warm"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founder() {
  const ref = useReveal();

  return (
    <section className="py-24 md:py-32">
      <div className="section-divider max-w-6xl mx-auto mb-24" />
      <div ref={ref} className="reveal max-w-4xl mx-auto px-6">
        <div className="relative p-8 md:p-12 rounded-2xl bg-surface border border-border overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-warm/5 rounded-full blur-[80px]" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-warm/20 flex items-center justify-center text-warm text-lg font-bold">
                针
              </div>
              <div>
                <div className="text-xs text-warm font-mono tracking-wider uppercase">From the Founder</div>
              </div>
            </div>

            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
              &ldquo;I spent 15 years at the treatment table. Every piece of practice software I used was built for a different kind of medicine. So I built my own.&rdquo;
            </blockquote>

            <p className="text-neutral-400 leading-relaxed mb-4">
              DeQi isn&apos;t a generic EHR with a TCM skin. Every feature — from tongue diagnosis to pattern synthesis to herbal prescribing — was designed by someone who&apos;s actually palpated a wiry pulse and debated whether it&apos;s Liver Qi Stagnation or Liver Fire Rising.
            </p>

            <p className="text-neutral-400 leading-relaxed">
              Built by a practitioner, for practitioners. 15 years of clinical acupuncture experience went into every feature. This is the software I wished existed when I was in practice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistCTA() {
  const ref = useReveal();

  return (
    <section id="waitlist" className="py-24 md:py-32">
      <div className="section-divider max-w-6xl mx-auto mb-24" />
      <div ref={ref} className="reveal max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Join the waitlist.
          <br />
          <span className="text-gradient-warm">Get early access.</span>
        </h2>
        <p className="text-neutral-400 text-lg mb-10">
          We&apos;re opening early access in waves. First in line, first to practice with AI.
        </p>
        <WaitlistForm variant="bottom" />
        <p className="text-neutral-600 text-xs mt-4">No credit card required. No spam. Just early access.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <a href="#" className="logo-text text-lg">
              <span className="zhen text-gradient-warm">Zhen</span>
              <span className="text-neutral-400">AI</span>
            </a>
            <p className="text-neutral-600 text-xs mt-1">AI-powered practice management for TCM</p>
          </div>

          <div className="flex items-center gap-8 text-sm text-neutral-500">
            <a href="#features" className="hover:text-neutral-300 transition-colors">Features</a>
            <a href="#ai" className="hover:text-neutral-300 transition-colors">AI</a>
            <a href="#pricing" className="hover:text-neutral-300 transition-colors">Pricing</a>
            <a href="#waitlist" className="hover:text-neutral-300 transition-colors">Waitlist</a>
          </div>
        </div>

        <div className="section-divider mt-8 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>&copy; {new Date().getFullYear()} DeQi. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── Main Page ─────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Problem />
      <Features />
      <AIShowcase />
      <Pricing />
      <Founder />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
