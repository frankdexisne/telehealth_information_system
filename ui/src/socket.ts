import openSocket from "socket.io-client";

const ENDPOINT = `${import.meta.env.VITE_WS_HOST}:${
  import.meta.env.VITE_WS_PORT
}`;

const socket = openSocket(ENDPOINT, {
  transports: ["websocket", "polling"],
  auth: {
    token: "Bearer " + localStorage.getItem(import.meta.env.VITE_TOKEN_NAME),
  },
});

export default socket;
