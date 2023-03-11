import { Icon } from '@/components'
import { Switch } from 'antd'
import React, { memo } from 'react'
import { useIconAnimation } from './useAlarmAnimation'
interface Props {
  name: string
  icon: string
  checked?: boolean
  loading?: boolean
  disabled?: boolean
  onChange: (e: boolean) => void
  type?: 'storage' | 'alarm' | 'drive'
}
export const FunctionButton = memo(({ name, icon, onChange, checked, loading, type = 'alarm', disabled }: Props) => {
  const onNum = useIconAnimation(checked)

  return (
    <div
      className={`py-3 pl-4 pr-3 border-[1px] rounded-lg shadow-md transition-all duration-300 ease-in will-change-auto
     shadow-[rgba(190,199,221,0.35)] w-[124px] h-[76px] mb-4 last:mb-0 border-solid
     ${checked ? 'bg-[#5F86E9] border-[#ECF0FB] text-white' : 'bg-[rgba(249,251,255,0.8)] border-[#DFE4F1]'}
    ${disabled ? 'bg-[rgba(236,236,236,0.8)] shadow-[rgba(194,194,194,0.35)] border-[#CFCFCF]' : ''}`}
    >
      <span className="flex items-center justify-between">
        <Icon
          name={checked ? (type === 'alarm' ? `${icon}-on${(onNum % 2) + 1}` : `${icon}-on`) : icon}
          className="w-[24px] h-[24px] transition-all duration-300 ease-in-out will-change-auto"
        />
        <Switch
          checked={checked}
          onChange={onChange}
          loading={loading}
          checkedChildren="开"
          unCheckedChildren="关"
          defaultChecked={false}
          disabled={disabled}
        />
      </span>
      <span className="text-xs mt-[6px]">{name}</span>
    </div>
  )
})
