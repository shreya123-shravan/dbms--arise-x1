"use client"

import { useState } from "react"
import { Mic, Square, Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteNav } from "@/components/site-nav"
import { BottomNav } from "@/components/bottom-nav"
import type { Language } from "@/lib/types"
import { cn } from "@/lib/utils"

type Phase = "idle" | "listening" | "thinking" | "responding"

const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
  { value: "ta", label: "Tamil", native: "தமிழ்" },
  { value: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { value: "te", label: "Telugu", native: "తెలుగు" },
]

const SAMPLE_TRANSCRIPTS: Record<Language, string> = {
  en: "Aria, what should I eat for lunch today?",
  hi: "Aaj subah kya khaana chahiye?",
  ta: "Indru lunch-ku enna saapida?",
  kn: "Indu lunch-ge enu tindreke?",
  te: "Iroju lunch-ki em tinali?",
}

const SAMPLE_RESPONSE: Record<Language, string> = {
  en:
    "You skipped protein at lunch last Tuesday. Try a 10-minute paneer & quinoa bowl — 28g of protein, 460 calories, +45 XP.",
  hi:
    "Pichle Tuesday aapne lunch mein protein kam liya tha. 10 minute mein banne wala paneer-quinoa bowl try kijiye — 28g protein, +45 XP.",
  ta:
    "Kadanja vellaikizhamai lunch-le protein kammi-aa irundhuchu. 10 nimisham paneer-quinoa bowl try pannunga — 28g protein, +45 XP.",
  kn:
    "Hodada Tuesday lunch-li protein kammi aagidhe. 10 nimisha paneer-quinoa bowl try maadi — 28g protein, +45 XP.",
  te:
    "Pothu Tuesday lunch-lo protein takkuva ayyindi. 10 nimishala paneer-quinoa bowl try cheyandi — 28g protein, +45 XP.",
}

export default function VoicePage() {
  const [language, setLanguage] = useState<Language>("hi")
  const [phase, setPhase] = useState<Phase>("idle")
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")

  const startListening = async () => {
    setPhase("listening")
    setTranscript("")
    setResponse("")
    // Simulated capture
    await new Promise((r) => setTimeout(r, 1400))
    setTranscript(SAMPLE_TRANSCRIPTS[language])
    setPhase("thinking")
    await new Promise((r) => setTimeout(r, 1100))
    setResponse(SAMPLE_RESPONSE[language])
    setPhase("responding")
  }

  const stop = () => setPhase("idle")

  const isBusy = phase === "listening" || phase === "thinking"

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <SiteNav />

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col gap-2 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            ARIA · voice
          </span>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            Speak in your <span className="text-accent">language</span>.
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Hold the mic. Ask anything about food. ARIA replies in the same language using
            Sarvam AI for STT and TTS.
          </p>
        </header>

        {/* Language picker */}
        <fieldset className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
          <legend className="px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Language
          </legend>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLanguage(l.value)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  language === l.value
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border/60 bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-semibold">{l.native}</span>
                <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Mic */}
        <section
          aria-label="Voice control"
          className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-card p-8"
        >
          <div className="relative">
            {phase === "listening" && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -m-4 animate-ping rounded-full bg-accent/30"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -m-2 animate-pulse rounded-full bg-accent/40"
                />
              </>
            )}
            <button
              type="button"
              onClick={isBusy ? stop : startListening}
              aria-pressed={phase === "listening"}
              aria-label={phase === "listening" ? "Stop listening" : "Start listening"}
              className={cn(
                "relative flex size-24 items-center justify-center rounded-full transition-colors",
                phase === "listening"
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {phase === "thinking" ? (
                <Loader2 className="size-9 animate-spin" aria-hidden="true" />
              ) : phase === "listening" ? (
                <Square className="size-8" aria-hidden="true" />
              ) : (
                <Mic className="size-9" aria-hidden="true" />
              )}
            </button>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {phase === "idle" && "Tap to talk"}
            {phase === "listening" && "Listening…"}
            {phase === "thinking" && "ARIA is thinking…"}
            {phase === "responding" && "Response ready"}
          </p>
        </section>

        {/* Transcript & response */}
        {(transcript || response) && (
          <section className="flex flex-col gap-3">
            {transcript && (
              <article className="flex flex-col gap-1 rounded-xl border border-border/60 bg-secondary/60 p-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  You said
                </span>
                <p className="text-sm leading-relaxed text-foreground">{transcript}</p>
              </article>
            )}
            {response && (
              <article className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    ARIA replies
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 text-[11px]">
                    <Volume2 className="mr-1 size-3" aria-hidden="true" />
                    Replay
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{response}</p>
              </article>
            )}
          </section>
        )}

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Sarvam STT + TTS · Groq llama3-70B · &lt; 2.5s avg
        </p>
      </main>

      <BottomNav />
    </div>
  )
}
