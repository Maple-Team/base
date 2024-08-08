/**
 *
 * @param {ErrorEvent} e
 */
function handleError(e) {
  // prompt user to confirm refresh
  const condition = /Loading (?:CSS\s)?chunk \d+ failed/.test(e.message) || e.error.name === 'ChunkLoadError'
  if (condition) window.location.reload()
}
window.addEventListener('error', handleError)
