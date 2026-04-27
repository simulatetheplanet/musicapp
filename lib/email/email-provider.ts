export interface EmailProvider {
  sendVerificationEmail(input: {
    to: string;
    verificationUrl: string;
  }): Promise<void>;
}
