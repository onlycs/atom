import { NuxtAuthHandler } from '#auth';
import Discord from 'next-auth/providers/discord';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '~/prisma/client';

export default NuxtAuthHandler({
	secret: process.env.AUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	providers: [
		// @ts-expect-error - .default is required
		Discord.default({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET
		})
	]
});