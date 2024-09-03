export const isTokenScriptViewerUrl = (actionUrl: URL) => {
  return (
    actionUrl.toString().startsWith('https://viewer.tokenscript.org/') ||
    actionUrl.toString().startsWith('https://viewer-staging.tokenscript.org/')
  );
};
