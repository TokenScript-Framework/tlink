export const isTokenScriptViewerUrl = (actionUrl: URL | string) => {
  return (
    actionUrl.toString().startsWith('https://viewer.tokenscript.org/') ||
    actionUrl.toString().startsWith('https://viewer-staging.tokenscript.org/')
  );
};
