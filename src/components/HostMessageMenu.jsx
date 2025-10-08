import { useContext } from "react"
import { NetworkingMessageSenderContext } from "./networking/messageSender/NetworkingMessageSenderContext"

export default function HostMessageMenu() {
  const { addToMessagePayloadToAllPlayers, sendTheMessages } = useContext(NetworkingMessageSenderContext);
  const sendAMessage = () => {
    //addToMessagePayloadToAllPlayers({textMessage: "HELLO WORLD"});
    //addToMessagePayloadToAllPlayers({textMessage2: "HELLO WORLD2"});
    addToMessagePayloadToAllPlayers("Message");
    sendTheMessages();
  }

  return (
    <div>
      Hello World
      <button onClick={sendAMessage}>
        Message Everyone
      </button>
    </div>
  )
}