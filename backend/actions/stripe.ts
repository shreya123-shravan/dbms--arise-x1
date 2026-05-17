'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

interface CartItemForCheckout {
  name: string
  description?: string
  price: number
  quantity: number
}

interface CheckoutData {
  items: CartItemForCheckout[]
  deliveryFee: number
  restaurantName: string
  deliveryAddress: string
}

export async function startCartCheckoutSession(data: CheckoutData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to checkout')
  }

  // Build line items from cart
  const lineItems = data.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: item.description || undefined,
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }))

  // Add delivery fee as a line item
  if (data.deliveryFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Delivery Fee',
          description: `Delivery from ${data.restaurantName}`,
        },
        unit_amount: Math.round(data.deliveryFee * 100),
      },
      quantity: 1,
    })
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    metadata: {
      user_id: user.id,
      restaurant_name: data.restaurantName,
      delivery_address: data.deliveryAddress,
    },
  })

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
  }
}

export async function getCheckoutSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email,
  }
}
