import { useContext } from "react"
import { NetworkingContext } from "../NetworkingContext";

import NetworkingHostSetup from "./NetworkingHostSetup";
import NetworkingClientSetup from "./NetworkingClientSetup";

export const NetworkingSetup = (props) => {
  const {conn, setConn, setNewestConn, hostPeerIDPrefix} = useContext(NetworkingContext);

  const makeHost = () => {
    props.setIsHost(true);
    setConn([]);
  }
  const makeClient = () => {
    props.setIsHost(false)
    setConn(null);
  }

  return (
    <>
      {conn == null && <button onClick={makeHost}>Be the Display</button>}
      {conn == null && <button onClick={makeClient}>Be a player</button>}
      {props.isHost == true && <NetworkingHostSetup setNewestConn={setNewestConn} hostPeerIDPrefix={hostPeerIDPrefix} conn={conn} />}
      {(props.isHost == false/* && conn == null */) && <NetworkingClientSetup setNewestConn={setNewestConn} hostPeerIDPrefix={hostPeerIDPrefix} conn={conn} />}
    </>
  )
}




export default NetworkingSetup