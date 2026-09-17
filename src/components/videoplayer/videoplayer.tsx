import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { videoMetadata } from '../videometadata.js'
import { assetUrl } from '../../assets/assetUrl.js'
import './videoplayer.css'

type VideoMetadata = (typeof videoMetadata)[number]

type VideoPlayerProps = {
  participantId?: string
  mainSpeaker?: boolean
  isSharingScreen?: boolean
  canPlaySound?: boolean
  volume?: number
  videos?: readonly VideoMetadata[]
  onAudioStateChange?: (isPlayingSound: boolean) => void
}

const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i

function isImage(path: string) {
  return imageExtensions.test(path)
}

function chooseRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const availableVideos = () => props.videos ?? videoMetadata
  const [currentVideo, setCurrentVideo] = createSignal<VideoMetadata>()
  const [currentPath, setCurrentPath] = createSignal('')
  const [isSubState, setIsSubState] = createSignal(false)
  const [shouldPlaySound, setShouldPlaySound] = createSignal(false)
  let subStateTimer: ReturnType<typeof setInterval> | undefined
  let subStateTimeout: ReturnType<typeof setTimeout> | undefined
  let audioStateTimeout: ReturnType<typeof setTimeout> | undefined
  let videoElement: HTMLVideoElement | undefined
  let audioContext: AudioContext | undefined
  let audioSource: MediaElementAudioSourceNode | undefined
  let compressor: DynamicsCompressorNode | undefined

  const setupAudioNormalization = (element: HTMLVideoElement) => {
    videoElement = element
    if (typeof AudioContext === 'undefined' || audioSource) return

    try {
      audioContext = new AudioContext()
      audioSource = audioContext.createMediaElementSource(element)
      compressor = audioContext.createDynamicsCompressor()
      compressor.threshold.value = -24
      compressor.knee.value = 30
      compressor.ratio.value = 12
      compressor.attack.value = 0.003
      compressor.release.value = 0.25
      audioSource.connect(compressor).connect(audioContext.destination)
    } catch {
      audioSource?.disconnect()
      compressor?.disconnect()
      void audioContext?.close()
      audioContext = undefined
      audioSource = undefined
      compressor = undefined
    }
  }

  const updateVolume = () => {
    if (videoElement) videoElement.volume = props.volume ?? 1
  }

  const notifyAudioStateChange = (isPlayingSound: boolean) => {
    if (audioStateTimeout) clearTimeout(audioStateTimeout)

    audioStateTimeout = setTimeout(() => {
      props.onAudioStateChange?.(isPlayingSound)
    }, 3000)
  }

  const selectSound = (video: VideoMetadata) => {
    const isPlayingSound = props.canPlaySound === true && video.canPlaySound && Math.random() >= 0.5
    setShouldPlaySound(isPlayingSound)
    notifyAudioStateChange(isPlayingSound)
  }

  const showMainState = () => {
    const video = currentVideo()
    if (!video) return

    if (subStateTimeout) clearTimeout(subStateTimeout)
    setIsSubState(false)
    setCurrentPath(video.path)
  }

  const showSubState = () => {
    const video = currentVideo()
    if (!video || video.subStates.length === 0) return

    const subState = chooseRandom(video.subStates)
    if (!subState) return

    setIsSubState(true)
    setCurrentPath(subState)

    if (isImage(subState)) {
      subStateTimeout = setTimeout(showMainState, 2000)
    }
  }

  const selectVideo = () => {
    const video = chooseRandom(availableVideos())
    if (!video) return

    setCurrentVideo(video)
    setIsSubState(false)
    setCurrentPath(video.path)
  }

  const handleEnded = (event: Event) => {
    const element = event.currentTarget as HTMLVideoElement
    const video = currentVideo()

    if (isSubState()) {
      notifyAudioStateChange(false)
      showMainState()
      return
    }

    if (!video?.loop) {
      element.currentTime = 0
      element.pause()
      notifyAudioStateChange(false)
    }
  }

  onMount(() => {
    subStateTimer = setInterval(() => {
      const video = currentVideo()
      if (!video || isSubState() || video.subStates.length === 0) return

      if (Math.random() < video.frequency) showSubState()
    }, 1000)
  })

  onCleanup(() => {
    if (subStateTimer) clearInterval(subStateTimer)
    if (subStateTimeout) clearTimeout(subStateTimeout)
    if (audioStateTimeout) clearTimeout(audioStateTimeout)
    audioSource?.disconnect()
    compressor?.disconnect()
    void audioContext?.close()
  })

  createEffect(() => {
    if (props.participantId) selectVideo()
  })

  createEffect(() => {
    props.volume
    updateVolume()
  })

  createEffect(() => {
    const path = currentPath()
    const video = currentVideo()
    if (!video || isImage(path)) {
      notifyAudioStateChange(false)
      return
    }

    selectSound(video)
  })

  return (
    <article class="video-player">
      <Show when={currentVideo()}>
        {(video) => (
          <>
            <Show
              when={isImage(currentPath())}
              fallback={
                <video
                  ref={setupAudioNormalization}
                  src={assetUrl(currentPath())}
                  autoplay
                  muted={!shouldPlaySound()}
                  loop={!isSubState() && (video().loop || video().subStates.length > 0)}
                  playsinline
                  onPlay={() => void audioContext?.resume()}
                  onEnded={handleEnded}
                />
              }
            >
              <img src={assetUrl(currentPath())} />
            </Show>
            <div class="video-player-overlay">
              <div>
                <strong>{video().username}</strong>
              </div>
              <Show when={props.isSharingScreen}>
                <span class="video-player-badge"><img class="showing-screen" src={assetUrl('/static/icons/screensharing.gif')} /></span>
              </Show>
            </div>
            <Show when={props.mainSpeaker}>
              <span class="video-player-speaker"><img class="video-player-speaker-img" src={assetUrl('/static/icons/mainspeaker.png')} /></span>
            </Show>
          </>
        )}
      </Show>
    </article>
  )
}
