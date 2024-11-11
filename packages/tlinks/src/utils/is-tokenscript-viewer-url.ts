export const isTokenScriptViewerUrl = (actionUrl: URL | string) => {
  return (
    actionUrl.toString().startsWith('https://viewer.tokenscript.org/') ||
    actionUrl
      .toString()
      .startsWith('https://viewer-staging.tokenscript.org/') ||
    actionUrl.toString().startsWith('http://localhost:3333/') ||
    actionUrl.toString().startsWith('https://tlink.store/') ||
    actionUrl.toString().startsWith('https://staging.tlink.store/')
  );
};
