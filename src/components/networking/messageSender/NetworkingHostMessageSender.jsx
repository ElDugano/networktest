import { useContext, useState, useEffect } from "react";
import { NetworkingHostMessageSenderContext } from "./NetworkingHostMessageSenderContext"
import { NetworkingHostContext } from "../NetworkingHostContext";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//This should be renamed to be Host
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export const NetworkingHostMessageSender = ( props ) => {
  //console.log("NETWORKING MESSAGE SENDER IS RENDERING.")
  const { conn } = useContext(NetworkingHostContext);
  
  const [messagePayload, setMessagePayload] = useState([]);
  const [sendMessages, setSendMessages] = useState(false);
  const [messageHeader, setMessageHeader] = useState("Default Header");

  const sendObjectToHost = (message) => {
    console.log("We are sending the object ", message);
    setMessagePayload((prevMessages) => {
      let newMessageArray = [...prevMessages];
      newMessageArray[0] = {...newMessageArray[0], ...message}
      return newMessageArray;
    });
  }
  const addToMessagePayloadToHost = (message) => {
    console.log("We are sending the message ", message);
    setMessagePayload((prevMessages) => {
      let newMessageArray = [...prevMessages];
      newMessageArray[0] = {...newMessageArray[0], ...message}
      return newMessageArray;
    });
  }
  const addToMessagePayloadToPlayer = (message, player) => {
    setMessagePayload((prevMessages) => {
      let newMessageArray = [...prevMessages];
      while (newMessageArray.length < props.numberOfClients)
        newMessageArray.push({});
      newMessageArray[player] = {...newMessageArray[player], ...message}
      return newMessageArray;
    });
  }
  const addToMessagePayloadToAllPlayers = (message) => {
    setMessagePayload((prevMessages) => {
      let newMessageArray = [...prevMessages];
      while (newMessageArray.length < props.numberOfClients)
        newMessageArray.push({});
      newMessageArray.forEach((playerMessages, player) => {
        newMessageArray[player] = {...playerMessages, ...message};
      })
      return newMessageArray;
    });
  }
  const sendTheMessages = (newMessageHeader = messageHeader) => {
    setSendMessages(true);
    setMessageHeader(newMessageHeader);
  }

  useEffect(() => {
    if(sendMessages != false) {
      //if (props.isHost) {
        messagePayload.forEach((playerMessages, player) => {
          if(conn[player])
            {
            if (!("header" in playerMessages))
              playerMessages.header = messageHeader;
            conn[player].send(playerMessages);
          }
        })
      //}
      //else {
      //  let message = messagePayload[0]
      //  if (!("header" in message))
      //    message.header = messageHeader;
      //  conn.send(message);
      //}
      setSendMessages(false);
      setMessageHeader("Default Header");
      const newArray = Array.from({ length: props.numberOfClients }, () => []);
      setMessagePayload(newArray);
    }

    messagePayload
  }, [conn, sendMessages, messagePayload, props, messageHeader])

  return <NetworkingHostMessageSenderContext.Provider value={{
      sendObjectToHost,
      addToMessagePayloadToHost,
      addToMessagePayloadToPlayer,
      addToMessagePayloadToAllPlayers,
      setMessageHeader,
      sendTheMessages
    }}>
      {props.children}
    </NetworkingHostMessageSenderContext.Provider>
}

export default NetworkingHostMessageSender