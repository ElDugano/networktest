  
  
import { useContext, useEffect } from "react";

import { NetworkingContext } from "../State/NetworkingContext";

import { GameStateContext } from "../../../state/gameState/GameStateContext";
import { TurnStateContext } from "../../../state/turnState/TurnStateContext";

import { LandTileNumbersContext } from "../../gameboard/state/landTileNumbers/LandTileNumbersContext";
import { LandTilesContext } from "../../gameboard/state/landTiles/LandTilesContext";
import { PortTilesContext } from "../../gameboard/state/portTiles/PortTilesContext";
import { ThiefLocationContext } from "../../gameboard/state/thiefLocation/ThiefLocationContext";
import { TileCornerNodesContext } from "../../gameboard/state/tileCornerNodes/TileCornerNodesContext";

import { ScoreBoardContext } from "../../../state/scoreBoard/ScoreBoardContext";

import { CurrentPlayerTurnContext } from "../../../state/currentPlayerTurn/CurrentPlayerTurnContext";
import { PlayerInformationContext } from "../../../state/playerInformation/PlayerInformationContext";
import { PortOwnerContext } from "../../../state/portOwner/PortOwnerContext";
import { PlayerAvailableBuildingsContext } from "../../../state/playerAvailableBuildings/PlayerAvailableBuildingsContext";
import { PlayerResourceCardsContext } from "../../../state/playerResourceCards/PlayerResourceCardsContext";
import { DevelopmentCardsContext } from "../../../state/developmentCards/DevelopmentCardsContext";
import { DiceContext } from "../../../state/dice/DiceContext";

import { NetworkingMessageSenderContext } from "./NetworkingMessageSenderContext";
  
const NetworkReconnectStateUpdate = () => {


  const { gameState,isGameStateGameSetup } = useContext(GameStateContext);  //Now, to simplify, we might just use setStates, not helper functions.
  const { turnState } = useContext(TurnStateContext);
  const { landTileNumbers } = useContext(LandTileNumbersContext);
  const { landTiles, desertLocation} = useContext(LandTilesContext);
  const { portTiles } = useContext(PortTilesContext);
  const { thiefLocation } = useContext(ThiefLocationContext);
  const { tileCornerNodes } = useContext(TileCornerNodesContext);
  const { scoreBoard, /*hiddenPoints, winner, longestRoadOwner, longestRoadDistance, playerLongestRoad*/ } = useContext(ScoreBoardContext);
  const { standardPortOwner, woolPortOwner, grainPortOwner, lumberPortOwner, brickPortOwner, orePortOwner} = useContext(PortOwnerContext);
  const { playerAvailableBuildings, lastBuiltObject } = useContext(PlayerAvailableBuildingsContext);
  const { playerResourceCards,
          previouslyGainedResources,
          discardHalfResourcesPlayers,
          discardHalfResourcesCardAmount,
          robbingTargetPlayers } = useContext(PlayerResourceCardsContext);
  const { playerDevelopmentCardJustPurchased, playerDevelopmentCardHand/*, playerDevelopmentCardPlayed*/ } = useContext(DevelopmentCardsContext);
  const { diceRolledThisTurn } = useContext(DiceContext);
  const { /*playerOrder, currentPlayerTurn,*/ numberOfPlayers/*, playerOrderArrayPosition, clientPlayerNumber*/ } = useContext(CurrentPlayerTurnContext);
  const { playerColor } = useContext(PlayerInformationContext);
  
  const { addToMessagePayloadToPlayer, addToMessagePayloadToAllPlayers, sendTheMessages} = useContext(NetworkingMessageSenderContext);

  const { reconnectingPlayer, setReconnectingPlayer } = useContext(NetworkingContext);

  useEffect(() => {
    if( reconnectingPlayer != null) {
      addToMessagePayloadToPlayer({gameState:gameState}, reconnectingPlayer);
      addToMessagePayloadToPlayer({turnState:turnState}, reconnectingPlayer);
      addToMessagePayloadToPlayer({landTileNumbers:landTileNumbers}, reconnectingPlayer);
      addToMessagePayloadToPlayer({landTiles:landTiles}, reconnectingPlayer);
      addToMessagePayloadToPlayer({desertLocation:desertLocation}, reconnectingPlayer);
      addToMessagePayloadToPlayer({portTiles:portTiles}, reconnectingPlayer);
      addToMessagePayloadToPlayer({thiefLocation:thiefLocation}, reconnectingPlayer);
      addToMessagePayloadToPlayer({tileCornerNodes:tileCornerNodes}, reconnectingPlayer);
      addToMessagePayloadToPlayer({scoreBoard:scoreBoard}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({hiddenPoints:hiddenPoints}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({winner:winner}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({longestRoadOwner:longestRoadOwner}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({longestRoadDistance:longestRoadDistance}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({playerLongestRoad:playerLongestRoad}, reconnectingPlayer);
      addToMessagePayloadToPlayer({standardPortOwner:standardPortOwner}, reconnectingPlayer);
      addToMessagePayloadToPlayer({woolPortOwner:woolPortOwner}, reconnectingPlayer);
      addToMessagePayloadToPlayer({grainPortOwner:grainPortOwner}, reconnectingPlayer);
      addToMessagePayloadToPlayer({lumberPortOwner:lumberPortOwner}, reconnectingPlayer);
      addToMessagePayloadToPlayer({brickPortOwner:brickPortOwner}, reconnectingPlayer);
      addToMessagePayloadToPlayer({orePortOwner:orePortOwner}, reconnectingPlayer);
      addToMessagePayloadToPlayer({playerAvailableBuildings:playerAvailableBuildings}, reconnectingPlayer);
      addToMessagePayloadToPlayer({lastBuiltObject:lastBuiltObject}, reconnectingPlayer);
      addToMessagePayloadToPlayer({playerResourceCards:playerResourceCards}, reconnectingPlayer);
      addToMessagePayloadToPlayer({previouslyGainedResources:previouslyGainedResources}, reconnectingPlayer);
      addToMessagePayloadToPlayer({discardHalfResourcesPlayers:discardHalfResourcesPlayers}, reconnectingPlayer);
      addToMessagePayloadToPlayer({discardHalfResourcesCardAmount:discardHalfResourcesCardAmount}, reconnectingPlayer);
      addToMessagePayloadToPlayer({robbingTargetPlayers:robbingTargetPlayers}, reconnectingPlayer);
      addToMessagePayloadToPlayer({playerDevelopmentCardJustPurchased:playerDevelopmentCardJustPurchased}, reconnectingPlayer);
      addToMessagePayloadToPlayer({playerDevelopmentCardHand:playerDevelopmentCardHand}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({playerDevelopmentCardPlayed:playerDevelopmentCardPlayed}, reconnectingPlayer);
      addToMessagePayloadToPlayer({diceRolledThisTurn:diceRolledThisTurn}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({playerOrder:playerOrder}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({currentPlayerTurn:currentPlayerTurn}, reconnectingPlayer);
      if(isGameStateGameSetup())
        addToMessagePayloadToAllPlayers({numberOfPlayers:numberOfPlayers});
      else
        addToMessagePayloadToPlayer({numberOfPlayers:numberOfPlayers}, reconnectingPlayer);
      addToMessagePayloadToPlayer({playerColor:playerColor}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({playerOrderArrayPosition:playerOrderArrayPosition}, reconnectingPlayer);
      //addToMessagePayloadToPlayer({clientPlayerNumber:clientPlayerNumber}, reconnectingPlayer);

      //addToMessagePayloadToPlayer();
      //addToMessagePayloadToPlayer();
      //addToMessagePayloadToPlayer();
      //addToMessagePayloadToPlayer();
      sendTheMessages();
      setReconnectingPlayer(null)
    }
  },[ reconnectingPlayer,
      setReconnectingPlayer,
      addToMessagePayloadToPlayer,
      addToMessagePayloadToAllPlayers,
      sendTheMessages,
      gameState,
      isGameStateGameSetup,
      turnState,
      landTileNumbers,
      landTiles,
      desertLocation,
      portTiles,
      thiefLocation,
      tileCornerNodes,
      scoreBoard,
      //hiddenPoints,
      //winner,
      //longestRoadOwner,
      //longestRoadDistance,
      //playerLongestRoad,
      standardPortOwner,
      woolPortOwner,
      grainPortOwner,
      lumberPortOwner,
      brickPortOwner,
      orePortOwner,
      playerAvailableBuildings,
      lastBuiltObject,
      playerResourceCards,
      previouslyGainedResources,
      discardHalfResourcesPlayers,
      discardHalfResourcesCardAmount,
      robbingTargetPlayers,
      playerDevelopmentCardJustPurchased,
      playerDevelopmentCardHand,
      //playerDevelopmentCardPlayed,
      diceRolledThisTurn,
      //playerOrder,
      //currentPlayerTurn,
      numberOfPlayers,
      playerColor
      //playerOrderArrayPosition,
      //clientPlayerNumber,
       ])
  return <></>
}

export default NetworkReconnectStateUpdate