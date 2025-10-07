import { useContext } from "react"
import { NetworkingContext } from "./State/NetworkingContext";

import NetworkingDisplaySetup from "./NetworkingDisplaySetup";
import NetworkingClientSetup from "./NetworkingClientSetup";

export const NetworkingSetup = (props) => {
  const {conn, setConn, setNewestConn, hostPeerIDPrefix} = useContext(NetworkingContext);

  const makeDisplay = () => {
    props.setIsDisplay(true);
    setConn([]);
  }
  const makePlayer = () => {
    props.setIsDisplay(false)
    setConn(null);
  }

  return (
    <>
      {conn == null && <button onClick={makeDisplay}>Be the Display</button>}
      {conn == null && <button onClick={makePlayer}>Be a player</button>}
      {props.isDisplay == true && <NetworkingDisplaySetup setNewestConn={setNewestConn} hostPeerIDPrefix={hostPeerIDPrefix} conn={conn} />}
      {(props.isDisplay == false/* && conn == null */) && <NetworkingClientSetup setNewestConn={setNewestConn} hostPeerIDPrefix={hostPeerIDPrefix} conn={conn} />}
    </>
  )
}




export default NetworkingSetup