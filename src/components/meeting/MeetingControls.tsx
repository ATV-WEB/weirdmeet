import './MeetingControls.css'

type MeetingControlsProps = {
  microphoneEnabled: boolean
  cameraEnabled: boolean
  volume: number
  onMicrophoneChange: (enabled: boolean) => void
  onCameraChange: (enabled: boolean) => void
  onVolumeChange: (volume: number) => void
  onReaction: () => void
  onParticipants: () => void
  onLeave: () => void
}

export default function MeetingControls(props: MeetingControlsProps) {
  return (
    <footer class="meeting-controls">
      <label class="volume-control">
        <img src="/static/icons/icon1.png" />
        <input
          class="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.volume}
          onInput={(event) => props.onVolumeChange(Number(event.currentTarget.value))}
          aria-label="Volume dos vídeos"
        />
        <img src="/static/icons/icon2.png" />
      </label>
      <button type="button" classList={{ muted: !props.microphoneEnabled }} onClick={() => props.onMicrophoneChange(!props.microphoneEnabled)}>
        <img src={props.microphoneEnabled ? '/static/icons/microphone-on.png' : '/static/icons/microphone-off.png'} alt="" />
      </button>
      <button type="button" classList={{ muted: !props.cameraEnabled }} onClick={() => props.onCameraChange(!props.cameraEnabled)}>
        <img src={props.cameraEnabled ? '/static/icons/camera-on.png' : '/static/icons/camera-off.png'} alt="" />
      </button>
      <button type="button" onClick={props.onReaction} ><img src="/static/icons/reaction.png" alt="" /></button>
      <button type="button" onClick={props.onParticipants} ><img src="/static/icons/participants.png" alt="" /></button>
      <button type="button" class="end-call" onClick={props.onLeave}><img src="/static/icons/leave.png" alt="" /></button>
    </footer>
  )
}
