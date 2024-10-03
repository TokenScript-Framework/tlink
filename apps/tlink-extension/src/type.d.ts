declare module "*.css" {}

interface Window {
  ethereum: {
    request: (args: { method: string; params: any[] }) => Promise<any>
  } & an
}
