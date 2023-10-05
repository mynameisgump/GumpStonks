declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      GITHUB_TOKEN: string;
      // add more environment variables and their types here
    }
  }
}
