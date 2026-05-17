"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, ArrowRight, Utensils, Phone, MapPin, Gift, Star, Zap } from "lucide-react"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/auth/sign-up-success")
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Right Side - Image Section (On right for signup) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden order-2">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80"
            alt="Fresh food"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-900/90 via-pink-800/80 to-purple-900/90" />
        </div>

        {/* Floating Elements */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Join the<br />
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Food Revolution
              </span>
            </h1>
            
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Get exclusive offers, AI-powered recommendations, and earn rewards with every order
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <div className="space-y-4">
            {[
              { icon: Gift, text: "Get Rs.100 off on first order", subtext: "Use code: WELCOME100", color: "from-green-500 to-emerald-500" },
              { icon: Star, text: "Earn XP & Rewards", subtext: "Level up with every order", color: "from-yellow-500 to-orange-500" },
              { icon: Zap, text: "Lightning Fast Delivery", subtext: "30 mins or free", color: "from-purple-500 to-pink-500" },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-white font-semibold block">{benefit.text}</span>
                  <span className="text-white/60 text-sm">{benefit.subtext}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 mt-12"
          >
            {[
              { value: "50K+", label: "Happy Users" },
              { value: "500+", label: "Restaurants" },
              { value: "4.9", label: "App Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Food Images */}
          <div className="absolute bottom-8 left-8 flex gap-3">
            {[
              "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200",
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200",
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200",
            ].map((img, i) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg"
              >
                <Image src={img} alt="Food" width={80} height={80} className="object-cover w-full h-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative order-1">
        {/* Mobile Header Image */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-40 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"
            alt="Food background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/80 to-background" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10 lg:mt-0 mt-24"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">ARISE Eats</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Start your delicious journey today</p>
          </div>

          {/* Form Card */}
          <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-border shadow-2xl">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border transition-all"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                  >
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 group mt-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-primary hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </div>

          {/* Login link */}
          <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
