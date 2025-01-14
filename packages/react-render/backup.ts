import ReactDOM from 'react-dom'

let createRoot: typeof import('react-dom/client').createRoot | undefined

try {
  createRoot = require('react-dom/client').createRoot
} catch {
  // React 16/17 环境，没有 createRoot
}

export function render(node: React.ReactElement, container: HTMLElement) {
  if (createRoot) {
    const root = createRoot(container)
    root.render(node)
    return () => root.unmount()
  } else {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(node, container)
    // eslint-disable-next-line react/no-deprecated
    return () => ReactDOM.unmountComponentAtNode(container)
  }
}
