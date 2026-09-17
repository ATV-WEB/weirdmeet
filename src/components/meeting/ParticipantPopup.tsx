import { For } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { Participant, VideoAssignments } from './types.js'
import './ParticipantPopup.css'

type ParticipantPopupProps = {
  participants: Accessor<Participant[]>
  videoAssignments: Accessor<VideoAssignments>
  onClose: () => void
}

export default function ParticipantPopup(props: ParticipantPopupProps) {
  return (
    <div class="participant-popup-backdrop" onClick={props.onClose}>
      <section class="participant-popup" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header>
          <h2>{'🧍'.repeat(props.participants().length)}</h2>
          <button type="button" onClick={props.onClose}>🔻</button>
        </header>
        <ul>
          <For each={props.participants()}>
            {(participant) => {
              const displayName = participant.id === 'you'
                ? participant.name
                : props.videoAssignments()[participant.id]?.username ?? participant.name

              return <li><span class="participant-dot" />{participant.id === 'you' ? '🫵' : displayName}</li>
            }}
          </For>
        </ul>
      </section>
    </div>
  )
}
