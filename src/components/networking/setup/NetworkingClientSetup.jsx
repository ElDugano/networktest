import { useState, useEffect } from 'react'
import Peer from 'peerjs';

export default function NetworkingClientSetup(props) {
  const [ connectionIDInput, setConnectionIDInput] = useState('');
  const [ hostConnectionID, setHostConnectionID] = useState(sessionStorage.getItem("hostConnectionID") != null ? sessionStorage.getItem("hostConnectionID") : "");

  const [ connected, setConnected] = useState(false);
  const [ peer, setPeer ] = useState(null);
  const [ peerID, setPeerID ] = useState(sessionStorage.getItem("peerID"));

  useEffect(() => {
    const reconnect = () => {
      console.log("RECONNECT HAS BEEN CALLED");
      setConnected(false);
      setPeer(null)
    }

    const clearCookiesAndState = () => {
      console.log("LETS CLEAR THESE COOKIES");
      sessionStorage.removeItem('hostConnectionID');
      sessionStorage.removeItem('peerID');
      setConnectionIDInput("");
      setHostConnectionID("");
      setPeerID(null);
      setPeer(null);
      setConnected(false);
    }

    const setupPeer = () => {
      console.log("Starting to connect");
      var newPeer = (peerID == null ? new Peer() : new Peer(peerID));
      newPeer.on('open', function(id) {
        console.log("The peerID is: "+id);
        setPeer(newPeer);
        setPeerID(id);
        sessionStorage.setItem("peerID", id);
      })
    }

    const connSetup = () => {
      peer.on('error', (err) => {
        alert(err.type);//network.
        if (err.type === "network"){
          console.log("GOING TO RECONNECT");
          reconnect();
        }
        if (err.type === "peer-unavailable"){
          clearCookiesAndState();
        }
      })
      let newConn = peer.connect(hostConnectionID);
      props.setNewestConn(newConn);
      setConnected(true);
    }
    //console.log("peer = ", peer);
    //console.log("hostConnectionID = ", hostConnectionID);
    if (peer == null && hostConnectionID != "") {
      //console.log("A");
      setupPeer();
    }
    if (peer != null && hostConnectionID != "" && connected == false) {
      //console.log("B");
      connSetup();
    }

  }, [hostConnectionID, connected, peer, peerID, props]);

  const connectionButton= () => {
    setHostConnectionID(props.hostPeerIDPrefix+connectionIDInput.toUpperCase());
    sessionStorage.setItem('hostConnectionID', props.hostPeerIDPrefix+connectionIDInput.toUpperCase());
  }

  if (peerID == null && hostConnectionID == "")
    return (
  <>
    <h2>Hello Player</h2>
    Input the ID you see on the screen below.<br />
    
    <label>Connection ID: <input style={{textTransform: "uppercase"}} value={connectionIDInput} name="connectionID" onChange={e => setConnectionIDInput(e.target.value)} /></label><br />
    <button onClick={connectionButton}>Connect</button>
  </>
  )
  else if (connected == false && peerID == null && hostConnectionID != "") {
    console.log("Stored hostConnectionID", sessionStorage.getItem("hostConnectionID"));
    console.log("Stored peerID", sessionStorage.getItem("peerID"));
    return (
      <div style={{zIndex:"999", height:"100%", width: "100%",backgroundColor: 'rgba(0, 0, 0, 0.8)', position:"fixed", top:"0", left:"0", margin:"0px"}}>
        <h1 style={{lineHeight:"100vh", width:"100vw", textAlign:"center"}}>CONNECTING</h1>
      </div>
    )
  }
  else if (connected == false && peerID != null) {
    console.log("Stored hostConnectionID", sessionStorage.getItem("hostConnectionID"));
    console.log("Stored peerID", sessionStorage.getItem("peerID"));
    return (
      <div style={{zIndex:"999", height:"100%", width: "100%",backgroundColor: 'rgba(0, 0, 0, 0.8)', position:"fixed", top:"0", left:"0", margin:"0px"}}>
        <h1 style={{lineHeight:"100vh", width:"100vw", textAlign:"center"}}>RECONNECTING</h1>
      </div>
    )
  }
  else
    return <></>;
}