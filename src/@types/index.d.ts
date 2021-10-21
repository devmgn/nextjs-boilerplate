declare module 'appSettings' {
  type AppSettings = {
    siteName: string;
    titleSeparator: string;
    defaultDescription: string;
  };

  const appSettings: AppSettings;
  export default appSettings;
}
