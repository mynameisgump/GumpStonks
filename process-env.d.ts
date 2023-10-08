declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      GITHUB_TOKEN: string;
    }
  }
}
