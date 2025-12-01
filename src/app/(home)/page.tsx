import prisma from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  let tasks;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // In the future we change this to the homepage
    return <div>Not Authenticated</div>;
  } else {
    tasks = await prisma.usertasks.findMany({
      // orderBy: { id: 'asc' },
      // where: {
      //   user_id: session.user.id,
      // }
    })
    console.log("tasks: ", tasks)
    return <HomePageClient taskDB={tasks} />;
  }
}
