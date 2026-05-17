"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, ShoppingBag, ClipboardList, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"

const ITEMS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/explore", label: "Explore", Icon: Search },
  { href: "/cart", label: "Cart", Icon: ShoppingBag },
  { href: "/orders", label: "Orders", Icon: ClipboardList },
  { href: "/profile", label: "Profile", Icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 glass-strong md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href
          const isCart = href === "/cart"
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {isCart && itemCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
