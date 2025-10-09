import { useContext } from "react";
import { /*useContext,*/ useEffect } from "react";
import { NetworkingHostContext } from "../NetworkingHostContext";

import { NetworkingHostMessageSenderContext } from "../messageSender/NetworkingHostMessageSenderContext";

const HostMessageReciever = () => {
  const { addToMessagePayloadToPlayer, addToMessagePayloadToAllPlayers, sendTheMessages } = useContext(NetworkingHostMessageSenderContext);
  const { recievedMessages, recievedMessagesPlayer, getMessageHeader } = useContext(NetworkingHostContext);

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