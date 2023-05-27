declare namespace NodeJS {
  interface ProcessEnv {
    readonly [key: string]: string;
  }
}
