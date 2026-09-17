import { videoMetadata } from '../videometadata.js'
import type { Participant, VideoAssignments, VideoMetadata } from './types.js'

export function chooseRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export function createVideoAssignments(participants: readonly Participant[]): VideoAssignments {
  const assignments: VideoAssignments = {}
  const usedPaths = new Set<string>()

  participants.forEach((participant) => {
    const available = videoMetadata.filter((video) => !usedPaths.has(video.path))
    const selected = chooseRandom(available.length > 0 ? available : videoMetadata)
    if (selected) {
      assignments[participant.id] = selected
      usedPaths.add(selected.path)
    }
  })

  return assignments
}

export function assignAvailableVideo(assignments: VideoAssignments): VideoMetadata | undefined {
  const usedPaths = new Set(Object.values(assignments).map((video) => video.path))
  const available = videoMetadata.filter((video) => !usedPaths.has(video.path))
  return chooseRandom(available.length > 0 ? available : videoMetadata)
}
