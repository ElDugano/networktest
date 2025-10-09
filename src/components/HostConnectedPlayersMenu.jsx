import { useContext } from "react"
import { NetworkingHostContext } from "./networking/NetworkingHostContext";

export default function HostConnectedPlayersMenu() {
  const {conn, disconnectedPlayers} = useContext(NetworkingHostContext);
  let content = []
  disconnectedPlayers.forEach((element, player) => {
    if (disconnectedPlayers[player] == true) {
      console.log("####we got one####");
      content.push (
        <div key={crypto.randomUUID()} style={{"color":"red"}}>
          Player {player} - {conn[player].peer}
        </div>
      )
    }
    else
      content.push (
        <div key={crypto.randomUUID()}>
          Player {player} - {conn[player].peer}
        </div>
      )
  });
  return(
    <div>
      Hello World.
      {content}
      <button onClick={() => {console.log(conn)}}>Click me</button>
    </div>
  )
}