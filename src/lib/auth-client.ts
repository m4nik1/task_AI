import { createAuthClient } from "better-auth/react"
import { convexClient } from "@convex-dev/better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [convexClient()],
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ||
    "http://localhost:3000", // fallback for dev
})
