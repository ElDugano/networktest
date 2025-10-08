import './App.css'
import { useState } from 'react';
import NetworkingSetup from './components/networking/setup/NetworkingSetup.jsx';
import { Networking } from './components/networking/Networking.jsx'

import HostGlobalState from './State/Host/HostGlobalState/HostGlobalState.jsx';

import ClientGlobalState from './State/Client/ClientGlobalState/ClientGlobalState.jsx';

import ClientMessageMenu from './components/ClientMessageMenu.jsx';
import HostMessageMenu from './components/HostMessageMenu.jsx';
import HostConnectedPlayersMenu from './components/HostConnectedPlayersMenu.jsx';
import ClientMessageReciever from './components/networking/messageReciever/ClientMessageReciever.jsx';
import HostMessageReciever from './components/networking/messageReciever/HostMessageReciever.jsx';

function App() {
  const [isHost, setIsHost] = useState(null);

  let appContent = <></>;
  if (isHost == true) {
    appContent = (
      <HostGlobalState>
        <HostMessageMenu />
        <HostConnectedPlayersMenu />
        <HostMessageReciever />
      </HostGlobalState>
    );
  }
  else if (isHost == false) {
    appContent = (
      <ClientGlobalState>
        <ClientMessageMenu />
        <ClientMessageReciever />
      </ClientGlobalState>
    );
  }

  return (
    <>
      <h1>Hello World!</h1>
      <Networking isHost={isHost}>
        <NetworkingSetup isHost={isHost} setIsHost={setIsHost} />
        {appContent}
      </Networking>
    </>
  )
}

export default App
