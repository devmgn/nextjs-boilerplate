// biome-ignore lint/style/noNamespace: <explanation>
declare namespace NodeJs {
  type ProcessEnv = Readonly<Record<string, string>>;
}
