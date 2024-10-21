interface Window {
  ethereum: {
    request: (args: { method: string; params: any[] }) => Promise<any>
  } & any
  tlink: {
    request: (args: { method: string; params: any[] }) => Promise<any>
  } & any
}
