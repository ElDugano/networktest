import { useState, useEffect } from "react";
import { NetworkingClientContext } from "./NetworkingClientContext";

import { NetworkingClientMessageSender } from "./messageSender/NetworkingClientMessageSender"
import ClientPing from "./messageSender/ClientPing";

export const NetworkingClient = (props) => {
  const [newestConn, setNewestConn] = useState(null);
  const [conn, setConn] = useState(null);

  const [recievedMessages, setRecievedMessages] = useState(null);
  const [recievedPing, setRecievedPing] = useState([]);

  useEffect(() => {
    const clearMessage = () => {
      if (recievedMessages != null) {
        setRecievedMessages(null);
      }
    }
    if(newestConn != null) {
      newestConn.on('open', function() {
        // Receive messages
        newestConn.on('data', function(data,) {
          console.log("I got this data:",data);
          if ("header" in data && data.header == props.pingHeader)
            setRecievedPing(true)
          else
            setRecievedMessages(data);
        });
        // Send a test message
        newestConn.send({message: "I am a player who has just joined the game!"});
      });
      setConn(newestConn);
      setNewestConn(null);
    }
    clearMessage();
  }, [conn, props, newestConn, recievedMessages, recievedPing]);

  //const getMessageHeader = () => props.getMessageHeader;
  const getMessageHeader = () => {
    if (recievedMessages != null) {
      if ("header" in recievedMessages)
        return recievedMessages.header;
      return true; //True, there is a message.
    }
      return false; //False, there is no message.
  }

  return <NetworkingClientContext.Provider value={{
    conn,
    setConn,
    setNewestConn,
    recievedMessages,
    getMessageHeader
  }}>
    <NetworkingClientMessageSender numberOfClients={conn != null ? conn.length : 0}>
      <ClientPing pingHeader={props.pingHeader} recievedPing={recievedPing} setRecievedPing={setRecievedPing} />
      {props.children}
    </NetworkingClientMessageSender>
  </NetworkingClientContext.Provider>
}