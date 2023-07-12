import { PrismaClient } from '@prisma/client';

declare global {
	namespace NodeJS {
		interface Global {
			prisma: PrismaClient;
		}
	}
}

let prisma: PrismaClient;

if (!(global as any).prisma) {
	(global as any).prisma = new PrismaClient({
		log: ['info']
	});
}
prisma = (global as any).prisma;

export default prisma;