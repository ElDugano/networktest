import './App.css'
import { useState } from 'react';
import NetworkingSetup from './components/NetworkingSetup';
import { Networking } from './components/State/Networking.jsx'

import ClientMessageMenu from './components/ClientMessageMenu.jsx';
import DisplayMessageMenu from './components/DisplayMessageMenu.jsx';
import DisplayConnectedPlayersMenu from './components/DisplayConnectedPlayersMenu.jsx';
import NetworkingMessageReciever from './components/Display/NetworkingMessageReciever.jsx';

function App() {
  const [isDisplay, setIsDisplay] = useState(null);
  console.log("APP")

  return (
    <>
      <h1>Hello World!</h1>
      <Networking isDisplay={isDisplay}>
        <NetworkingSetup isDisplay={isDisplay} setIsDisplay={setIsDisplay} />
        <NetworkingMessageReciever />
        {isDisplay == false && <ClientMessageMenu />}

        {isDisplay == true && <DisplayMessageMenu />}
        {isDisplay == true && <DisplayConnectedPlayersMenu />}
      </Networking>
      <br />

    </>
  )
}

export default App
