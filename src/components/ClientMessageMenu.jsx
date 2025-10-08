import { useContext } from "react"
import { NetworkingMessageSenderContext } from "./networking/messageSender/NetworkingMessageSenderContext"

export default function ClientMessageMenu() {
  const { addToMessagePayloadToHost, sendTheMessages } = useContext(NetworkingMessageSenderContext);
  const sendAMessage = () => {
    //addToMessagePayloadToHost({textMessage: "HELLO WORLD"});
    //addToMessagePayloadToHost({textMessage2: "HELLO WORLD2"});
    addToMessagePayloadToHost("Message");
    sendTheMessages("My sweet header");
  }

  return (
    <div>
      Hello World
      <button onClick={sendAMessage}>
        Test Message
      </button>
    </div>
  )
}