"use server"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages, restaurants, menuItems } = await req.json()

    const restaurantContext =
      restaurants
        ?.map(
          (r: { name: string; cuisine_type?: string; rating: number }) =>
            `${r.name} (${r.cuisine_type ?? "Food"}, ${r.rating} stars)`
        )
        .join(", ") || "various restaurants"

    const menuContext =
      menuItems
        ?.slice(0, 20)
        .map(
          (m: { name: string; price: number; category: string }) =>
            `${m.name} ($${m.price}) - ${m.category}`
        )
        .join("; ") || "various dishes"

    // Rule-based fallback (works without any API key)
    const lastUserMessage =
      messages?.findLast((m: { role: string }) => m.role === "user")?.content ?? ""
    const reply = generateFallbackReply(String(lastUserMessage), restaurantContext, menuContext)

    return NextResponse.json({
      id: crypto.randomUUID(),
      role: "assistant",
      content: reply,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat request." },
      { status: 500 }
    )
  }
}

function generateFallbackReply(
  input: string,
  _restaurantContext: string,
  _menuContext: string
): string {
  const q = input.toLowerCase()

  if (/(quick|fast|hurry|rush)/.test(q))
    return "For something quick, check our top-rated restaurants — most deliver in 25-35 minutes!"
  if (/(healthy|diet|light|vegan|vegetarian|salad)/.test(q))
    return "Great choice! Browse restaurants with salad bowls, grain bowls, or vegetarian options. Filter by 'Healthy' cuisine for the best picks."
  if (/(spic|hot|chili|fire)/.test(q))
    return "Craving heat? Indian and Mexican restaurants usually have excellent spicy options. Look for the 🌶️ indicators on menu items!"
  if (/(pizza|italian|pasta|cheese)/.test(q))
    return "Nothing beats a good pizza! Browse our Italian restaurants for authentic Neapolitan-style pies and fresh pasta."
  if (/(sushi|japanese|asian|roll)/.test(q))
    return "Sushi time! Our Japanese restaurants offer fresh rolls, sashimi, and bento boxes. Check ratings for the freshest picks."
  if (/(indian|curry|masala|biryani)/.test(q))
    return "Indian cuisine is incredible! Look for butter chicken, biryani, or paneer dishes — rich, aromatic, and satisfying."
  if (/(burger|american|fries)/.test(q))
    return "Burger craving? Our American restaurants have juicy burgers with all the toppings. Don't forget the fries!"
  if (/(chinese|noodle|dim sum|wok)/.test(q))
    return "Chinese food is perfect for sharing! Try dim sum, noodles, or a classic fried rice from our top-rated Chinese restaurants."

  const hour = new Date().getHours()
  if (hour < 11)
    return "Good morning! Start your day with something energizing — try a protein-rich breakfast bowl or fresh smoothie from our morning menu."
  if (hour < 15)
    return "Lunch time! A balanced meal with protein and veggies will keep you energized all afternoon. Browse our lunch specials!"
  if (hour < 20)
    return "Dinner ideas? Browse our top-rated restaurants and treat yourself to something special tonight!"
  return "Late night craving? Check which restaurants are still open — many deliver until midnight. Try something comforting!"
}
