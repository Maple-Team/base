import React from 'react'
import './step.less'
const Dot = () => {
  return <i className="w-6 h-6 rounded-full not-italic absolute bg-white leading-6 text-center -left-[36px]" />
}
export const Step = () => {
  return (
    <div className="wrapper">
      <ul>
        <li className="block bg-slate-500 mb-4 pb-10 relative">
          <Dot />1
        </li>
        <li className="block bg-slate-500 mb-4 pb-10 relative">
          <Dot />2
        </li>
        <li className="block bg-slate-500 mb-4 last:mb-0 pb-10 relative">
          <Dot />3
        </li>
      </ul>
    </div>
  )
}
