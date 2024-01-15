import React, { useEffect, useRef, useState } from 'react'
import Videojs, { type VideoJsPlayer } from 'video.js'

const App = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<VideoJsPlayer | null>(null)
  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia()
  //     .then((stream) => {
  //       console.log(stream)
  //     })
  //     .catch((e) => {
  //       console.error(e)
  //     })
  // }, [])

  // useEffect(() => {
  //   // Create a new MediaSource object
  //   const mediaSource = new MediaSource()

  //   // Create an HTML5 audio element
  //   const audioElement = document.createElement('audio')
  //   audioElement.controls = true

  //   // Append the audio element to the document body
  //   document.body.appendChild(audioElement)

  //   // Set the MediaSource object as the source of the audio element
  //   audioElement.src = URL.createObjectURL(mediaSource)

  //   // Handle the 'sourceopen' event of the MediaSource object
  //   mediaSource.addEventListener('sourceopen', () => {
  //     // Create a new SourceBuffer object
  //     const sourceBuffer = mediaSource.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"')

  //     // Fetch the video file
  //     fetch(
  //       'https://sit-remote-drive-vedio.bj.bcebos.com/apppgijmydkq7mz/VIN_REMOTEDRIVE_ROOM/2023-10-28/recording-task-c8c3b3cd-7156-488a-b267-6ba6d7de75ab/test_20231028150845.mp4'
  //     )
  //       .then((response) => {
  //         return response.arrayBuffer()
  //       })
  //       .then((arrayBuffer) => {
  //         // Append the video data to the SourceBuffer
  //         sourceBuffer.appendBuffer(arrayBuffer)
  //       })
  //       .catch(console.error)
  //   })
  // }, [])
  const [ready, setReady] = useState<boolean>()

  useEffect(() => {
    if (!videoRef.current || playerRef.current) return
    playerRef.current = Videojs(
      videoRef.current,
      {
        autoplay: false,
        muted: true,
        controls: true,
        fluid: true,
        loop: false,
        bigPlayButton: false,
        controlBar: {
          children: [
            {
              name: 'volumePanel',
            },
            { name: 'FullscreenToggle' },
          ],
        },
      },
      () => {
        setReady(true)
      }
    )
  }, [])

  // 设置videojs src
  useEffect(() => {
    if (ready && playerRef.current)
      playerRef.current.src({ src: 'http://localhost:3002/play.m3u8', type: 'application/x-mpegURL' })
  }, [ready])

  return (
    <div
      style={{
        margin: '10px',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: 'cyan',
      }}
    >
      <h1>App1</h1>
      <video ref={videoRef} width={600} controls />
    </div>
  )
}

export default App
