import './App.css'

const participants = [
  { name: 'You', muted: true },
  { name: 'Alex Rivera', muted: false },
  { name: 'Sam Lee', muted: true },
  { name: 'Jordan Kim', muted: false },
]

const chats = [
  { author: 'Alex', message: 'Can everyone see the slide?' },
  { author: 'You', message: 'Yes, looks good on my side.' },
  { author: 'Sam', message: 'Let\'s review sprint blockers next.' },
]

function App() {
  return (
    <main class="meeting-app">
      <header class="meeting-topbar">
        <div>
          <p class="meeting-kicker">weirdmeet</p>
          <h1>Product Sync • Design Review</h1>
        </div>
        <p class="meeting-meta">14:30 • 12 participants • Recording</p>
      </header>

      <section class="meeting-content">
        <div class="video-stage" aria-label="Meeting participants">
          <article class="speaker-card">
            <p class="badge">Presenting</p>
            <h2>Alex Rivera</h2>
            <p>Quarterly roadmap and launch milestones</p>
          </article>

          <div class="participant-grid">
            {participants.map((participant) => (
              <article class="participant-card">
                <div class="avatar">{participant.name.charAt(0)}</div>
                <p>{participant.name}</p>
                <span>{participant.muted ? 'Muted' : 'Live'}</span>
              </article>
            ))}
          </div>
        </div>

        <aside class="chat-panel" aria-label="Meeting chat">
          <h2>In-call chat</h2>
          <div class="chat-messages">
            {chats.map((chat) => (
              <p>
                <strong>{chat.author}:</strong> {chat.message}
              </p>
            ))}
          </div>
          <div class="chat-input" role="presentation">
            <span>Type a message...</span>
          </div>
        </aside>
      </section>

      <footer class="meeting-controls" aria-label="Call controls">
        <button type="button">Mic</button>
        <button type="button">Camera</button>
        <button type="button">Share Screen</button>
        <button type="button">Participants</button>
        <button type="button" class="end-call">
          Leave
        </button>
      </footer>
    </main>
  )
}

export default App
