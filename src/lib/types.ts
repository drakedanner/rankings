import type { Show as PrismaShow } from "@prisma/client";

export type Show = PrismaShow;

export type ShowWithRank = Show & { rank: number };
