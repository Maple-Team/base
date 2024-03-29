import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { renderToBody } from './render-to-body'

interface ImperativeProps {
  visible?: boolean
  onClose?: () => void
  afterClose?: () => void
}

type TargetElement = ReactElement<ImperativeProps>

/**
 * 命令式handler
 */
export interface ImperativeHandler {
  close: () => void
  replace: (element: TargetElement) => void
}
// FIXME 理解
export function renderImperatively(element: TargetElement) {
  const Wrapper = React.forwardRef<ImperativeHandler>((_, ref) => {
    const [visible, setVisible] = useState(false)
    const closedRef = useRef(false)
    const [elementToRender, setElementToRender] = useState(element)
    const keyRef = useRef(0)
    useEffect(() => {
      if (!closedRef.current) setVisible(true)
      else afterClose()
    }, [afterClose])

    function onClose() {
      closedRef.current = true
      setVisible(false)
      elementToRender.props.onClose?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function afterClose() {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      unmount()
      elementToRender.props.afterClose?.()
    }
    useImperativeHandle(ref, () => ({
      close: onClose,
      replace: (element) => {
        keyRef.current++
        elementToRender.props.afterClose?.()
        setElementToRender(element)
      },
    }))
    return React.cloneElement(elementToRender, {
      ...elementToRender.props,
      key: keyRef.current,
      visible,
      onClose,
      afterClose,
    })
  })
  const wrapperRef = React.createRef<ImperativeHandler>()
  const unmount = renderToBody(<Wrapper ref={wrapperRef} />)
  return {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
    close: async () => {
      if (!wrapperRef.current) {
        // it means the wrapper is not mounted yet, call `unmount` directly
        unmount()
      } else {
        wrapperRef.current?.close()
      }
    },
    replace: (element) => {
      wrapperRef.current?.replace(element)
    },
  } as ImperativeHandler
}
