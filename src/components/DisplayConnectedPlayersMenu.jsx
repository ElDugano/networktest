import { useContext } from "react"
import { NetworkingContext } from "./State/NetworkingContext";

export default function DisplayConnectedPlayersMenu() {
  const {conn, disconnectedPlayers} = useContext(NetworkingContext);
  let content = []
  disconnectedPlayers.forEach((element, player) => {
    if (disconnectedPlayers[player] == true) {
      console.log("####we got one####");
      content.push(<div style={{"color":"red"}}>Player {player} - {conn[player].peer}</div>)
    }
    else
      content.push(<div>Player {player} - {conn[player].peer}</div>)
  });
  return(
    <div>
      Hello World.
      {content}
      <button onClick={() => {console.log(conn)}}>Click me</button>
    </div>
  )
}