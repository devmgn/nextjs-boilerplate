// biome-ignore lint/style/useNamingConvention: <explanation>
// biome-ignore lint/style/noNamespace: <explanation>
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_APP_NAME: string;
    readonly NEXT_PUBLIC_DEFAULT_DESCRIPTION: string;
  }
}
