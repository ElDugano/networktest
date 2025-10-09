import NetworkingHostSetup from "./NetworkingHostSetup";
import NetworkingClientSetup from "./NetworkingClientSetup";

export const NetworkingSetup = (props) => {
  const hostPeerIDPrefix = "elduganocatangame-"

  const makeHost = () => {
    props.setIsHost(true);
  }
  const makeClient = () => {
    props.setIsHost(false)
  }

  return (
    <>{props.isHost}
      {props.isHost == null && <button onClick={makeHost}>Be the Display</button>}
      {props.isHost == null && <button onClick={makeClient}>Be a player</button>}
      {props.isHost == true && <NetworkingHostSetup hostPeerIDPrefix={hostPeerIDPrefix} />}
      {(props.isHost == false/* && conn == null */) && <NetworkingClientSetup hostPeerIDPrefix={hostPeerIDPrefix} />}
    </>
  )
}




export default NetworkingSetup