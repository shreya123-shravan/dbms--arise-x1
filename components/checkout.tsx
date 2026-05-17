'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCartCheckoutSession } from '../app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Checkout({ amount, restaurantName, deliveryAddress }: {
  amount: number
  restaurantName: string
  deliveryAddress: string
}) {
  const fetchClientSecret = useCallback(async () => {
    const result = await startCartCheckoutSession({
      items: [{ name: 'Order', price: amount, quantity: 1 }],
      deliveryFee: 0,
      restaurantName,
      deliveryAddress,
    })
    return result.clientSecret ?? ''
  }, [amount, restaurantName, deliveryAddress])

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
