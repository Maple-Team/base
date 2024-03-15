export function progress() {
  // Node.js 环境下模拟 cli-progress 的基本更新原理
  let currentProgress = 0
  const totalSteps = 100
  function increase() {
    currentProgress++
  }
  function tick(num: number) {
    currentProgress = currentProgress + num
  }

  function updateProgress() {
    // 清除当前行并定位到行首
    process.stdout.write('\r')
    // 模拟计算进度值（这里简化为线性递增）
    // currentProgress = (currentProgress + 1) % (totalSteps + 1)

    // 输出模拟的进度条
    const progressPercentage = Math.floor((currentProgress / totalSteps) * 100)
    process.stdout.write(
      `Progress: [${'#'.repeat(currentProgress)}${'.'.repeat(totalSteps - currentProgress)}] ${progressPercentage}%`
    )

    // 若未达到最大进度，则继续更新
    if (currentProgress < totalSteps) {
      setTimeout(updateProgress, 250) // 延迟一段时间后再次更新
    } else {
      // 完成时输出一个新行
      process.exit(0)
    }
  }
  updateProgress()
  return {
    increase,
    tick,
  }
}
