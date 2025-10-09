import { useState, useEffect } from "react"
import { NetworkingHostContext } from "./NetworkingHostContext.js";

import { NetworkingHostMessageSender } from './messageSender/NetworkingHostMessageSender.jsx'
import  HostPing  from './messageSender/HostPing.jsx'

export const NetworkingHost = (props) => {
  const [newestConn, setNewestConn] = useState(null);
  const [conn, setConn] = useState([]);

  const [recievedMessages, setRecievedMessages] = useState(null);
  const [recievedMessagesPlayer, setRecievedMessagesPlayer] = useState(null);
  const [recievedPing, setRecievedPing] = useState([]);

  const [reconnectingPlayer, setReconnectingPlayer] = useState(null);
  const [disconnectingPlayer, setDisconnectingPlayer] = useState(null);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);

  useEffect(() => {
    const clearMessage = () => {
      if (recievedMessages != null) {
        setRecievedMessages(null);
        setRecievedMessagesPlayer(null);
      }
    }

    if(newestConn != null) {
        let reconnectingPlayer = null;
        conn.forEach((testConn, connPlayer) => {
          if (testConn.peer == newestConn.peer) { //This is a reconnection.
            reconnectingPlayer = connPlayer;
            console.log("We are reconnecting player "+connPlayer);
          }
        });
        let playerNumber;
        if (reconnectingPlayer == null) {//New Player
          playerNumber = conn.length;
          let newDisconnectedPlayers = [...disconnectedPlayers];
          newDisconnectedPlayers.push(false);
          setDisconnectedPlayers(newDisconnectedPlayers);
          setRecievedPing(prevRecievedPing => {
            let newRecievedPing = [...prevRecievedPing];
            newRecievedPing.push(0);
            return newRecievedPing;
          })
        }
        else {//Reconnecting Player
          playerNumber = reconnectingPlayer;
          let newDisconnectedPlayers = [...disconnectedPlayers];
          newDisconnectedPlayers[playerNumber] = false;
          setDisconnectedPlayers(newDisconnectedPlayers);
          setRecievedPing(prevRecievedPing => {
            let newRecievedPing = [...prevRecievedPing];
            newRecievedPing[playerNumber] = 0;
            return newRecievedPing;
          })
        }
        newestConn.on('open', function() {
          newestConn.on('data', function(data,) {
            if ("header" in data && data.header == props.pingHeader) {
              //setRecievedPingPlayer(playerNumber);
              setRecievedPing(prevRecievedPing => {
                let newRecievedPing = [...prevRecievedPing];
                newRecievedPing[playerNumber] = 0;
                return newRecievedPing;
              })
            }
            else {
              setRecievedMessages(data);
              setRecievedMessagesPlayer(playerNumber);  
            }
          });
          newestConn.send(
            { message:"You have connected to the boardgame!",
              clientPlayerNumber:playerNumber });
          setReconnectingPlayer(playerNumber);
        });
        newestConn.on('error', (err) => {
          console.log(err);
          console.log(err.type);
          if(err.type == "not-open-yet") {
            setDisconnectingPlayer(newestConn.peer);
          }
        });
        newestConn.on("close", () => {
          console.log("Hey man, we see a close right here!");
        })
        newestConn.on("disconnected", () => {
          console.log("Hey man, we see a disconnected right here!");
          //Has not caught anything yet.
        })

        let newConn;
        if(conn == null)
          newConn = newestConn;
        else {
          newConn = [...conn];
          if (reconnectingPlayer == null)
            newConn.push(newestConn);
          else
            newConn[playerNumber] = newestConn;
        }
        setConn(newConn);
        setNewestConn(null);
    }
    if(disconnectingPlayer) {
      //console.log("The player that is not connected is", disconnectingPlayer);
      //console.log(conn);
      setDisconnectingPlayer(null);
      conn.forEach((element, index) => {
        console.log(element.peer);
        if(element.peer == disconnectingPlayer) {
          //console.log("making this update");
          //let newConn = [...conn];
          //newConn.splice(index, 1);
          //setConn(newConn);
          let newDisconnectedPlayers = [...disconnectedPlayers];
          newDisconnectedPlayers[index] = true;
          setDisconnectedPlayers(newDisconnectedPlayers);
        }
      })
    }
    clearMessage();
  }, [conn, props, newestConn, recievedMessages, disconnectingPlayer, disconnectedPlayers, recievedPing]);

  //const getMessageHeader = () => props.getMessageHeader;
  const getMessageHeader = () => {
    if (recievedMessages != null) {
      if ("header" in recievedMessages)
        return recievedMessages.header;
      return true; //True, there is a message.
    }
      return false; //False, there is no message.
  }

  return <NetworkingHostContext.Provider value={{
    conn,
    setConn,
    setNewestConn,
    recievedMessages,
    recievedMessagesPlayer,
    getMessageHeader,
    setReconnectingPlayer, //This was used to send an updated payload of info to the reconnecting player
    reconnectingPlayer, //This was used to send an updated payload of info to the reconnecting player
    disconnectedPlayers
  }}>
    <NetworkingHostMessageSender numberOfClients={conn != null ? conn.length : 0}>
      <HostPing pingHeader={props.pingHeader} recievedPing={recievedPing} setRecievedPing={setRecievedPing} setDisconnectedPlayers={setDisconnectedPlayers} />
      {props.children}
    </NetworkingHostMessageSender>
  </NetworkingHostContext.Provider>
}