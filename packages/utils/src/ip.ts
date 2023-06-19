const noop = () => {}

export const getIps = () => {
  const ips = new Set()
  let localConnection: RTCPeerConnection | null
  let remoteConnection: RTCPeerConnection | null
  let sendChannel: RTCDataChannel | null
  let receiveChannel: RTCDataChannel | null

  return new Promise((resolve) => {
    function _closeDataChannels() {
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

    async function onIceCandidate(pc: RTCPeerConnection | null, event: RTCPeerConnectionIceEvent) {
      // @ts-expect-error: fix类型问题
      await getOtherPc(pc)?.addIceCandidate(event.candidate)
      if (event.candidate) {
        const ip = event.candidate.candidate?.split(' ')[4]
        ips.add(ip)
      }
      // closeDataChannels()
    }

    function receiveChannelCallback(event: { channel: RTCDataChannel | null }) {
      receiveChannel = event.channel
      if (receiveChannel) {
        receiveChannel.onmessage = noop
        receiveChannel.onopen = noop
        receiveChannel.onclose = noop
        resolve(ips)
      }
    }
    createConnection()
  })
}
