import { Show, createEffect, createSignal, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'
import VideoPlayer from '../videoplayer/videoplayer.js'
import type { VideoMetadata } from './types.js'
import { presentationDecks, type PresentationDeck } from './presentations.js'
import './PresentationShow.css'

type PresentationShowProps = {
  participantId: Accessor<string>
  videos: Accessor<readonly VideoMetadata[]>
  onAudioStateChange: (isPlayingSound: boolean) => void
  onPresentationStateChange: (isPresenting: boolean) => void
  volume: number
}

const randomBetween = (minimum: number, maximum: number) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum

export default function PresentationShow(props: PresentationShowProps) {
  const [deck, setDeck] = createSignal<PresentationDeck>()
  const [slideIndex, setSlideIndex] = createSignal(0)
  let slideTimer: ReturnType<typeof setTimeout> | undefined

  const clearSlideTimer = () => {
    if (slideTimer) clearTimeout(slideTimer)
    slideTimer = undefined
  }

  const scheduleNextSlide = () => {
    clearSlideTimer()
    slideTimer = setTimeout(() => {
      const currentDeck = deck()
      if (!currentDeck) return

      const nextIndex = slideIndex() + 1
      if (nextIndex >= currentDeck.slides.length) {
        setDeck(undefined)
        setSlideIndex(0)
        return
      }

      setSlideIndex(nextIndex)
      scheduleNextSlide()
    }, randomBetween(6000, 20000))
  }

  const maybeStartPresentation = () => {
    const nextDeck = Math.random() >= 0.5
      ? presentationDecks[randomBetween(0, presentationDecks.length - 1)]
      : undefined
    setDeck(nextDeck)
    setSlideIndex(0)
    if (nextDeck) scheduleNextSlide()
  }

  createEffect(() => {
    props.participantId()
    clearSlideTimer()
    maybeStartPresentation()
  })

  createEffect(() => {
    props.onPresentationStateChange(Boolean(deck()))
  })

  onCleanup(clearSlideTimer)

  return (
    <div class="presentation-area">
      <Show
        when={deck()}
        fallback={
          <VideoPlayer
            participantId={props.participantId()}
            videos={props.videos()}
            mainSpeaker
            canPlaySound
            onAudioStateChange={props.onAudioStateChange}
            volume={props.volume}
          />
        }
      >
        {(currentDeck) => (
          <>
            <div
              class="presentation-slide"
              classList={{ 'presentation-slide-alt': slideIndex() % 3 === 1, 'presentation-slide-focus': slideIndex() % 3 === 2 }}
              style={{ '--presentation-accent': currentDeck().accent }}
            >
              <p class="presentation-eyebrow">{currentDeck().eyebrow}</p>
              <p class="presentation-counter">
                {slideIndex() + 1} / {currentDeck().slides.length}
              </p>
              <div class="presentation-main">
                <div class="presentation-copy-block">
                  <h2>{currentDeck().slides[slideIndex()].title}</h2>
                  <p class="presentation-copy">{currentDeck().slides[slideIndex()].body}</p>
                </div>
                <div class="presentation-visual" aria-hidden="true">
                  {currentDeck().slides[slideIndex()].visual.split('\n').map((line) => <span>{line}</span>)}
                </div>
              </div>
              <p class="presentation-topic">{currentDeck().topic}</p>
              <Show when={currentDeck().slides[slideIndex()].stat}>
                <p class="presentation-stat">{currentDeck().slides[slideIndex()].stat}</p>
              </Show>
              <div class="presentation-progress">
                <span style={{ width: `${((slideIndex() + 1) / currentDeck().slides.length) * 100}%` }} />
              </div>
            </div>
            <div class="presentation-camera">
              <VideoPlayer
                participantId={props.participantId()}
                videos={props.videos()}
                mainSpeaker
                isSharingScreen
                canPlaySound
                onAudioStateChange={props.onAudioStateChange}
                volume={props.volume}
              />
            </div>
          </>
        )}
      </Show>
    </div>
  )
}
