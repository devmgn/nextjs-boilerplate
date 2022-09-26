declare module 'appSettings' {
  type AppSettings = {
    meta: {
      appName: string;
      titleSeparator: string;
      defaultDescription: string;
    };
  };

  const appSettings: AppSettings;
  export default appSettings;
}
