import { For, Show, createSignal, onCleanup } from 'solid-js'
import MeetingGrid from './MeetingGrid.js'
import ChatPanel from './ChatPanel.js'
import PushNotifications from './PushNotifications.js'
import MeetingControls from './MeetingControls.js'
import ParticipantPopup from './ParticipantPopup.js'
import PreJoinScreen from './PreJoinScreen.js'
import { useMeetingRoom } from './useMeetingRoom.js'
import './MeetingRoom.css'

type MeetingRoomProps = {
  title?: string
}

export default function MeetingRoom(props: MeetingRoomProps) {
  const room = useMeetingRoom()
  const [hasJoined, setHasJoined] = createSignal(false)
  const [cameraEnabled, setCameraEnabled] = createSignal(true)
  const [microphoneEnabled, setMicrophoneEnabled] = createSignal(true)
  const [volume, setVolume] = createSignal(0.8)
  const [showParticipants, setShowParticipants] = createSignal(false)
  const [chatCollapsed, setChatCollapsed] = createSignal(false)
  const [reactions, setReactions] = createSignal<number[]>([])
  let nextReactionId = 0
  const reactionTimers = new Set<ReturnType<typeof setTimeout>>()

  const sendReaction = () => {
    const id = nextReactionId++
    setReactions((current) => [...current, id])
    const timer = setTimeout(() => {
      setReactions((current) => current.filter((reactionId) => reactionId !== id))
      reactionTimers.delete(timer)
    }, 2200)
    reactionTimers.add(timer)
  }

  const leaveMeeting = () => {
    setHasJoined(false)
    setShowParticipants(false)
  }

  onCleanup(() => reactionTimers.forEach((timer) => clearTimeout(timer)))

  return (
    <Show
      when={hasJoined()}
      fallback={
        <PreJoinScreen
          cameraEnabled={cameraEnabled()}
          microphoneEnabled={microphoneEnabled()}
          onCameraChange={setCameraEnabled}
          onMicrophoneChange={setMicrophoneEnabled}
          onJoin={() => {
            setTimeout(() => {
              setHasJoined(true);
            }, 1000);
          }}
        />
      }
    >
      <main class="meeting-app">
        <section class="meeting-content" classList={{ 'chat-collapsed': chatCollapsed() }}>
          <MeetingGrid
            participants={room.participants}
            mainSpeakerId={room.mainSpeakerId}
            activeSpeaker={room.activeSpeaker}
            videoAssignments={room.videoAssignments}
            onAudioStateChange={(isPlayingSound) => room.setMainSpeakerIsQuiet(!isPlayingSound)}
            onPresentationStateChange={room.setPresentationActive}
            cameraEnabled={cameraEnabled()}
            volume={volume()}
          />
          <ChatPanel
            messages={room.chatMessages}
            onSendMessage={(message) => room.sendChatMessage('🫵', message)}
            onCollapsedChange={setChatCollapsed}
          />
        </section>

        <MeetingControls
          microphoneEnabled={microphoneEnabled()}
          cameraEnabled={cameraEnabled()}
          volume={volume()}
          onMicrophoneChange={setMicrophoneEnabled}
          onCameraChange={setCameraEnabled}
          onVolumeChange={setVolume}
          onReaction={sendReaction}
          onParticipants={() => setShowParticipants(true)}
          onLeave={leaveMeeting}
        />

        <For each={reactions()}>
          {(reaction) => (
            <div
              class="reaction-bubble"
              style={{ left: `${50 + ((reaction.id % 5) - 2) * 8}%` }}
            >
              <img src="/static/icons/reaction.png" alt="" />
            </div>
          )}
        </For>

        <Show when={showParticipants()}>
          <ParticipantPopup
            participants={room.participants}
            videoAssignments={room.videoAssignments}
            onClose={() => setShowParticipants(false)}
          />
        </Show>

        <Show when={room.notifications().length > 0}>
          <PushNotifications notifications={room.notifications} />
        </Show>
      </main>
    </Show>
  )
}
