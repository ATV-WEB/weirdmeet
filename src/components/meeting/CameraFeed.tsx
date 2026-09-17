import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { assetUrl } from '../../assets/assetUrl.js'
import './CameraFeed.css'

type CameraFeedProps = {
  cameraEnabled?: boolean
  microphoneEnabled?: boolean
}

export default function CameraFeed(props: CameraFeedProps) {
  let cameraElement: HTMLVideoElement | undefined
  let stream: MediaStream | undefined
  const [cameraError, setCameraError] = createSignal(false)

  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (cameraElement) cameraElement.srcObject = stream
      stream.getVideoTracks().forEach((track) => { track.enabled = props.cameraEnabled !== false })
    } catch {
      setCameraError(true)
    }
  })

  onCleanup(() => stream?.getTracks().forEach((track) => track.stop()))

  createEffect(() => {
    stream?.getVideoTracks().forEach((track) => { track.enabled = props.cameraEnabled !== false })
    stream?.getAudioTracks().forEach((track) => { track.enabled = props.microphoneEnabled === true })
  })

  return (
    <article class="camera-feed">
      <Show when={!cameraError()} fallback={<div class="camera-fallback"><img class="cam-fallback" src={assetUrl('/static/icons/broken.jpg')} /></div>}>
        <video ref={cameraElement} autoplay muted playsinline />
      </Show>
      <div class="participant-label">
        <strong>🫵</strong>
      </div>
    </article>
  )
}
