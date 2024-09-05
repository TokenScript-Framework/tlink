// export * from "./components";
// export * from "./hooks";
export * from "./libs";

let infuraApiKey: string | undefined;
export const TokenKit = {
  setInfuraApiKey: (apiKey: string) => {
    TokenKit.infuraApiKey = apiKey;
  },

  infuraApiKey,
};
