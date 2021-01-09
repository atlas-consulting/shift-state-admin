export interface IConfig {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  LOGGER: Console;
}

export const DEFAULT_CONFIG: IConfig = {
  NODE_ENV: (process.env.NODE_ENV as IConfig["NODE_ENV"]) || "development",
  PORT: ((process.env.PORT as unknown) as number) || 8080,
  LOGGER: console,
};
