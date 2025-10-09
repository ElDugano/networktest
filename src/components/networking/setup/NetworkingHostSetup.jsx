import { useState, useEffect, useContext } from 'react'
import Peer from 'peerjs';
import { NetworkingHostContext } from '../NetworkingHostContext';

export default function NetworkingHostSetup(props) {
  const [myPeerID, setMyPeerID] = useState(null);
  const { setNewestConn } = useContext(NetworkingHostContext); 

  useEffect(() => {
    if(myPeerID == null) {
      var shortID=makeid(6)
      var newPeer = new Peer(props.hostPeerIDPrefix+shortID);
      let newPeerPromise = new Promise((resolve/*, reject*/) => {
        newPeer.on('open', function(id) {
          console.log("The peerID is: "+id);
          resolve({peer:newPeer,peerId:id});
        });  
      })
      newPeerPromise.then(result =>{
        result.peer.on('connection', function(newConn) {
          console.log("We just connected!");
          setNewestConn(newConn);
          console.log("Their PeerID is:", newConn.peer)
        });
        setMyPeerID(shortID);
        result.peer.on('disconnected', function(){
          console.log("HEY, SOMEONE JUST DISCONNECTED.")
        });
        result.peer.on('close', function(){
          console.log("HEY, SOMEONE JUST CLOSED.")
        });
        result.peer.on('iceConnectionStateChange', (state) => {
          if (state === 'disconnected' || state === 'failed') {
              console.log("We caught the disconnection here, an attempt to reconnect should be trying to happen.");
              //Really, a reconnect should be attempted on the client side, most likely.
          }
        });
        result.peer.on('error', (err) => {
          console.log(err.type);
          if (err.type === 'ice-failed') {
            console.log('ICE failed, attempting to reconnect...');
            setTimeout(() => {
            // Logic to re-establish connection
              console.log("Need to call reconnect function...");
            }, 5000); // Retry after 5 seconds
          }
          console.log("HEY, We got an error.");
          //console.log(err.type);
        });
      });
    }
  }, [myPeerID, props, setNewestConn]);

  const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  return (
    <>
      <h2 style={{userSelect: "all"}}>{myPeerID}</h2>
      Use this code to join the game!
    </>
  )
}