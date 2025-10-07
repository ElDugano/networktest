import { useContext, useState, useEffect } from "react";
import { NetworkingMessageSenderContext } from "./NetworkingMessageSenderContext"
import { NetworkingContext } from "../State/NetworkingContext";

export const NetworkingMessageSender = ( props ) => {
  const {conn, isDisplay} = useContext(NetworkingContext);
  
  const [messagePayload, setMessagePayload] = useState([]);
  const [sendMessages, setSendMessages] = useState(false);

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
  const sendTheMessages = () => {
    setSendMessages(true);
  }

  useEffect(() => {
    if(sendMessages != false) {
      if (props.isDisplay) {
        messagePayload.forEach((playerMessages, player) => {
          if(conn[player])
            conn[player].send(playerMessages);
        })
      }
      else
        conn.send(messagePayload[0]);
      setSendMessages(false);
      const newArray = Array.from({ length: props.numberOfClients }, () => []);
      setMessagePayload(newArray);
    }

    messagePayload
  }, [conn, sendMessages, isDisplay, messagePayload, props])

  return <NetworkingMessageSenderContext.Provider value={{
      sendObjectToHost,
      addToMessagePayloadToHost,
      addToMessagePayloadToPlayer,
      addToMessagePayloadToAllPlayers,
      sendTheMessages
    }}>
      {props.children}
    </NetworkingMessageSenderContext.Provider>
}

export default NetworkingMessageSender