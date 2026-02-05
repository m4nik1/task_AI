import HomePageClient from "@/components/HomePageClient";
import LandingPage from "@/components/LandingPage";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";

export default async function HomePage() {
  try {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});
    if (user) {
      return <HomePageClient />;
    }
  } catch {
    return <LandingPage />;
  }
}
