import constants from "./constants";
import axios from "axios";

export const getChatRooms = () =>
  axios.get(`${constants.API_PATH}/chatroom/chatrooms`);

export const getChatRoomMessages = (chatRoomName) =>
  axios.get(`${constants.API_PATH}/chatroom/chatroom/messages/${chatRoomName}`);

export const joinRoom = (room) =>
  axios.post(`${constants.API_PATH}/chatroom/chatroom`, { room });
