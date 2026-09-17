import { For, Show } from 'solid-js'
import type { Accessor } from 'solid-js'
import VideoPlayer from '../videoplayer/videoplayer.js'
import { videoMetadata } from '../videometadata.js'
import CameraFeed from './CameraFeed.js'
import PresentationShow from './PresentationShow.js'
import type { Participant, VideoAssignments } from './types.js'
import './MeetingGrid.css'

type MeetingGridProps = {
  participants: Accessor<Participant[]>
  mainSpeakerId: Accessor<string>
  activeSpeaker: Accessor<Participant | undefined>
  videoAssignments: Accessor<VideoAssignments>
  onAudioStateChange: (isPlayingSound: boolean) => void
  onPresentationStateChange: (isPresenting: boolean) => void
  cameraEnabled: boolean
  volume: number
}

export default function MeetingGrid(props: MeetingGridProps) {
  const videosFor = (participantId: string) => {
    const video = props.videoAssignments()[participantId]
    return video ? [video] : videoMetadata
  }

  return (
    <div class="video-stage">
      <article class="speaker-card">
        <Show when={props.activeSpeaker()} fallback={<div class="empty-speaker">Aguardando speaker...</div>}>
          {(speaker) => (
            <PresentationShow
              participantId={() => speaker().id}
              videos={() => videosFor(speaker().id)}
              onAudioStateChange={props.onAudioStateChange}
              onPresentationStateChange={props.onPresentationStateChange}
              volume={props.volume}
            />
          )}
        </Show>
      </article>

      <div class="participant-grid">
        <For each={props.participants()}>
          {(participant) => (
            <Show when={participant.id !== props.mainSpeakerId()}>
              <Show
                when={participant.id === 'you'}
                fallback={
                  <article class="participant-card participant-video-card">
                    <VideoPlayer
                      participantId={participant.id}
                      videos={videosFor(participant.id)}
                      canPlaySound={false}
                      volume={props.volume}
                    />
                  </article>
                }
              >
                <CameraFeed cameraEnabled={props.cameraEnabled} />
              </Show>
            </Show>
          )}
        </For>
      </div>
    </div>
  )
}
