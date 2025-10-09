import { useContext, useEffect } from "react";
//import { NetworkingContext } from "../NetworkingContext";
import { NetworkingClientContext } from "../NetworkingClientContext";

//This effectively can be placed wherever it is needed.
const ClientMessageReciever = () => {
  //const { recievedMessages, getMessageHeader } = useContext(NetworkingContext);
  const { recievedMessages, getMessageHeader } = useContext(NetworkingClientContext);

  useEffect(() => {
    const messageHeader = getMessageHeader();
    if (messageHeader) {
      console.log('Received the following message:', messageHeader, recievedMessages);
    }
  })
  return <>
  </>
}

export default ClientMessageReciever