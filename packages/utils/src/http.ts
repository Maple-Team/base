/**
 * Get Query Params from URL
 */
export const getParameters = (url: string) => {
  url = JSON.parse(
    '{"' + decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
  )
  return JSON.stringify(url)
}
