import prisma from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import LandingPage from "@/components/LandingPage";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import moment from "moment";

export default async function HomePage() {
  let tasks;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <LandingPage />;
  } else {
    console.log("Date: ", moment().toISOString())
    const date = moment().toISOString()

    tasks = await prisma.usertasks.findMany({
      orderBy: { id: 'asc' },
      where: {
        user_id: session.user.id,
        // dateCreated: {
        //
        // }
      }
    })
    console.log("tasks: ", tasks)
    return <HomePageClient taskDB={tasks} />;
  }
}
