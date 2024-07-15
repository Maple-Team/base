import { Select } from 'antd'
import React, { useCallback, useState } from 'react'
import { ChildComponent } from './child'

export default () => {
  const [id, setId] = useState<string>()

  const onIdChange = useCallback((value: string) => {
    setId(value)
  }, [])

  console.log('parent id: ', id)

  return (
    <div>
      <Select onChange={onIdChange} placeholder="选择id" className="w-[240px] !mb-7">
        <Select.Option value="1">id1</Select.Option>
        <Select.Option value="2">di2</Select.Option>
      </Select>
      <ChildComponent id={id} />
    </div>
  )
}
