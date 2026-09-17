import { videoMetadata } from '../videometadata.js'

export type Participant = {
  id: string
  name: string
}

export type VideoMetadata = (typeof videoMetadata)[number]

export type PushNotification = {
  id: number
  message: string
}

export type ChatMessage = {
  id: number
  author: string
  message: string
}

export type VideoAssignments = Record<string, VideoMetadata>
