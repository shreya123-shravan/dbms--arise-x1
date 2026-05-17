'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Clock, Phone, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const ORDER_STATUSES = [
  { status: 'confirmed', label: 'Order Confirmed', icon: '✓' },
  { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { status: 'ready', label: 'Ready for Pickup', icon: '📦' },
  { status: 'picked_up', label: 'On the Way', icon: '🚗' },
  { status: 'delivered', label: 'Delivered', icon: '✓' },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [currentStatus, setCurrentStatus] = useState('picked_up')
  const [deliveryAgent, setDeliveryAgent] = useState({
    name: 'Raj Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    vehicle: 'Bike - KA 01 AB 1234',
  })

  // Mock order data
  const mockOrder = {
    id: orderId,
    restaurant: {
      name: 'Mumbai Street Food',
      address: '123 Food Street, Mumbai',
      phone: '+91 22 1234 5678',
    },
    deliveryAddress: '456 Customer Lane, Mumbai - 400001',
    estimatedDelivery: '18:45',
    items: [
      { name: 'Pav Bhaji', quantity: 2, price: 150 },
      { name: 'Masala Chai', quantity: 2, price: 40 },
    ],
    total: 380,
    xpEarned: 38,
  }

  // Simulate real-time status updates
  useEffect(() => {
    const statuses = ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered']
    let currentIndex = statuses.indexOf(currentStatus)

    const timer = setTimeout(() => {
      if (currentIndex < statuses.length - 1) {
        setCurrentStatus(statuses[currentIndex + 1])
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentStatus])

  const currentStatusIndex = ORDER_STATUSES.findIndex((s) => s.status === currentStatus)

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/orders/${orderId}`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold flex-1">Order Tracking</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* ORDER STATUS TIMELINE */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ORDER_STATUSES.map((step, index) => (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold ${
                            index <= currentStatusIndex
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step.icon}
                        </div>
                        {index < ORDER_STATUSES.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              index < currentStatusIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-1 pb-8">
                        <p className="font-semibold">{step.label}</p>
                        {index === currentStatusIndex && (
                          <p className="text-xs text-muted-foreground mt-1">In progress</p>
                        )}
                        {index < currentStatusIndex && (
                          <p className="text-xs text-muted-foreground mt-1">Completed</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DELIVERY AGENT */}
            {currentStatus !== 'preparing' && currentStatus !== 'ready' && currentStatus !== 'delivered' && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Partner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{deliveryAgent.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Star className="size-3.5 fill-primary text-primary" />
                        {deliveryAgent.rating} rating
                      </p>
                      <p className="text-sm text-muted-foreground">{deliveryAgent.vehicle}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`tel:${deliveryAgent.phone}`}>
                        <Phone className="size-4 mr-2" />
                        Call
                      </Link>
                    </Button>
                  </div>

                  {/* MOCK MAP */}
                  <div className="w-full h-48 bg-linear-to-b from-accent/20 to-primary/20 rounded-lg flex items-center justify-center border border-border/50">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p className="text-xs text-muted-foreground">Live map would appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">Currently 2.5 km away</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RESTAURANT DETAILS */}
            <Card>
              <CardHeader>
                <CardTitle>From Restaurant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-semibold">{mockOrder.restaurant.name}</p>
                  <p className="text-sm text-muted-foreground">{mockOrder.restaurant.address}</p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`tel:${mockOrder.restaurant.phone}`}>
                    <Phone className="size-4 mr-2" />
                    Call Restaurant
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* DELIVERY ADDRESS */}
            <Card>
              <CardHeader>
                <CardTitle>Delivering To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{mockOrder.deliveryAddress}</p>
                    <p className="text-sm text-muted-foreground mt-1">Estimated arrival: {mockOrder.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="glass-strong rounded-xl p-6 sticky top-32">
              <h3 className="font-semibold mb-4">Order Details</h3>

              <div className="space-y-2 mb-4 pb-4 border-b">
                {mockOrder.items.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span className="text-primary">₹{mockOrder.total}</span>
              </div>

              <div className="bg-primary/10 rounded-lg p-3 mb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">XP Earned</p>
                <p className="font-bold text-lg text-primary">+{mockOrder.xpEarned} XP</p>
              </div>

              {currentStatus === 'delivered' && (
                <div className="space-y-2">
                  <Button asChild className="w-full font-semibold" variant="outline">
                    <Link href={`/orders/${orderId}/review`}>Leave Review</Link>
                  </Button>
                  <Button asChild className="w-full font-semibold glow-primary">
                    <Link href="/restaurants">Order Again</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
