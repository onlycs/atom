import Discord from 'next-auth/providers/discord';

import { NuxtAuthHandler } from '#auth';

export default NuxtAuthHandler({
	secret: process.env.AUTH_SECRET,
	providers: [
		// @ts-expect-error - .default is required
		Discord.default({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET
		})
	]
});