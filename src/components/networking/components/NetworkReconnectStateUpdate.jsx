  
  
import { useContext, useEffect } from "react";
import { NetworkingContext } from "../NetworkingContext";
import { NetworkingMessageSenderContext } from "./NetworkingMessageSenderContext";


const NetworkReconnectStateUpdate = () => {


  //const { gameState,isGameStateGameSetup } = useContext(GameStateContext);  //Now, to simplify, we might just use setStates, not helper functions.

  const { addToMessagePayloadToPlayer, addToMessagePayloadToAllPlayers, sendTheMessages} = useContext(NetworkingMessageSenderContext);

  const { reconnectingPlayer, setReconnectingPlayer } = useContext(NetworkingContext);

  useEffect(() => {
    if( reconnectingPlayer != null) {
      //addToMessagePayloadToPlayer({gameState:gameState}, reconnectingPlayer);
    
    }
  },[reconnectingPlayer, setReconnectingPlayer, addToMessagePayloadToPlayer, addToMessagePayloadToAllPlayers, sendTheMessages])
  return <></>
}

export default NetworkReconnectStateUpdate