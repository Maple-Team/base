import React from 'react'

export const RenderComponent = ({ render }: { render: () => JSX.Element }) => {
  return <>{render()}</>
}
