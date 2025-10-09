import { useContext } from "react"
import { NetworkingHostMessageSenderContext } from "./networking/messageSender/NetworkingHostMessageSenderContext"

export default function HostMessageMenu() {
  const { addToMessagePayloadToAllPlayers, sendTheMessages } = useContext(NetworkingHostMessageSenderContext);
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