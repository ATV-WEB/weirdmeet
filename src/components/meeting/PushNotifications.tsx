import { For } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { PushNotification } from './types.js'
import './PushNotifications.css'

type PushNotificationsProps = {
  notifications: Accessor<PushNotification[]>
}

export default function PushNotifications(props: PushNotificationsProps) {
  return (
    <aside class="push-notifications" aria-live="polite">
      <For each={props.notifications()}>
        {(notification) => <div class="push-notification">{notification.message}</div>}
      </For>
    </aside>
  )
}
