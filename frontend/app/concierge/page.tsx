"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, Sparkles, Utensils, Clock, Leaf, Flame } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Restaurant, MenuItem } from "@/lib/types"
import { BottomNav } from "@/components/bottom-nav"

const quickPrompts = [
  { icon: Utensils, text: "What should I eat?", color: "from-purple-500 to-pink-500" },
  { icon: Clock, text: "Quick lunch ideas", color: "from-blue-500 to-cyan-500" },
  { icon: Leaf, text: "Healthy options", color: "from-green-500 to-emerald-500" },
  { icon: Flame, text: "Something spicy", color: "from-orange-500 to-red-500" },
]

export default function ConciergePage() {
  const [input, setInput] = useState("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          restaurants,
          menuItems,
        },
      }),
    }),
  })

  useEffect(() => {
    async function fetchData() {
      const [restaurantsRes, menuItemsRes] = await Promise.all([
        supabase.from("restaurants").select("*").eq("is_active", true),
        supabase.from("menu_items").select("*, restaurants(name)").eq("is_available", true).limit(50),
      ])
      if (restaurantsRes.data) setRestaurants(restaurantsRes.data)
      if (menuItemsRes.data) {
        setMenuItems(
          menuItemsRes.data.map((item) => ({
            ...item,
            restaurant_name: (item.restaurants as { name: string })?.name,
          }))
        )
      }
    }
    fetchData()
  }, [supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleQuickPrompt = (text: string) => {
    sendMessage({ text })
  }

  const isStreaming = status === "streaming"

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ARIA</h1>
              <p className="text-xs text-muted-foreground">Food Concierge</p>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground mb-2">Hey there!</h2>
            <p className="text-muted-foreground text-center max-w-sm mb-8">
              I&apos;m ARIA, your AI food concierge. Tell me what you&apos;re craving and I&apos;ll find the perfect dish for you.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {quickPrompts.map((prompt, i) => (
                <motion.button
                  key={prompt.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${prompt.color} text-white text-left hover:scale-105 transition-transform`}
                >
                  <prompt.icon className="w-5 h-5 mb-2" />
                  <span className="text-sm font-medium">{prompt.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => {
              const text = message.parts
                ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("") || ""
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span className="text-xs font-medium text-purple-500">ARIA</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{text}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="w-2 h-2 bg-purple-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-purple-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-purple-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about food..."
            className="flex-1 px-4 py-3 bg-muted rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="p-3 bg-primary text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
