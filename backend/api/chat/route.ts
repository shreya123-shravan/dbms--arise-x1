"use server"

import { streamText, convertToModelMessages } from "ai"

export async function POST(req: Request) {
  const { messages, restaurants, menuItems } = await req.json()

  // Build context about available restaurants and menu items
  const restaurantContext = restaurants
    ?.map((r: { name: string; cuisine_type: string; rating: number }) => 
      `${r.name} (${r.cuisine_type}, ${r.rating} stars)`
    )
    .join(", ") || "various restaurants"

  const menuContext = menuItems
    ?.slice(0, 20)
    .map((m: { name: string; price: number; category: string; restaurant_name?: string }) => 
      `${m.name} ($${m.price}) - ${m.category}`
    )
    .join("; ") || "various dishes"

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are ARIA, an AI Food Concierge for a futuristic food delivery app. You help users discover amazing food based on their mood, cravings, dietary preferences, and past orders.

Your personality:
- Enthusiastic about food but not over the top
- Knowledgeable about cuisines from around the world
- Helpful with dietary restrictions (vegetarian, vegan, allergies)
- You give concise, actionable recommendations

Available restaurants: ${restaurantContext}
Sample menu items: ${menuContext}

When recommending food:
1. Ask about their mood or what they're craving if unclear
2. Suggest specific dishes from the available menu
3. Mention the restaurant name and approximate price
4. Offer alternatives for dietary restrictions

Keep responses concise (2-3 sentences for simple queries, up to a short paragraph for detailed recommendations). Use a friendly, modern tone.`,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
