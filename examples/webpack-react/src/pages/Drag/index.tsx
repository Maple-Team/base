/* eslint-disable @typescript-eslint/comma-dangle */
import React, { useCallback, useMemo, useRef, useState } from 'react'
import styles from './index.module.css'

interface ListItem {
  id: number
  name: string
  image: string
}

const COLUMN = 4
const WIDTH = 120
const HEIGHT = 80
const IMAGE_PADDING = 5

const items: ListItem[] = Array.from({ length: 10 }, (_, i) => {
  const id: number = i + 1
  const no = id + Math.floor(Math.random() * 100 + 10)
  const name = `Item ${id}`

  return {
    id,
    name,
    image: `https://picsum.photos/id/${no}/${WIDTH}/${HEIGHT}`,
  }
})

const isEqualBy = <T,>(a: T[], b: T[], key: keyof T) => {
  const aList = a.map((i) => i[key])
  const bList = b.map((i) => i[key])
  let flag = true
  aList.forEach((item, index) => {
    if (item !== bList[index]) flag = false
  })
  return flag
}

const insertBefore = <T,>(list: T[], from: T, to?: T) => {
  const copy = [...list]
  const fromIndex = copy.indexOf(from)
  if (from === to) return copy
  copy.splice(fromIndex, 1)
  const newToIndex = to ? copy.indexOf(to) : -1
  if (to && newToIndex >= 0) copy.splice(newToIndex, 0, from)
  else copy.push(from)

  return copy
}

function App() {
  const [list, setList] = useState<ListItem[]>(items)
  const dragItemRef = useRef<ListItem | null>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  const sortedList = useMemo(() => {
    return list.slice().sort((a, b) => a.id - b.id)
  }, [list])

  const listHeight = useMemo(() => {
    const size = list.length
    return Math.ceil(size / COLUMN) * HEIGHT
  }, [list.length])

  const handleDragStart = useCallback((_e: React.DragEvent<HTMLElement>, item: ListItem) => {
    dragItemRef.current = item
    const el = dropAreaRef.current?.querySelector(`[data-id="${item.id}"]`)
    if (el) el.classList.add(styles['dragging-item'])
  }, [])

  const handleDragEnd = useCallback(() => {
    const item = dragItemRef.current
    if (!item) return
    const el = dropAreaRef.current?.querySelector(`[data-id="${item.id}"]`)
    if (el) el.classList.remove(styles['dragging-item'])
    dragItemRef.current = null
  }, [])

  const updateList = useCallback(
    (clientX: number, clientY: number) => {
      console.log(clientX, clientY)
      const dragRect = dropAreaRef.current?.getBoundingClientRect()
      if (!dragRect) return
      const offsetX = clientX - dragRect.left
      const offsetY = clientY - dragRect.top
      const dragItem = dragItemRef.current
      if (!dragItem || offsetX < 0 || offsetX > dragRect.width || offsetY < 0 || offsetY > dragRect.height) return
      const col = Math.floor(offsetX / WIDTH)
      const row = Math.floor(offsetY / HEIGHT)
      let currentIndex = row * COLUMN + col
      const fromIndex = list.indexOf(dragItem)
      if (fromIndex < currentIndex) currentIndex++
      const currentItem = list[currentIndex]
      const ordered = insertBefore(list, dragItem, currentItem)
      if (isEqualBy(ordered, list, 'id')) return
      setList(ordered)
    },
    [list]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      updateList(e.clientX, e.clientY)
    },
    [updateList]
  )

  return (
    <div
      className={styles.wrapper}
      ref={dropAreaRef}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      style={{ width: COLUMN * (WIDTH + IMAGE_PADDING) + IMAGE_PADDING }}
    >
      <ul className={styles.list} style={{ height: listHeight }}>
        {sortedList.map((item) => {
          // NOTE 计算出新的位置
          const index = list.findIndex((i) => i.id === item.id)
          const row = Math.floor(index / COLUMN)
          const col = index % COLUMN
          return (
            <li
              key={item.id}
              draggable
              className={styles.item}
              style={{
                height: HEIGHT,
                left: col * (WIDTH + IMAGE_PADDING),
                top: row * HEIGHT,
                // position: 'absolute',
                padding: `0 ${IMAGE_PADDING}px`,
              }}
              data-id={item.id}
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <img src={item.image} alt={item.name} width={WIDTH} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
