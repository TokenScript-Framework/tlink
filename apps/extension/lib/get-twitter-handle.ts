export function getTwitterHandle() {
  const profileLink = (
    document.querySelector('[aria-label="Profile"]') as HTMLAnchorElement
  )?.href

  if (!profileLink) return null

  const twitterHandle = profileLink.split("/").pop()
  return twitterHandle
}
