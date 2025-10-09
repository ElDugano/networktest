import { useState, useEffect/*, useContext*/ } from "react"
import { NetworkingContext } from "./NetworkingContext.js";

import { NetworkingMessageSender } from './messageSender/NetworkingMessageSender.jsx'
import  HostPing  from './messageSender/HostPing.jsx'
import  ClientPing  from './messageSender/ClientPing.jsx'

export const Networking = (props) => {
  const [newestConn, setNewestConn] = useState(null);
  const [conn, setConn] = useState(null);

  const [recievedMessages, setRecievedMessages] = useState(null);
  const [recievedMessagesPlayer, setRecievedMessagesPlayer] = useState(null);
  const [recievedPing, setRecievedPing] = useState([]);

  const [reconnectingPlayer, setReconnectingPlayer] = useState(null);
  const [disconnectingPlayer, setDisconnectingPlayer] = useState(null);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);

  const hostPeerIDPrefix = "elduganocatangame-";
  const pingHeader = "Test Still connected Ping"

  useEffect(() => {
    const clearMessage = () => {
      if (recievedMessages != null) {
        setRecievedMessages(null);
        setRecievedMessagesPlayer(null);
        //console.log("I just cleared out the messages I recieved");
      }
    }

    if(newestConn != null) {
      if(props.isHost == true){
        let reconnectingPlayer = null;
        conn.forEach((testConn, connPlayer) => {
          if (testConn.peer == newestConn.peer) { //This is a reconnection.
            reconnectingPlayer = connPlayer;
            console.log("We are reconnecting player "+connPlayer);
          }
        });
        let playerNumber;
        if (reconnectingPlayer == null) {
          playerNumber = conn.length;
          let newDisconnectedPlayers = [...disconnectedPlayers];
          newDisconnectedPlayers.push(false);
          setDisconnectedPlayers(newDisconnectedPlayers);
          console.log("We just set up DisconnectedPlayers:",newDisconnectedPlayers);

          //let newRecievedPing = [...recievedPing];
          //newRecievedPing.push(0);
          //setRecievedPing(newRecievedPing);
          setRecievedPing(prevRecievedPing => {
            let newRecievedPing = [...prevRecievedPing];
            newRecievedPing.push(0);
            return newRecievedPing;
          })
        }
        else {
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
          console.log("When does this get displayed. and PlayerNumber: "+playerNumber)
          newestConn.on('data', function(data,) {
            if ("header" in data && data.header == pingHeader) {
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
      else if(props.isHost == false) {
        //alert("going to open the newestConn.on");
        newestConn.on('open', function() {
          // Receive messages
          newestConn.on('data', function(data,) {
            console.log("I got this data:",data);
            if ("header" in data && data.header == pingHeader)
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

  const getMessageHeader = () => {
    if (recievedMessages != null) {
      if ("header" in recievedMessages)
        return recievedMessages.header;
      return true; //True, there is a message.
    }
      return false; //False, there is no message.
  }

  return <NetworkingContext.Provider value={{
    conn,
    setConn,
    setNewestConn,
    recievedMessages,
    recievedMessagesPlayer,
    getMessageHeader,
    hostPeerIDPrefix,
    setReconnectingPlayer, //This was used to send an updated payload of info to the reconnecting player
    reconnectingPlayer, //This was used to send an updated payload of info to the reconnecting player
    disconnectedPlayers
  }}>
    <NetworkingMessageSender isHost={props.isHost} numberOfClients={conn != null ? conn.length : 0}>
      {props.isHost == true  && <HostPing   pingHeader={pingHeader} recievedPing={recievedPing} setRecievedPing={setRecievedPing} setDisconnectedPlayers={setDisconnectedPlayers} />}
      {props.isHost == false && <ClientPing pingHeader={pingHeader} recievedPing={recievedPing} setRecievedPing={setRecievedPing} />}
      {props.children}
    </NetworkingMessageSender>
  </NetworkingContext.Provider>
}