export type IsInterstitialResult =
  | {
      isInterstitial: true;
      decodedActionUrl: string;
    }
  | {
      isInterstitial: false;
    };

export function isInterstitial(url: string | URL): IsInterstitialResult {
  try {
    const urlObj = new URL(url);

    const actionUrl = urlObj.searchParams.get('action');
    if (!actionUrl) {
      return { isInterstitial: false };
    }
    const urlDecodedActionUrl = decodeURIComponent(actionUrl);

    // Validate the decoded action URL
    const decodedActionUrlObj = new URL(urlDecodedActionUrl);

    return {
      isInterstitial: true,
      decodedActionUrl: decodedActionUrlObj.toString(),
    };
  } catch (e) {
    console.error(
      `[@tokenscript/tlinks] Failed to check if URL is interstitial: ${url}`,
      e,
    );
    return { isInterstitial: false };
  }
}
