const noop = () => {}

export const getIps = () => {
  const ips = new Set<string>()
  let localConnection: RTCPeerConnection | null
  let remoteConnection: RTCPeerConnection | null
  let sendChannel: RTCDataChannel | null
  let receiveChannel: RTCDataChannel | null

  return new Promise<Set<string>>((resolve) => {
    function closeDataChannels() {
      sendChannel?.close()
      receiveChannel?.close()
      localConnection?.close()
      remoteConnection?.close()
      localConnection = null
      remoteConnection = null
    }

    function createConnection() {
      localConnection = new RTCPeerConnection()

      sendChannel = localConnection.createDataChannel('sendDataChannel')

      localConnection.onicecandidate = async (e: RTCPeerConnectionIceEvent) => {
        localConnection && (await onIceCandidate(localConnection, e))
      }
      sendChannel.onopen = noop
      sendChannel.onclose = noop

      remoteConnection = new RTCPeerConnection()

      remoteConnection.onicecandidate = async (e: RTCPeerConnectionIceEvent) => {
        remoteConnection && (await onIceCandidate(remoteConnection, e))
      }
      remoteConnection.ondatachannel = receiveChannelCallback

      localConnection.createOffer().then(gotDescription1, noop)
    }

    async function gotDescription1(desc: RTCSessionDescriptionInit) {
      if (localConnection) await localConnection.setLocalDescription(desc)
      if (remoteConnection && desc) await remoteConnection.setRemoteDescription(desc)
      remoteConnection?.createAnswer().then(gotDescription2, noop)
    }

    async function gotDescription2(desc: RTCSessionDescriptionInit) {
      if (remoteConnection) await remoteConnection.setLocalDescription(desc)
      if (localConnection && desc) await localConnection.setRemoteDescription(desc)
    }

    function getOtherPc(pc: RTCPeerConnection | null) {
      return pc === localConnection ? remoteConnection : localConnection
    }
    /**
 * 解析candidateString获取ip
 *
 * ChatGPT
候选者字符串中包含.local的原因是可能在局域网中使用了mDNS（多播DNS）或其他本地主机发现机制。mDNS是一种用于在局域网中进行主机名解析和服务发现的协议。它允许在本地网络环境中通过主机名进行通信，而不仅仅依赖于传统的DNS解析。
当WebRTC生成ICE候选者时，其中的本地主机标识符（Local Host Identifier）可能使用了局域网中的mDNS或其他本地发现机制生成的标识符。这些标识符以.local结尾，指示这是一个本地网络内的设备。
本地主机标识符在WebRTC中的ICE候选者中通常用于指示本地对等连接的端点，但不提供直接的公共IP地址信息。因此，如果使用.local作为本地主机标识符，它并不表示真实的公共IP地址。
需要注意的是，使用.local作为本地主机标识符可能会导致在公共互联网上无法直接通信。在进行网络通信时，您可能需要进行额外的处理，例如使用mDNS解析或其他机制来获取本地设备的实际IP地址，以便与对等方进行通信。这些具体处理方式可能取决于您的网络环境和应用需求。
 * @param pc
 * @param event
 */
    async function onIceCandidate(pc: RTCPeerConnection | null, event: RTCPeerConnectionIceEvent) {
      await getOtherPc(pc)?.addIceCandidate(event.candidate as RTCIceCandidateInit)
      if (event.candidate) {
        const ip = event.candidate.candidate?.split(' ')[4]
        ips.add(ip)
      }
    }

    function receiveChannelCallback(event: { channel: RTCDataChannel | null }) {
      receiveChannel = event.channel
      if (receiveChannel) {
        receiveChannel.onmessage = noop
        receiveChannel.onopen = noop
        receiveChannel.onclose = noop
        // ip都获取到了，则可以做些清除的操作
        closeDataChannels()
        resolve(ips)
      }
    }
    createConnection()
  })
}
