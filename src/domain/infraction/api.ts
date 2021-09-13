import axios from "axios"
import type {
	CreateBanParams,
	CreateKickParams,
	CreateMuteParams,
	CreateWarningParams,
	UpdateInfractionParams,
} from "./infraction.types"

const createWarning = (serverId: number, data: CreateWarningParams) => {
	return axios.post(`${API_ROOT}/infractions/warning/${serverId}`, data, {
		withCredentials: true,
	})
}

const createMute = (serverId: number, data: CreateMuteParams) => {
	return axios.post(`${API_ROOT}/infractions/mute/${serverId}`, data, {
		withCredentials: true,
	})
}

const createKick = (serverId: number, data: CreateKickParams) => {
	return axios.post(`${API_ROOT}/infractions/kick/${serverId}`, data, {
		withCredentials: true,
	})
}

const createBan = (serverId: number, data: CreateBanParams) => {
	return axios.post(`${API_ROOT}/infractions/ban/${serverId}`, data, {
		withCredentials: true,
	})
}

const updateInfraction = (
	infractionId: number,
	data: UpdateInfractionParams,
) => {
	return axios.patch(`${API_ROOT}/infractions/${infractionId}`, data, {
		withCredentials: true,
	})
}

const getPlayerInfractions = (platform: string, playerId: string) => {
	return axios.get(`${API_ROOT}/infractions/player/${platform}/${playerId}`, {
		withCredentials: true,
	})
}

const getInfractionById = (id: number) => {
	return axios.get(`${API_ROOT}/infractions/${id}`, {
		withCredentials: true,
	})
}

const deleteInfraction = (id: number) => {
	return axios.delete(`${API_ROOT}/infractions/${id}`, {
		withCredentials: true,
	})
}

export default {
	createWarning,
	createMute,
	createKick,
	createBan,
	updateInfraction,
	getPlayerInfractions,
	getInfractionById,
	deleteInfraction,
}
