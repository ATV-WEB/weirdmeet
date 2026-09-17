import { For, Show, createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { ChatMessage } from './types.js'
import './ChatPanel.css'
import { createEffect } from 'solid-js'

type ChatPanelProps = {
  onCollapsedChange?: (isCollapsed: boolean) => void
  messages: Accessor<ChatMessage[]>
  onSendMessage: (message: string) => void
}

export default function ChatPanel(props: ChatPanelProps) {
  const [isCollapsed, setIsCollapsed] = createSignal(false)
  const [draft, setDraft] = createSignal('')
  let messagesElement: HTMLDivElement | undefined

  createEffect(() => {
    props.messages()
    if (messagesElement) messagesElement.scrollTop = messagesElement.scrollHeight
  })

  const toggleCollapsed = () => {
    const nextValue = !isCollapsed()
    setIsCollapsed(nextValue)
    props.onCollapsedChange?.(nextValue)
  }

  const submitMessage = (event: SubmitEvent) => {
    event.preventDefault()
    props.onSendMessage(draft())
    setDraft('')
  }

  return (
    <aside class="chat-panel" classList={{ collapsed: isCollapsed() }}>
      <header class="chat-header">
        <h2><img src="/static/icons/chat.png" alt="" /></h2>
        <button type="button" onClick={toggleCollapsed}>
          <img src={isCollapsed() ? '/static/icons/chevron-right.png' : '/static/icons/chevron-left.jpg'} alt="" />
        </button>
      </header>
      <Show when={!isCollapsed()}>
        <div class="chat-messages" ref={messagesElement}>
          <For each={props.messages()}>
            {(chat) => <p><strong>{chat.author}:</strong> {chat.message}</p>}
          </For>
        </div>
        <form class="chat-input" onSubmit={submitMessage}>
          <input
            value={draft()}
            onInput={(event) => setDraft(event.currentTarget.value)}
            placeholder=' '
          />
          <button type="submit"></button>
        </form>
      </Show>
    </aside>
  )
}
