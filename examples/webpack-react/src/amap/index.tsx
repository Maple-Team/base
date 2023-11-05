import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Button } from 'antd'
import { AntDesignOutlined } from '@ant-design/icons'
import { Map, MarkerCluster } from '@pansy/react-amap'

const randomLnglat = () =>
  [100 + Math.random() * 20, 30 + Math.random() * 20] as AMap.MarkerCluster.DataOptions['lnglat']

const randomMarker = (len = 10) =>
  Array(len)
    .fill(true)
    .map((item, index) => ({
      lnglat: randomLnglat(),
      extData: index,
    }))
const data = randomMarker()
/**
 * MarkerCluster组件显隐操作
 */
export default () => {
  const [list, setList] = useState<AnyToFix[]>([])

  useEffect(() => {
    setTimeout(() => {
      setList(data)
    }, 5000)
  }, [])
  const clusterRef = useRef<AMap.MarkerCluster>(null)

  const onToggle = useCallback(() => {
    if (list.length) {
      clusterRef.current?.setData([])
      setList([])
    } else {
      setList(list)
      clusterRef.current?.setData(list)
    }
  }, [list])

  console.log(list.length, clusterRef.current?.getClustersCount(), 'ref')

  return (
    <>
      <Button onClick={onToggle}>{list.length > 0 ? 'hide' : 'show'}</Button>
      <div style={{ height: 500 }}>
        <Map zoom={4}>
          <MarkerCluster
            data={list}
            ref={clusterRef}
            offset={[-16, -16]}
            render={
              <Avatar
                style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                icon={<AntDesignOutlined />}
              />
            }
            renderCluster={({ count, list = [] }) => {
              return <Avatar style={{ backgroundColor: '#87d068' }}>{count}</Avatar>
            }}
          />
        </Map>
      </div>
    </>
  )
}
