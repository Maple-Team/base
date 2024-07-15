import React from 'react'
import { Alert } from 'antd'

export class ErrorBoundary extends React.Component<AnyToFix, { hasError: boolean; stackTrace?: string }> {
  constructor(props: AnyToFix) {
    super(props)
    this.state = { hasError: false, stackTrace: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, stackTrace: error.stack }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    if (process.env.NODE_ENV === 'production') {
      console.debug(error, error.name)
      if (error.name === 'ChunkLoadError') throw error
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return process.env.NODE_ENV === 'development' ? (
        <Alert
          message="出错了"
          description={this.state.stackTrace?.split('\n').map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
          closable
          onClose={() => {
            // 返回
            window.location.assign('/')
          }}
        />
      ) : (
        <Alert
          message="出错了"
          description={[...(this.state?.stackTrace || '').split('\n')].map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
          closable
          onClose={() => {
            // 返回
            window.location.assign('/')
          }}
        />
      )
    }
    return this.props.children
  }
}
