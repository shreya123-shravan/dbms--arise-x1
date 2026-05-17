"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, Play } from "lucide-react"

export function LoadingScreen({ onReady }: { onReady: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showButton, setShowButton] = useState(false)
  const [exiting, setExiting]       = useState(false)

  /* Show the button after 1.8 s so the video has a moment to breathe */
  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 1800)
    return () => clearTimeout(t)
  }, [])

  /* Auto-play the video */
  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  function handleReady() {
    setExiting(true)
    setTimeout(onReady, 700)   /* wait for fade-out animation */
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ── Full-screen video background ── */}
      <video
        ref={videoRef}
        src="/llo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* ── Dark vignette overlay so button is always readable ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      {/* ── Scanline texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">


        {/* Loading Icon */}
        <div className="flex h-12 w-full items-center justify-center">
          <Zap
            className="size-10 animate-pulse"
            style={{
              color: "#39ff14",
              filter: "drop-shadow(0 0 12px #39ff14) drop-shadow(0 0 24px rgba(57,255,20,0.6))",
            }}
          />
        </div>

        {/* ── Ready Button ── */}
        <div
          className={`transition-all duration-700 mt-48 ${
            showButton ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          <button
            onClick={handleReady}
            className="group relative flex items-center justify-center overflow-hidden rounded-full p-4 font-black transition-all duration-200 active:scale-95"
            style={{
              color: "#0f0a1e",
              background: "#39ff14",
              border: "2px solid #39ff14",
              boxShadow:
                "0 0 12px #39ff14, 0 0 30px rgba(57,255,20,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = "#0f0a1e"
              el.style.color = "#39ff14"
              el.style.boxShadow =
                "0 0 20px #39ff14, 0 0 50px rgba(57,255,20,0.5)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = "#39ff14"
              el.style.color = "#0f0a1e"
              el.style.boxShadow =
                "0 0 12px #39ff14, 0 0 30px rgba(57,255,20,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
            />
            <Play className="size-6 ml-1" fill="currentColor" />
          </button>
        </div>
      </div>


    </div>
  )
}
