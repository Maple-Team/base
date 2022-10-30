import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export const useScript = (src: string) => {
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'idle')
  useEffect(() => {
    if (!src) {
      setStatus('idle')
      return
    }
    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement
    if (script) {
      setStatus(script.getAttribute('data-status') as Status)
    } else {
      script = document.createElement('script')
      script.src = src
      script.async = true
      script.setAttribute('data-status', 'loading')
      script.setAttribute('type', 'text/javascript')
      document.body.append(script)

      const setAttributeFromEvent = (event: Event) => {
        script.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error')
        setStatus(script.getAttribute('data-status') as Status)
      }

      script.addEventListener('load', setAttributeFromEvent)
      script.addEventListener('error', setAttributeFromEvent)
    }
    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error')
    }
    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent)
        script.removeEventListener('error', setStateFromEvent)
      }
    }
  }, [src])

  return [status]
}
