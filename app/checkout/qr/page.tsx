"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { CheckCircle2, IndianRupee, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

function QRApprovalContent() {
  const params = useSearchParams()
  const sessionId = params.get("session")
  const amount = params.get("amount") ?? "0"
  const [status, setStatus] = useState<"idle" | "loading" | "accepted" | "declined" | "error">("idle")

  const updateSession = async (newStatus: "approved" | "declined") => {
    if (!sessionId) { setStatus("error"); return }
    setStatus("loading")
    const supabase = createClient()
    const { error } = await supabase
      .from("payment_sessions")
      .update({ status: newStatus })
      .eq("id", sessionId)
    if (error) { setStatus("error"); return }
    setStatus(newStatus === "approved" ? "accepted" : "declined")
  }

  if (status === "accepted") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle2 className="size-10 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-400">Payment Approved!</h1>
          <p className="mt-1 text-muted-foreground">You can close this tab.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/60 px-8 py-4">
          <p className="text-sm text-muted-foreground">Amount Paid</p>
          <p className="flex items-center justify-center text-3xl font-bold">
            <IndianRupee className="size-6" />{parseFloat(amount).toFixed(0)}
          </p>
        </div>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-red-500/20">
          <XCircle className="size-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-red-400">Payment Declined</h1>
        <p className="text-muted-foreground">You can close this tab.</p>
      </div>
    )
  }

  if (status === "error" || !sessionId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <XCircle className="size-12 text-red-500" />
        <p className="text-lg font-semibold">Invalid payment link</p>
        <p className="text-sm text-muted-foreground">This QR code may have expired.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
          <IndianRupee className="size-8 text-white" />
        </div>
        <h1 className="text-xl font-bold">ARISE Eats</h1>
        <p className="text-sm text-muted-foreground">Payment Request</p>
      </div>

      {/* Amount */}
      <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-card/60 p-6 text-center">
        <p className="text-sm text-muted-foreground">Amount to Pay</p>
        <p className="flex items-center justify-center text-4xl font-bold">
          <IndianRupee className="size-7" />{parseFloat(amount).toFixed(0)}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Session: <span className="font-mono font-semibold text-foreground">{sessionId.slice(0, 8).toUpperCase()}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          onClick={() => updateSession("approved")}
          disabled={status === "loading"}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 py-6 text-lg font-bold"
        >
          {status === "loading" ? <Loader2 className="mr-2 size-5 animate-spin" /> : <CheckCircle2 className="mr-2 size-5" />}
          Accept & Pay
        </Button>
        <Button
          variant="outline"
          onClick={() => updateSession("declined")}
          disabled={status === "loading"}
          className="w-full py-6 text-base"
        >
          Decline
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">Secured by ARISE Eats · UPI</p>
    </div>
  )
}

export default function QRApprovalPage() {
  return (
    <Suspense>
      <QRApprovalContent />
    </Suspense>
  )
}
