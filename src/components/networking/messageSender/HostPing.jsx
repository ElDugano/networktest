import { useEffect, useContext, useState } from "react"
import { NetworkingHostContext } from "../NetworkingHostContext";

export default function HostPing(props) {
  const { conn, disconnectedPlayers} = useContext(NetworkingHostContext);
  const [ needToSendPing, setNeedToSendPing ] = useState(false);
  const [ needToCheckPing, setNeedToCheckPing ] = useState(true);

  const secondsBetweenPings = 5;
  const maxMissedPings = 3

  useEffect(() => {
    if (props.recievedPing.length > 0 && needToCheckPing == true) {
      let newRecievedPing = [...props.recievedPing];
      newRecievedPing.forEach((value, index) => {
        newRecievedPing[index]++;
        if(newRecievedPing[index] >= maxMissedPings) {
          console.log("Player "+ index+" has dropped.");
          props.setDisconnectedPlayers(prevDisconnectedPlayers => {
            let newDisconnectedPlayers = [...prevDisconnectedPlayers];
            newDisconnectedPlayers[index] = true;
            return newDisconnectedPlayers;
          });
        }
      })
      props.setRecievedPing(newRecievedPing);
      setNeedToCheckPing(false);
      setTimeout(() => {setNeedToSendPing(true)}, secondsBetweenPings * 1000);
    }
    else if (props.recievedPing.length > 0 && needToSendPing == true) {
      conn.forEach((playerConn, index) => {
        if (disconnectedPlayers[index] != true) {
          playerConn.send({header:props.pingHeader});
        }
      })
      console.log("Sending a ping");
      setNeedToSendPing(false);
      setNeedToCheckPing(true);
    }
  }, [conn, props, disconnectedPlayers, needToSendPing, needToCheckPing])

  return <></>
}