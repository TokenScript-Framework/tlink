import startCase from 'lodash.startcase'

export const formatTokenScriptTitle = (title: string) => {
  return startCase(title).replace(/Web 3/g, 'Web3')
}
