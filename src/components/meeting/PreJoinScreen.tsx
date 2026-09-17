import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { assetUrl } from '../../assets/assetUrl.js'
import './PreJoinScreen.css'

type PreJoinScreenProps = {
  cameraEnabled: boolean
  microphoneEnabled: boolean
  onCameraChange: (enabled: boolean) => void
  onMicrophoneChange: (enabled: boolean) => void
  onJoin: () => void
}

export default function PreJoinScreen(props: PreJoinScreenProps) {
  let videoElement: HTMLVideoElement | undefined
  let stream: MediaStream | undefined
  const [cameraError, setCameraError] = createSignal(false)
  const [isOpenning, setIsOppening] = createSignal(false);

  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoElement) videoElement.srcObject = stream
      stream.getVideoTracks().forEach((track) => { track.enabled = props.cameraEnabled })
      stream.getAudioTracks().forEach((track) => { track.enabled = props.microphoneEnabled })
    } catch {
      setCameraError(true)
    }
  })

  onCleanup(() => stream?.getTracks().forEach((track) => track.stop()))

  const toggleCamera = () => {
    const enabled = !props.cameraEnabled
    props.onCameraChange(enabled)
    stream?.getVideoTracks().forEach((track) => { track.enabled = enabled })
  }

  const toggleMicrophone = () => {
    const enabled = !props.microphoneEnabled
    props.onMicrophoneChange(enabled)
    stream?.getAudioTracks().forEach((track) => { track.enabled = enabled })
  }

  return (
    <main class="pre-join">
      <section class={"pre-join-card" + (isOpenning() ? ' openning' : '')}>
        <div class="pre-join-preview">
          <Show when={!cameraError() && props.cameraEnabled} fallback={<div class="pre-join-camera-off"></div>}>
            <video ref={videoElement} autoplay muted playsinline />
          </Show>
          <span class="pre-join-name">🫵</span>
        </div>
        <div class="pre-join-actions">
          <button type="button" classList={{ active: props.microphoneEnabled }} onClick={toggleMicrophone}>
            <img src={assetUrl(props.microphoneEnabled ? '/static/icons/microphone-on.png' : '/static/icons/microphone-off.png')} alt="" />
          </button>
          <button type="button" classList={{ active: props.cameraEnabled }} onClick={toggleCamera}>
            <img src={assetUrl(props.cameraEnabled ? '/static/icons/camera-on.png' : '/static/icons/camera-off.png')} alt="" />
          </button>
        </div>
        <button class="join-button" type="button" onClick={() => {
          setIsOppening(true);
          props.onJoin()
        }}><img src={assetUrl('/static/icons/join.png')} alt="" /></button>
      </section>
    </main>
  )
}
