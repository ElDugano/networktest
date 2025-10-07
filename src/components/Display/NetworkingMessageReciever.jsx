import { useContext, useEffect } from "react";
import { NetworkingContext } from "../State/NetworkingContext";

//This effectively can be placed wherever it is needed.
const NetworkingMessageReciever = () => {
  const { recievedMessages, recievedMessagesPlayer } = useContext(NetworkingContext);

  useEffect(() => {
    if (recievedMessages != null) {
      console.log("Recieved the below message in the Reciever:");
      console.log('Received:', recievedMessages);
      console.log("This was sent from Player: "+recievedMessagesPlayer);
    }
    if (recievedMessages != null && "textMessage2" in recievedMessages) {
      console.log("Hey man, there was a textMessage2 in that message.");
      console.log("This basically means I should do something specific.");
    }
  })
  return <>
  </>
}

export default NetworkingMessageReciever