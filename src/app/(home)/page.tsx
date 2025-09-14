import prisma from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { TaskDB } from "../../../types";

export default async function HomePage() {
  // const tasks = await prisma.userTasks.findMany();
  const tasks: TaskDB[] = [
    {
      id: 1,
      name: "Team Standup",
      status: "Scheduled",
      startTime: new Date("2024-08-18 14:00:00"),
      Duration: 30,
      EndTime: new Date("2024-08-18 14:30:00"),
    },
    {
      id: 2,
      name: "Project Review",
      status: "Completed",
      startTime: new Date("2024-08-18 10:00:00"),
      Duration: 120,
      EndTime: new Date("2024-08-18 10:00:00"),
    },
    {
      id: 3,
      name: "Client Call",
      status: "Scheduled",
      startTime: new Date("2024-08-18 15:00:00"),
      Duration: 60,
      EndTime: new Date("2024-08-18 16:00:00"),
    },
  ];

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log(session);
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
