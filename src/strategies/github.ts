import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "../config/database.js";
import { companies } from "../schemas/company.js";
import { eq } from "drizzle-orm";
import { generateApiKey } from "../controllers/auth.controller.js";
import { getRedis } from "../config/redis.js";

const redis = getRedis();

export const initializeGitHubStrategy = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${process.env.CALLBACK_URL}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          console.log("GitHub accessToken received:", accessToken ? "YES" : "NO");

          const email = profile.emails?.[0].value;
          if (!email) return done(new Error("GitHub email not available"));

          let [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.email, email));

          if (!company) {
            const apiKey = generateApiKey();

            [company] = await db
              .insert(companies)
              .values({
                email,
                name: profile.displayName || profile.username,
                githubId: profile.id,
                apiKey,
              })
              .returning();

            await redis.set(`apikey:${apiKey}`, "1", "EX", 60 * 15);
          } else {
            if (company.apiKey) {
              await redis.set(`apikey:${company.apiKey}`, "1", "EX", 60 * 15);
            }
          }

          return done(null, company);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
};
