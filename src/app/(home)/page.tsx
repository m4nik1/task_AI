import prisma from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const tasks = await prisma.usertasks.findMany();

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
    return <HomePageClient taskDB={tasks} />;
  }

  // const tasks = await prisma.userTasks.findMany({
  //   where: {
  //     userId:
  //   }
  // });
}
