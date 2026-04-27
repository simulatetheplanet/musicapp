import type { EmailProvider } from "@/lib/email/email-provider";

export const localEmailProvider: EmailProvider = {
  async sendVerificationEmail({ to, verificationUrl }) {
    console.info("Local verification email", {
      to,
      verificationUrl,
    });
  },
};
