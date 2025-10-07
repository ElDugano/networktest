import { useContext } from "react";

import NetworkingMessageReciever from "./NetworkingMessageReciever";

import { GameStateContext } from "../../../state/gameState/GameStateContext";
import { TurnStateContext } from "../../../state/turnState/TurnStateContext";

import { ScoreBoardContext } from "../../../state/scoreBoard/ScoreBoardContext";
import { CurrentPlayerTurnContext } from "../../../state/currentPlayerTurn/CurrentPlayerTurnContext";
import { PlayerAvailableBuildingsContext } from "../../../state/playerAvailableBuildings/PlayerAvailableBuildingsContext";
import { PlayerResourceCardsContext } from "../../../state/playerResourceCards/PlayerResourceCardsContext";
import { PlayerInformationContext } from "../../../state/playerInformation/PlayerInformationContext";
import { DiceContext } from "../../../state/dice/DiceContext";
import { DevelopmentCardsContext } from "../../../state/developmentCards/DevelopmentCardsContext";

import { TileCornerNodesContext } from "../../gameboard/state/tileCornerNodes/TileCornerNodesContext";
import { LandTilesContext } from "../../gameboard/state/landTiles/LandTilesContext";
import { PortTilesContext } from "../../gameboard/state/portTiles/PortTilesContext";
import { LandTileNumbersContext } from "../../gameboard/state/landTileNumbers/LandTileNumbersContext";
import { PortOwnerContext } from "../../../state/portOwner/PortOwnerContext";
import { ThiefLocationContext } from "../../gameboard/state/thiefLocation/ThiefLocationContext";

import checkIfSettlmentSplitLongestRoad from "../../gameboard/helpers/CheckIfSettlmentSplitLongestRoad";
import mapTileTypeToResourceType from "../../../helpers/turnState/MapTileTypeToResourceType";

import { NetworkingMessageSenderContext } from "./NetworkingMessageSenderContext";
import findThePlayersLongestRoad from "../../gameboard/helpers/FindLongestRoad";
import { PortTiles } from "../../gameboard/state/portTiles/PortTiles";

//import BuildSettlement from "./buildSettlement";

const HostNetworkingFunctions = () => {
  const { isGameStateBoardSetup,
          setGameStateToBoardSetup,
          setGameStateToMainGame,
          setGameStateToGameOver }= useContext(GameStateContext);
    //Currently gets stuck here because this isn't a react component. This is being called like a regular function
  const { //turnState,
          setTurnStateToIdle,
          setClientTurnStateToIdle,
          setClientTurnStateToBuildingARoad,
          isClientTurnStateBuildingARoad,
          setClientTurnStateToBuildingASettlement,
          setClientTurnStateToRollingTheDice,
          setTurnStateToRemoveHalfResources,
          setClientTurnStateToMoveTheThief,
          setTurnStateToRobAPlayer,
          setClientTurnStateToReviewingTradeOffer }= useContext(TurnStateContext);
  const { setAPlayersColor, setAPlayerName } = useContext(PlayerInformationContext);
  const { scorePoint,
          checkIfLongestRoad,
          setLongestRoad,
          longestRoadOwner,
          checkIfLargestArmy,
          addPointsToPlayerHiddenPoints,
          winner } = useContext(ScoreBoardContext);
  const { currentPlayerTurn,
          numberOfPlayers,
          playerOrder,
          gotoNextPlayerTurn,
          gotoPreviousPlayerTurn,
          nextPlayerTurn,
          previousPlayerTurn,
          isPlayerOrderArrayPositionEnd,
          isPlayerOrderArrayPositionStart } = useContext(CurrentPlayerTurnContext);
  const { returnUsedRoads,
          returnAvailableSettlements,
          removeSettlementFromAvailableBuildings,
          removeCityFromAvailableBuildings,
          removeRoadFromAvailableBuildings } = useContext(PlayerAvailableBuildingsContext);
  const { addCollectionOfResourcesToPlayer,
          removePlayerResourcesToBuildRoad,
          removePlayerResourcesToBuildSettlement,
          removePlayerResourcesToBuildCity,
          removePlayerResourcesToBuildDevelopmentCard,
          findAndSetDiscardHalfResourcesPlayers,
          findAndSetDiscardHalfResourcesCardAmount,
          updateDiscardHalfResourcesPlayers,
          removeCollectionOfResourcesFromPlayer,
          setAndReturnRobbingTargetPlayers,
          addResourcesFromDiceRollToPlayerResourceCards,
          stealRandomCardFromPlayer,
          updateTradeOffer,
          tradeResources,
          monopolizeResource }  = useContext(PlayerResourceCardsContext);

  const { tileCornerNodes,
          setNodeValueToSettlement,
          setNodeValueToCity,
          setNodeRightRoadOwner,
          setNodeBottomRoadOwner,
          isNodeValueSettlement,
          isNodeValueCity,
          getTileNodeOwner } = useContext(TileCornerNodesContext);
  const { landTileNumbers } = useContext(LandTileNumbersContext);
  const { landTiles,
          desertLocation } = useContext(LandTilesContext);
  const { setPortOwner } = useContext(PortOwnerContext);
  const { portTiles } = useContext(PortTilesContext);
  const { thiefLocation,
          setAndReturnThiefLocation } = useContext(ThiefLocationContext);
  const { rollDice, setDice, haveDiceBeenRolledThisTurn, setDiceRolledThisTurn, resetDiceRolledThisTurn } = useContext(DiceContext);
  const { givePlayerDevelopmentCardFromDeck,
          makePlayerPurchasedDevelopmentAvailableToPlay,
          getJustPurchasedPlayerVictoryPointCards,
          playKnightDevelopmentCard,
          playYearOfPlentyDevelopmentCard,
          playRoadBuildingDevelopmentCard,
          playMonopolyDevelopmentCard,
          getPlayerArmyStrength } = useContext(DevelopmentCardsContext);

  const { addToMessagePayloadToPlayer, addToMessagePayloadToAllPlayers, sendTheMessages } = useContext(NetworkingMessageSenderContext);

  const selectColor = (player, color) => {
    addToMessagePayloadToAllPlayers(setAPlayersColor(player, color));
    sendTheMessages();
  }

  const setPlayerName = (player, name) => {
    addToMessagePayloadToAllPlayers(setAPlayerName(player, name));
    sendTheMessages();
  }

  const startGame = () => {
    addToMessagePayloadToAllPlayers({ header:"Board Setup" });
    addToMessagePayloadToAllPlayers(setGameStateToBoardSetup());
    addToMessagePayloadToPlayer(setClientTurnStateToBuildingASettlement(), currentPlayerTurn);
    addToMessagePayloadToAllPlayers({ landTileNumbers:landTileNumbers });
    addToMessagePayloadToAllPlayers({ landTiles:landTiles });
    addToMessagePayloadToAllPlayers({ desertLocation:desertLocation });
    addToMessagePayloadToAllPlayers({ portTiles:portTiles });
    addToMessagePayloadToAllPlayers({ thiefLocation:thiefLocation });
    addToMessagePayloadToAllPlayers({ tileCornerNodes:tileCornerNodes });
    addToMessagePayloadToAllPlayers({ setupClientPlayerOrder:playerOrder });
    sendTheMessages();
  }

  const rollTheDice = () => {
    const diceRoll=rollDice();
    if (diceRoll != 7){
      //addToMessagePayloadToAllPlayers(setTurnStateToGatheringResources());
      let playerResourceCardsGained= [{},{},{},{}];
      for (let tileNumber in landTileNumbers[diceRoll]) {
        const landTileX = landTileNumbers[diceRoll][tileNumber].x;
        const landTileY = landTileNumbers[diceRoll][tileNumber].y;
        if (!(landTileX == thiefLocation.x && landTileY == thiefLocation.y)) {
          let landType = landTiles[landTileX][landTileY];
          let resource = mapTileTypeToResourceType(landType);
          for (let x=landTileX-1; x <= landTileX+1; x++) {
            for (let y=landTileY; y <= landTileY+1; y++) {
              if (isNodeValueSettlement(x,y)) {
                if (playerResourceCardsGained[getTileNodeOwner(x, y)][resource])
                  playerResourceCardsGained[getTileNodeOwner(x, y)][resource] = playerResourceCardsGained[getTileNodeOwner(x, y)][resource] + 1;
                else
                  playerResourceCardsGained[getTileNodeOwner(x, y)][resource] = 1;
              }
              if (isNodeValueCity(x,y)) {
                if (playerResourceCardsGained[getTileNodeOwner(x, y)][resource])
                  playerResourceCardsGained[getTileNodeOwner(x, y)][resource] = playerResourceCardsGained[getTileNodeOwner(x, y)][resource] + 2;
                else
                  playerResourceCardsGained[getTileNodeOwner(x, y)][resource] = 2;
              }
            }
          }
        }
      }
      console.log(playerResourceCardsGained);
      addToMessagePayloadToAllPlayers(addResourcesFromDiceRollToPlayerResourceCards(playerResourceCardsGained));
      addToMessagePayloadToAllPlayers(setTurnStateToIdle());
      sendTheMessages();
    }
    else {
      const discardHalfResourcePlayers = findAndSetDiscardHalfResourcesPlayers();
      if(discardHalfResourcePlayers.discardHalfResourcesPlayers.every(val => val === false)) {
        addToMessagePayloadToAllPlayers(setClientTurnStateToMoveTheThief());
      }
      else {
        addToMessagePayloadToAllPlayers(setTurnStateToRemoveHalfResources());
        addToMessagePayloadToAllPlayers(discardHalfResourcePlayers);
        addToMessagePayloadToAllPlayers(findAndSetDiscardHalfResourcesCardAmount());
      }
    }
    addToMessagePayloadToAllPlayers({diceRolledThisTurn:true});
    sendTheMessages();
  }

  const buildSettlement = (x, y) => {
    addToMessagePayloadToAllPlayers({header:"Building a Settlement"});
    addToMessagePayloadToAllPlayers(setNodeValueToSettlement(x, y, currentPlayerTurn));
    addToMessagePayloadToAllPlayers(scorePoint(currentPlayerTurn));
    //console.log(scorePoint(currentPlayerTurn));
    if ("port" in tileCornerNodes[x][y]){
      addToMessagePayloadToAllPlayers(setPortOwner(currentPlayerTurn, tileCornerNodes[x][y].port));
    }
    addToMessagePayloadToAllPlayers(removeSettlementFromAvailableBuildings(x, y, currentPlayerTurn));
    addToMessagePayloadToAllPlayers({lastBuiltObject:{value: "Settlement", player:currentPlayerTurn,x: x, y: y}})//TODO, see if there is a better way to handle this.
    if (currentPlayerTurn != longestRoadOwner){
      checkIfSettlmentSplitLongestRoad(tileCornerNodes, x, y, longestRoadOwner, numberOfPlayers, setLongestRoad);
    }//TODO: Above with splitting the road needs to be sent and updated score, likely.
    if(isGameStateBoardSetup() && returnAvailableSettlements(currentPlayerTurn) == 3){
      let resourcesGained = {Wool:0, Lumber:0, Grain:0, Brick:0, Ore:0};
      if((x+y)%2 == 0) {
        if (landTiles[x] && landTiles[x][y-1]) resourcesGained[mapTileTypeToResourceType(landTiles[x][y-1])]++;
        if (landTiles[x-1] && landTiles[x-1][y]) resourcesGained[mapTileTypeToResourceType(landTiles[x-1][y])]++;
        if (landTiles[x+1] && landTiles[x+1][y]) resourcesGained[mapTileTypeToResourceType(landTiles[x+1][y])]++; }
      else {
        if (landTiles[x-1] && landTiles[x-1][y-1]) resourcesGained[mapTileTypeToResourceType(landTiles[x-1][y-1])]++;
        if (landTiles[x+1] && landTiles[x+1][y-1]) resourcesGained[mapTileTypeToResourceType(landTiles[x+1][y-1])]++;
        if (landTiles[x+1] && landTiles[x][y]) resourcesGained[mapTileTypeToResourceType(landTiles[x][y])]++;  }
      addToMessagePayloadToAllPlayers(addCollectionOfResourcesToPlayer(currentPlayerTurn, resourcesGained));
    }
    if(isGameStateBoardSetup()) {
      addToMessagePayloadToPlayer(setClientTurnStateToBuildingARoad(), currentPlayerTurn);
    }
    else{
      addToMessagePayloadToAllPlayers(removePlayerResourcesToBuildSettlement(currentPlayerTurn)); //Should be sent to just the player.
      addToMessagePayloadToPlayer(setTurnStateToIdle(), currentPlayerTurn);
    }
    sendTheMessages();
  }

  const buildRoad = (x, y, direction, clientTurnState) => {
    console.log("We are checking the tileCornerNodes after building a road.")
    if (direction == "right")
      addToMessagePayloadToAllPlayers(setNodeRightRoadOwner(x, y, currentPlayerTurn));
    else// if (direction == "down")
      addToMessagePayloadToAllPlayers(setNodeBottomRoadOwner(x, y, currentPlayerTurn));
    addToMessagePayloadToAllPlayers(removeRoadFromAvailableBuildings(x, y, currentPlayerTurn));
    //addToMessagePayloadToAllPlayers(setTurnStateToIdle());

    addToMessagePayloadToAllPlayers(checkIfLongestRoad(findThePlayersLongestRoad(tileCornerNodes, currentPlayerTurn, returnUsedRoads(currentPlayerTurn)), currentPlayerTurn));
      //We will likely need to do a score check within that.
    if(isGameStateBoardSetup()){
      addToMessagePayloadToPlayer(setClientTurnStateToIdle(), currentPlayerTurn);
      //setTurnStateToIdle();
      if(returnAvailableSettlements(currentPlayerTurn) == 4 && isPlayerOrderArrayPositionEnd()) {
        addToMessagePayloadToPlayer(setClientTurnStateToBuildingASettlement(), currentPlayerTurn);
        console.log("Time to reverse course");
      }
      else if(returnAvailableSettlements(currentPlayerTurn) == 4) {
        addToMessagePayloadToPlayer(setClientTurnStateToBuildingASettlement(), nextPlayerTurn());
        addToMessagePayloadToAllPlayers(gotoNextPlayerTurn());
        console.log("moving forward");
      }
      else if(returnAvailableSettlements(currentPlayerTurn) == 3 && !isPlayerOrderArrayPositionStart()) {
        addToMessagePayloadToPlayer(setClientTurnStateToBuildingASettlement(), previousPlayerTurn());
        addToMessagePayloadToAllPlayers(gotoPreviousPlayerTurn());
        console.log("moving backwards");
      }
      else {
        console.log("^^^^START THE GAME^^^^");
        addToMessagePayloadToAllPlayers(setGameStateToMainGame());
        addToMessagePayloadToPlayer(setClientTurnStateToRollingTheDice(), currentPlayerTurn);//Should this only be sent to plater to start?
      }
    }
    else if (isClientTurnStateBuildingARoad(clientTurnState)) { //Only remove resources if they are building a road normally.
      addToMessagePayloadToPlayer(removePlayerResourcesToBuildRoad(currentPlayerTurn), currentPlayerTurn);
    }
    sendTheMessages();
  }

  const buildCity = (x, y) => {
    addToMessagePayloadToAllPlayers(setNodeValueToCity(x, y));
    addToMessagePayloadToAllPlayers(scorePoint(currentPlayerTurn));
    addToMessagePayloadToAllPlayers(removeCityFromAvailableBuildings(x, y, currentPlayerTurn));
    addToMessagePayloadToAllPlayers(removePlayerResourcesToBuildCity(currentPlayerTurn));
    addToMessagePayloadToPlayer(setTurnStateToIdle(), currentPlayerTurn);

    sendTheMessages();
  }

  const buyDevelopmentCard = () => {
    addToMessagePayloadToPlayer(givePlayerDevelopmentCardFromDeck(currentPlayerTurn), currentPlayerTurn);
    addToMessagePayloadToPlayer(removePlayerResourcesToBuildDevelopmentCard(currentPlayerTurn), currentPlayerTurn);
    addToMessagePayloadToPlayer(setTurnStateToIdle(), currentPlayerTurn);
    sendTheMessages();
  }

  const removeHalfResources = (player, discardingResources) => {
    addToMessagePayloadToAllPlayers(removeCollectionOfResourcesFromPlayer(player, discardingResources));
    let newDiscardHalfResourcesPlayers = updateDiscardHalfResourcesPlayers(player);
    if(newDiscardHalfResourcesPlayers.discardHalfResourcesPlayers.every(val => val === false)) {
      console.log("Okay, we done now.");
      addToMessagePayloadToAllPlayers(setClientTurnStateToMoveTheThief());
    }
    else {
      console.log("Not done yet.");
      addToMessagePayloadToAllPlayers(newDiscardHalfResourcesPlayers);
    }
    sendTheMessages();
  }

  const moveTheThief = (xCoordinate, yCoordinate) => {
    addToMessagePayloadToAllPlayers(setAndReturnThiefLocation({x:xCoordinate, y:yCoordinate}));
    let robbingTargetPlayers = new Array(false,false,false,false);
    for (let x = xCoordinate - 1; x <= xCoordinate + 1; x++) {
      for (let y = yCoordinate; y <= yCoordinate + 1; y++) {
        if (isNodeValueSettlement(x,y) || isNodeValueCity(x,y))
          robbingTargetPlayers[getTileNodeOwner(x,y)] = true;
      }
    }
    addToMessagePayloadToAllPlayers(setAndReturnRobbingTargetPlayers(robbingTargetPlayers));
    addToMessagePayloadToAllPlayers(setTurnStateToRobAPlayer());
    sendTheMessages();
  }

  const stealACard = (victimPlayer) => {
    console.log(currentPlayerTurn, victimPlayer);
    addToMessagePayloadToAllPlayers(stealRandomCardFromPlayer(currentPlayerTurn, victimPlayer));
    if (haveDiceBeenRolledThisTurn())
      addToMessagePayloadToAllPlayers(setTurnStateToIdle());
    else {
      addToMessagePayloadToAllPlayers(setTurnStateToIdle());        //This is Janky and not tested yet. A SendMessagesToAllButPlayer should be written.
      addToMessagePayloadToPlayer(setClientTurnStateToRollingTheDice(), currentPlayerTurn);
    }
    sendTheMessages();
  }

  const nobodyToRob = () => {
    if (haveDiceBeenRolledThisTurn())
      addToMessagePayloadToAllPlayers(setTurnStateToIdle());
    else {
      addToMessagePayloadToAllPlayers(setTurnStateToIdle());        //This is Janky and not tested yet. A SendMessagesToAllButPlayer should be written.
      addToMessagePayloadToPlayer(setClientTurnStateToRollingTheDice(), currentPlayerTurn);
    }
    sendTheMessages();
  }

  const playKnight = () => {
    addToMessagePayloadToAllPlayers(checkIfLargestArmy(currentPlayerTurn, getPlayerArmyStrength(currentPlayerTurn)+1));
    addToMessagePayloadToPlayer(playKnightDevelopmentCard(currentPlayerTurn), currentPlayerTurn);
    sendTheMessages();
  }

  const playYearOfPlenty = (receivingResources) => {
    addToMessagePayloadToPlayer(playYearOfPlentyDevelopmentCard(currentPlayerTurn), currentPlayerTurn);
    addToMessagePayloadToPlayer(addCollectionOfResourcesToPlayer(currentPlayerTurn, receivingResources), currentPlayerTurn);
    sendTheMessages();
  }
  const playRoadBuilder = () => {
    addToMessagePayloadToPlayer(playRoadBuildingDevelopmentCard(currentPlayerTurn), currentPlayerTurn);
    sendTheMessages();
  }
  const playMonopoly = (resource) => {
    addToMessagePayloadToPlayer(playMonopolyDevelopmentCard(currentPlayerTurn), currentPlayerTurn);
    addToMessagePayloadToAllPlayers(monopolizeResource(currentPlayerTurn, resource));
    sendTheMessages();
  }

  //const tradeResourceCards = (giveTradeItem, giveTradeAmount, recieveTradeItem, recieveTradeAmount, tradeTarget) => {
  const tradeResourceCards = (giveTradeItem, recieveTradeItem, tradeTargetPlayer) => {
    let postTradeResources = tradeResources(currentPlayerTurn, giveTradeItem, tradeTargetPlayer, recieveTradeItem);
    addToMessagePayloadToPlayer(postTradeResources, currentPlayerTurn);
    if (tradeTargetPlayer != null)
      addToMessagePayloadToPlayer(postTradeResources, tradeTargetPlayer);
    //Should clear out trade offer, just incase.
    addToMessagePayloadToPlayer(setClientTurnStateToIdle(), currentPlayerTurn);
    sendTheMessages();
  }

   const offerTrade = (giveTradeItem, recieveTradeItem, tradeTargetPlayer) => {
    addToMessagePayloadToPlayer(updateTradeOffer(tradeTargetPlayer, recieveTradeItem, currentPlayerTurn, giveTradeItem), tradeTargetPlayer);
    addToMessagePayloadToPlayer(setClientTurnStateToReviewingTradeOffer(), tradeTargetPlayer);
    sendTheMessages();
   }
   
   const cancelTrade = (player) => {
    //Clear out trade offer.
    addToMessagePayloadToPlayer(setClientTurnStateToIdle(), player)
    sendTheMessages();
   }

  const endTurn = () => {
    const nextPlayer = nextPlayerTurn();
    addToMessagePayloadToAllPlayers(gotoNextPlayerTurn());
    addToMessagePayloadToPlayer(setClientTurnStateToRollingTheDice(), nextPlayer);
    addToMessagePayloadToPlayer(addPointsToPlayerHiddenPoints(nextPlayer, getJustPurchasedPlayerVictoryPointCards(nextPlayer)), nextPlayer);
    //TODO, send hidden points to each player.
    addToMessagePayloadToAllPlayers(makePlayerPurchasedDevelopmentAvailableToPlay(nextPlayer));
    addToMessagePayloadToAllPlayers(resetDiceRolledThisTurn());

    if(winner != null) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log("We have a winner, who is Player "+winner+"!");
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      setGameStateToGameOver();
    }

    sendTheMessages();
  }

  const cheat = (cheatType) => {
    console.log(cheatType);
    if (cheatType == "Give Resources To Current Player") {
      console.log("We are going to cheat real quickly here.");
      addToMessagePayloadToAllPlayers(addCollectionOfResourcesToPlayer(currentPlayerTurn,{Wool:5, Lumber:5, Grain:5, Brick:5, Ore:5}));
    }
    if (cheatType == "Roll 7") {
      setDice([3,4]);
      const discardHalfResourcePlayers = findAndSetDiscardHalfResourcesPlayers();
      if(discardHalfResourcePlayers.discardHalfResourcesPlayers.every(val => val === false)) {
        addToMessagePayloadToAllPlayers(setClientTurnStateToMoveTheThief());
      }
      else {
        addToMessagePayloadToAllPlayers(setTurnStateToRemoveHalfResources());
        addToMessagePayloadToAllPlayers(discardHalfResourcePlayers);
        addToMessagePayloadToAllPlayers(findAndSetDiscardHalfResourcesCardAmount());
      }
      setDiceRolledThisTurn(true);
      addToMessagePayloadToAllPlayers({setDiceRolledThisTurn:true});
    }
    
    sendTheMessages();
  }

  return (
  <>
    <NetworkingMessageReciever
      selectColor = {selectColor}
      setPlayerName = {setPlayerName}
      startGame = {startGame}
      rollTheDice = {rollTheDice}
      buildSettlement = {buildSettlement}
      buildRoad = {buildRoad}
      buildCity = {buildCity}
      buyDevelopmentCard = {buyDevelopmentCard}
      removeHalfResources = {removeHalfResources}
      moveTheThief = {moveTheThief}
      stealACard = {stealACard}
      nobodyToRob = {nobodyToRob}
      playKnight = {playKnight}
      playYearOfPlenty = {playYearOfPlenty}
      playRoadBuilder = {playRoadBuilder}
      playMonopoly = {playMonopoly}
      offerTrade = {offerTrade}
      cancelTrade = {cancelTrade}
      tradeResourceCards = {tradeResourceCards}
      endTurn = {endTurn}

      cheat = {cheat}
    />
    {/*buildSettlementFunction*/}
  </>
  );
}

export default HostNetworkingFunctions;