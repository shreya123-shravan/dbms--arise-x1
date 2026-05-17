"use client"

/**
 * ARIA Food Concierge — AI-powered food recommendation assistant
 * Helps users decide what to order based on mood, time, and preferences
 */

import { useEffect, useRef, useState } from "react"
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
  UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  ts: number
}

const SUGGESTIONS = [
  "What should I order right now?",
  "I'm feeling adventurous",
  "Something quick and healthy",
  "Best rated dishes nearby",
  "Comfort food for tonight",
] as const

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function AriaCoach() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      ts: Date.now(),
      text: `Hey there! I'm ARIA, your AI food concierge. I can help you discover the perfect meal based on your mood, cravings, or dietary needs. What are you in the mood for?`,
    },
  ])
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!open) return
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, open, pending])

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || pending) return

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text: trimmed,
      ts: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    setDraft("")
    setPending(true)

    // Simulated streaming round-trip
    window.setTimeout(() => {
      const reply = generateAriaReply(trimmed)
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", text: reply, ts: Date.now() },
      ])
      setPending(false)
    }, 700)
  }

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        aria-label={open ? "Close ARIA concierge" : "Open ARIA concierge"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed z-[60] flex items-center gap-2 rounded-full font-bold text-primary-foreground shadow-2xl transition-all",
          "right-4 bottom-24 md:right-6 md:bottom-6",
          "bg-primary px-4 py-3 hover:scale-[1.03] active:scale-95",
          "glow-primary",
        )}
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <>
            <Sparkles className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline text-sm">Ask ARIA</span>
            <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary-foreground/15 font-mono text-[10px]">
              AI
            </span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="ARIA chat"
          className={cn(
            "fixed z-[59] flex flex-col overflow-hidden rounded-3xl border border-border/60 shadow-2xl",
            "glass-strong",
            "right-3 bottom-40 left-3 max-h-[70vh]",
            "md:left-auto md:bottom-24 md:right-6 md:w-[380px] md:max-h-[560px]",
          )}
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <span
              aria-hidden="true"
              className="relative flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/40"
            >
              <UtensilsCrossed className="size-5" />
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card animate-pulse" />
            </span>
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-sm font-bold">ARIA</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Food Concierge · online
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-4 py-4"
            role="log"
            aria-live="polite"
          >
            <ul className="flex flex-col gap-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "flex max-w-[88%] flex-col gap-1",
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/60 bg-card/70 text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                </li>
              ))}
              {pending && (
                <li className="mr-auto flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 px-3 py-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ARIA is thinking...
                </li>
              )}
            </ul>
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
            className="flex items-center gap-2 border-t border-border/60 px-3 py-3"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              type="text"
              autoComplete="off"
              placeholder="What are you craving?"
              aria-label="Message ARIA"
              className="flex-1 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={pending || !draft.trim()}
              aria-label="Send message"
              className="rounded-full"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
            </Button>
          </form>

          {/* Footer micro-help */}
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <MessageCircle className="size-3" aria-hidden="true" />
              AI Food Recommendations
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Powered by ARISE
            </span>
          </div>
        </div>
      )}
    </>
  )
}

/* -------------------------------------------------------------- */
/*  Food recommendation reply engine                               */
/* -------------------------------------------------------------- */

function generateAriaReply(input: string): string {
  const q = input.toLowerCase()

  // Quick / fast food
  if (/(quick|fast|hurry|rush|busy)/.test(q)) {
    return `For something quick, I'd recommend Taco Fiesta's Carne Asada Tacos — they deliver in 20-30 minutes and are absolutely delicious. Or try Dragon Palace's Spring Rolls as a fast appetizer while you decide on more.`
  }

  // Healthy options
  if (/(healthy|diet|light|salad|vegan|vegetarian|green|clean)/.test(q)) {
    return `The Green Bowl has amazing healthy options! Their Buddha Bowl is packed with quinoa and roasted veggies, only 420 calories. For something heartier, try Spice Garden's Paneer Tikka Masala — it's vegetarian and absolutely flavorful.`
  }

  // Comfort food
  if (/(comfort|cozy|warm|soul|home|nostalgic)/.test(q)) {
    return `Nothing beats comfort food! I'd suggest Mama Mia's Margherita Pizza with extra garlic bread, or if you're feeling spicy, Spice Garden's Butter Chicken with garlic naan is pure comfort in a bowl.`
  }

  // Adventurous / new
  if (/(adventur|new|different|try|explore|surprise)/.test(q)) {
    return `Feeling adventurous? Seoul Kitchen's Korean BBQ is incredible — get the bibimbap with a side of kimchi. Or go for Sakura Sushi's Dragon Roll if you haven't tried Japanese fusion before!`
  }

  // Pizza / Italian
  if (/(pizza|italian|pasta|cheese)/.test(q)) {
    return `Mama Mia Pizzeria is your best bet! Their Margherita uses San Marzano tomatoes and fresh mozzarella — authentic Neapolitan style. Don't skip the Tiramisu for dessert.`
  }

  // Sushi / Japanese
  if (/(sushi|japanese|asian|fish|roll)/.test(q)) {
    return `Sakura Sushi House is rated 4.8 stars! The Dragon Roll with shrimp tempura is their signature dish. Start with their Miso Soup and Veggie Tempura for a complete experience.`
  }

  // Indian / spicy
  if (/(indian|curry|spic|masala|naan)/.test(q)) {
    return `Spice Garden has the best Indian food in town! Their Butter Chicken is creamy perfection, and the Garlic Naan is made fresh. If you can handle heat, the Paneer Tikka Masala is amazing.`
  }

  // Mexican
  if (/(mexican|taco|burrito|salsa|guac)/.test(q)) {
    return `Taco Fiesta is calling your name! Their Carne Asada Tacos are legendary, and you MUST get the fresh Guacamole & Chips. Finish with Churros — crispy, cinnamon-sugar heaven.`
  }

  // Best rated / top picks
  if (/(best|top|rated|popular|recommend)/.test(q)) {
    return `Based on ratings, here are today's top picks: Sakura Sushi (4.8 stars) for their Dragon Roll, The Green Bowl (4.9 stars) for the Buddha Bowl, and Spice Garden (4.7 stars) for Butter Chicken. All deliver in under 45 minutes!`
  }

  // What to eat / general recommendation
  if (/(eat|order|meal|dinner|lunch|breakfast|hungry|craving|food|tonight)/.test(q)) {
    const hour = new Date().getHours()
    if (hour < 11) {
      return `Good morning! For breakfast, The Green Bowl's Acai Power Bowl is energizing and delicious. Or if you want something savory, Dragon Palace's Vegetable Fried Rice is surprisingly good in the morning!`
    } else if (hour < 15) {
      return `For lunch, I'd suggest The Green Bowl's Buddha Bowl for something light, or if you're really hungry, Mama Mia's Pepperoni Pizza will hit the spot. Both deliver in under 35 minutes!`
    } else if (hour < 20) {
      return `For dinner tonight, you can't go wrong with Spice Garden's Butter Chicken and Garlic Naan combo. Or if you want something different, Sakura Sushi's Dragon Roll is absolutely incredible.`
    } else {
      return `Late night craving? Taco Fiesta delivers until midnight — their Chicken Burrito is filling and satisfying. Or grab some Churros for a sweet treat!`
    }
  }

  // Greeting / small talk
  if (/^(hi|hello|hey|yo)\b/.test(q)) {
    return `Hey! Ready to discover your next favorite meal. Tell me what you're in the mood for — something healthy, comfort food, or maybe something adventurous?`
  }

  // Fallback
  return `Based on what's popular right now, I'd recommend checking out The Green Bowl for healthy options, Sakura Sushi for Japanese, or Spice Garden for Indian cuisine. What cuisine sounds good to you?`
}
