import { writable } from "svelte/store"
import type { Theme } from "./theme.types"

export const currentTheme = writable<Theme>(null)
