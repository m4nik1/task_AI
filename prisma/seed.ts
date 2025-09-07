// import { PrismaClient, Prisma } from "../generated/prisma/client.js";

// const prisma = new PrismaClient()

// const data : Prisma.userTasks[] = [
//     {
//         name: "Team Standup",
//         status: "Scheduled",
//         startTime: new Date("2024-08-18 14:00:00"),
//         Duration: 30,
//         EndTime: new Date("2024-08-18 14:30:00")
//     },
//     {
//         name: "Project Review",
//         status: "Completed",
//         startTime: new Date("2024-08-18 10:00:00"),
//         Duration: 120,
//         EndTime: new Date("2024-08-18 10:00:00")
//     },
//     {
//         name: "Client Call",
//         status: "Scheduled",
//         startTime: new Date("2024-08-18 15:00:00"),
//         Duration: 60,
//         EndTime: new Date("2024-08-18 16:00:00")
//     },
// ]

// export async function main() {
//     for (const i of data) {
//         await prisma.userTasks.create({ data: i })
//     }
// }
