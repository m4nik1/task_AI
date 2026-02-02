import HomePageClient from "@/components/HomePageClient";
import LandingPage from "@/components/LandingPage";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";
import moment from "moment";

type AuthUser = {
  _id: string;
};

export default async function HomePage() {
  let user: AuthUser;
  try {
    user = (await fetchAuthQuery(api.auth.getCurrentUser, {})) as AuthUser;
  } catch {
    return <LandingPage />;
  }

  console.log("Date: ", moment().toISOString());

  return <HomePageClient />;
}
