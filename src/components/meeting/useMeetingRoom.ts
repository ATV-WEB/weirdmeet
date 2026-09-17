import { createSignal, onCleanup, onMount } from 'solid-js'
import { presetChatMessages, remoteParticipants, you } from './constants.js'
import { assignAvailableVideo, chooseRandom, createVideoAssignments } from './room-utils.js'
import type { ChatMessage, Participant, PushNotification, VideoAssignments } from './types.js'

export function useMeetingRoom() {
  const initialParticipants = [you, ...remoteParticipants.slice(0, 3)]
  const [participants, setParticipants] = createSignal<Participant[]>(initialParticipants)
  const [videoAssignments, setVideoAssignments] = createSignal<VideoAssignments>(
    createVideoAssignments(initialParticipants),
  )
  const [notifications, setNotifications] = createSignal<PushNotification[]>([])
  const [mainSpeakerId, setMainSpeakerId] = createSignal('alex')
  const [mainSpeakerIsQuiet, setMainSpeakerIsQuiet] = createSignal(true)
  const [presentationActive, setPresentationActive] = createSignal(false)
  const [chatMessages, setChatMessages] = createSignal<ChatMessage[]>([])
  let roomTimer: ReturnType<typeof setInterval> | undefined
  let nextNotificationId = 0
  let nextChatMessageId = 0
  const notificationTimers = new Set<ReturnType<typeof setTimeout>>()
  let chatTimer: ReturnType<typeof setTimeout> | undefined

  const randomChatDelay = () => Math.floor(Math.random() * 12000) + 8000

  const pushNotification = (message: string) => {
    const id = nextNotificationId++
    setNotifications((current) => [...current, { id, message }])

    const timer = setTimeout(() => {
      setNotifications((current) => current.filter((notification) => notification.id !== id))
      notificationTimers.delete(timer)
    }, 5000)
    notificationTimers.add(timer)
  }

  const remoteInRoom = () => participants().filter((participant) => participant.id !== you.id)
  const activeSpeaker = () => remoteInRoom().find((participant) => participant.id === mainSpeakerId())
  const displayNameFor = (participant: Participant) =>
    videoAssignments()[participant.id]?.username ?? participant.name

  const sendChatMessage = (author: string, message: string) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    setChatMessages((current) => [
      ...current,
      { id: nextChatMessageId++, author, message: trimmedMessage },
    ])
  }

  const sendRandomChatMessage = () => {
    const candidates = remoteInRoom().filter((participant) => participant.id !== mainSpeakerId())
    const participant = chooseRandom(candidates)
    const message = chooseRandom(presetChatMessages)
    if (participant && message) sendChatMessage(displayNameFor(participant), message)
    chatTimer = setTimeout(sendRandomChatMessage, randomChatDelay())
  }

  const promoteRandomSpeaker = () => {
    if (presentationActive() || !mainSpeakerIsQuiet() || Math.random() < 0.45) return

    const candidates = remoteInRoom().filter((participant) => participant.id !== mainSpeakerId())
    const nextSpeaker = chooseRandom(candidates)
    if (nextSpeaker) {
      setMainSpeakerId(nextSpeaker.id)
      setMainSpeakerIsQuiet(true)
      pushNotification(`${displayNameFor(nextSpeaker)} 🎤`)
    }
  }

  const updateRoom = () => {
    const current = participants()
    const currentRemote = remoteInRoom()
    const shouldJoin = currentRemote.length <= 2 || (currentRemote.length < 5 && Math.random() >= 0.5)

    if (shouldJoin) {
      const absent = remoteParticipants.filter(
        (participant) => !current.some((currentParticipant) => currentParticipant.id === participant.id),
      )
      const joining = chooseRandom(absent)
      if (joining) {
        setParticipants([...current, joining])
        const assignment = assignAvailableVideo(videoAssignments())
        if (assignment) setVideoAssignments((assignments) => ({ ...assignments, [joining.id]: assignment }))
        pushNotification(`${assignment?.username ?? joining.name} ➡️`)
      }
    } else if (currentRemote.length > 2) {
      const removable = currentRemote.filter((participant) => participant.id !== mainSpeakerId())
      const leaving = chooseRandom(removable)
      if (leaving) {
        const leavingName = displayNameFor(leaving)
        setParticipants(current.filter((participant) => participant.id !== leaving.id))
        setVideoAssignments((assignments) => {
          const next = { ...assignments }
          delete next[leaving.id]
          return next
        })
        pushNotification(`${leavingName} ⬅️`)
      }
    }

    if (!presentationActive() && mainSpeakerIsQuiet()) promoteRandomSpeaker()
  }

  onMount(() => {
    roomTimer = setInterval(updateRoom, 30000)
    chatTimer = setTimeout(sendRandomChatMessage, randomChatDelay())
  })

  onCleanup(() => {
    if (roomTimer) clearInterval(roomTimer)
    if (chatTimer) clearTimeout(chatTimer)
    notificationTimers.forEach((timer) => clearTimeout(timer))
  })

  return {
    activeSpeaker,
    chatMessages,
    mainSpeakerId,
    mainSpeakerIsQuiet,
    notifications,
    presentationActive,
    participants,
    setPresentationActive,
    setMainSpeakerIsQuiet,
    sendChatMessage,
    videoAssignments,
  }
}
