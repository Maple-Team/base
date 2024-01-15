/**
 * web环境判断
 */
export const canUseDom = !!(
  typeof window !== undefined &&
  typeof document !== undefined &&
  window.document &&
  window.document.createElement
)
