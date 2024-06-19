declare module 'express-session' {
  interface SessionData {
    pkceCodes: {
      challengeMethod: 'S256';
      challenge?: string;
      verifier?: string;
    };
  }
}