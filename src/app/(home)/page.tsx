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
    console.log(session);
    // return <HomePageClient taskDB={tasks} />;
    // redirect('/signIn')
    return <div>Not Authenticated</div>;
  } else {
    console.log("Authenticated: ", session);
    console.log("User id: ", session.user.id)
    tasks = await prisma.usertasks.findMany({
      orderBy: { id: 'asc' },
      where: {
        user_id: session.user.id
      }
    })
    return <HomePageClient taskDB={tasks} />;
  }

  // const tasks = await prisma.userTasks.findMany({
  //   where: {
  //     userId:
  //   }
  // });
}
