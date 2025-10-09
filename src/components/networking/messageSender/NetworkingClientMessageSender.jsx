import { useContext, useState, useEffect } from "react";
import { NetworkingClientMessageSenderContext } from "./NetworkingClientMessageSenderContext"
import { NetworkingClientContext } from "../NetworkingClientContext";

export const NetworkingClientMessageSender = ( props ) => {
  const { conn } = useContext(NetworkingClientContext);
  
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
        let message = messagePayload[0]
        if (!("header" in message))
          message.header = messageHeader;
        conn.send(message);
      setSendMessages(false);
      setMessageHeader("Default Header");
      const newArray = Array.from({ length: props.numberOfClients }, () => []);
      setMessagePayload(newArray);
    }

    //messagePayload //Not sure why this was just here chilling. I removed for now.
  }, [conn, sendMessages, messagePayload, props, messageHeader])

  return <NetworkingClientMessageSenderContext.Provider value={{
      sendObjectToHost,
      addToMessagePayloadToHost,
      addToMessagePayloadToPlayer,
      addToMessagePayloadToAllPlayers,
      setMessageHeader,
      sendTheMessages
    }}>
      {props.children}
    </NetworkingClientMessageSenderContext.Provider>
}

export default NetworkingClientMessageSender