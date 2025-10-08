import { useContext } from "react";
import { /*useContext,*/ useEffect } from "react";
import { NetworkingContext } from "../NetworkingContext";

import { NetworkingMessageSenderContext } from "../messageSender/NetworkingMessageSenderContext";

const HostMessageReciever = () => {
  const { addToMessagePayloadToPlayer, addToMessagePayloadToAllPlayers, sendTheMessages } = useContext(NetworkingMessageSenderContext);
  const { recievedMessages, recievedMessagesPlayer, getMessageHeader } = useContext(NetworkingContext);

  useEffect(() => {
    //console.log("The message header is: ", recievedMessages.header);
    const messageHeader = getMessageHeader();
    if (messageHeader == "My sweet header") {
      console.log('Received the following message:', messageHeader, recievedMessages);
      console.log("This was sent from Player: "+recievedMessagesPlayer);
    }
    else if (messageHeader) {
      console.log('Received the following message:', recievedMessages);
      console.log("This was sent from Player: "+recievedMessagesPlayer);
    }
  })

  return (<></>)
}

export default HostMessageReciever;