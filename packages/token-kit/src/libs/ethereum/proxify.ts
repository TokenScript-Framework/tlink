let proxyUrl: string | null = 'https://proxy.dial.to'

export function setProxyUrl(url: string): void {
  if (!url) {
    console.warn(
      '[@tokenscript/tlinks] Proxy URL is not set, proxy will be disabled',
    )
    proxyUrl = null
    return
  }

  try {
    new URL(url)
  } catch (e) {
    console.warn('[@tokenscript/tlinks] Invalid proxy URL', e)
    return
  }

  proxyUrl = url
}

export function proxify(url: string): URL {
  url = rewriteUrlIfIpfsUrl(url)
  const baseUrl = new URL(url)
  if (shouldIgnoreProxy(baseUrl)) {
    return baseUrl
  }
  const proxifiedUrl = new URL(proxyUrl!)
  proxifiedUrl.searchParams.set('url', url)
  return proxifiedUrl
}

export function proxifyImage(url: string): URL {
  url = rewriteUrlIfIpfsUrl(url)
  const baseUrl = new URL(url)
  if (shouldIgnoreProxy(baseUrl)) {
    return baseUrl
  }
  const proxifiedUrl = new URL(`${proxyUrl!}/image`)
  proxifiedUrl.searchParams.set('url', url)
  return proxifiedUrl
}

function shouldIgnoreProxy(url: URL): boolean {
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return true
  }
  if (!proxyUrl) {
    return true
  }
  return false
}

function rewriteUrlIfIpfsUrl(url: string) {
  if (!url) {
    return ''
  } else if (url.toLowerCase().startsWith('https://ipfs.io/ipfs')) {
    return url.replace(
      'https://ipfs.io/ipfs',
      'https://gateway.pinata.cloud/ipfs',
    )
  } else if (url.toLowerCase().startsWith('ipfs://ipfs')) {
    return url.replace('ipfs://ipfs', 'https://gateway.pinata.cloud/ipfs')
  } else if (url.toLowerCase().startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
  }
  return url
}
