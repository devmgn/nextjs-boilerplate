// biome-ignore lint/style/noNamespace: <explanation>
declare namespace nodeJs {
  interface ProcessEnv extends Readonly<Record<string, string>> {}
}
