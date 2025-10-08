import { useEffect, useContext, memo, useRef } from "react"
import { HostPingContext } from "./HostPingContext"
import { NetworkingContext } from "../NetworkingContext";

export const HostPing = memo(( props ) => {
  const { conn, disconnectedPlayers} = useContext(NetworkingContext);

  const secondsBetweenPings = 5;

  let pingInterval = useRef(null);
  useEffect(() => {
    const pingPlayers = () => {
      conn.forEach((playerConn, index) => {
        if (disconnectedPlayers[index] != true)
          playerConn.send({header:"Ping"})
      })
      console.log("Sending a ping");
      pingInterval.current = setTimeout(pingPlayers, secondsBetweenPings * 1000);
    }
    if(props.isHost == true && conn.length > 0)
      pingInterval.current = setTimeout(pingPlayers, secondsBetweenPings * 1000);
    return () => {
      clearTimeout(pingInterval.current);
    };
  }, [conn, props, disconnectedPlayers])

  return <HostPingContext.Provider value={{}}>
      {props.children}
    </HostPingContext.Provider>
});

export default HostPing