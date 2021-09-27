import { writable } from "svelte/store"
import type { ChatMessage } from "./chat.types"

export const chatMessages = writable([] as ChatMessage[])
