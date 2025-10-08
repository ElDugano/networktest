import { useState, useEffect/*, useContext*/ } from "react"
import { NetworkingContext } from "./NetworkingContext.js";

import { NetworkingMessageSender } from './messageSender/NetworkingMessageSender.jsx'
import { HostPing } from './messageSender/HostPing.jsx'

export const Networking = (props) => {
  const [newestConn, setNewestConn] = useState(null);
  const [conn, setConn] = useState(null);
  const [recievedMessages, setRecievedMessages] = useState(null);
  const [recievedMessagesPlayer, setRecievedMessagesPlayer] = useState(null);
  const [reconnectingPlayer, setReconnectingPlayer] = useState(null);
  const [disconnectingPlayer, setDisconnectingPlayer] = useState(null);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);
  const hostPeerIDPrefix = "elduganocatangame-";

  
  useEffect(() => {
    const clearMessage = () => {
      if (recievedMessages != null) {
        setRecievedMessages(null);
        setRecievedMessagesPlayer(null);
        console.log("I just cleared out the messages I recieved");
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
        }
        else {
          playerNumber = reconnectingPlayer;
          let newDisconnectedPlayers = [...disconnectedPlayers];
          newDisconnectedPlayers[playerNumber] = false;
          setDisconnectedPlayers(newDisconnectedPlayers);
        }
        newestConn.on('open', function() {
          console.log("When does this get displayed. and PlayerNumber: "+playerNumber)
          newestConn.on('data', function(data,) {
            setRecievedMessages(data);
            setRecievedMessagesPlayer(playerNumber);        
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
            console.log("I recieved something.");
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
  }, [conn, props, newestConn, recievedMessages, disconnectingPlayer, disconnectedPlayers]);

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
      <HostPing isHost={props.isHost} />
      {props.children}
    </NetworkingMessageSender>
  </NetworkingContext.Provider>
}