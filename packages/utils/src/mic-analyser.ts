export const micAnalysis = (fill: string) => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) throw new TypeError('需要一个canvas对象来绘制声音频谱')
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
    })
    .then((stream) => {
      const audioCtx = new window.AudioContext()
      const analyser = audioCtx.createAnalyser()
      const gainNode = audioCtx.createGain()
      const width = canvas.width
      const height = canvas.height
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      gainNode.connect(audioCtx.destination)
      analyser.fftSize = 2048
      gainNode.gain.value = 0
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      const canvasCtx = canvas.getContext('2d')
      if (!canvasCtx) throw new TypeError('当前环境不支持获取canvas上下文对象')
      canvasCtx.clearRect(0, 0, width, height)

      function draw() {
        requestAnimationFrame(draw)
        analyser.getByteTimeDomainData(dataArray)
        if (!canvasCtx) throw new TypeError('当前环境不支持获取canvas上下文对象')
        canvasCtx.fillStyle = fill || '#0d4f63'
        canvasCtx.fillRect(0, 0, width, height)
        canvasCtx.lineWidth = 3
        canvasCtx.strokeStyle = '#ffffff'
        canvasCtx.beginPath()
        const sliceWidth = (width * 1.0) / bufferLength
        let x = 0
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = (v * height) / 2
          if (i === 0) canvasCtx.moveTo(x, y)
          else canvasCtx.lineTo(x, y)
          x += sliceWidth
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2)
        canvasCtx.stroke()
      }
      draw()
    })
    .catch(console.error)
}
