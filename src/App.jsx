import { useState, useEffect } from 'react'
import './App.css'
import Peer from 'peerjs';

function App() {
  const [myPeerID, setMyPeerID] = useState(null);     //This is the browser's own connection ID.
  const [peer, setPeer] = useState(null);             //Can connect to other peers and listen for connections
  const [newestConn, setNewestConn] = useState(null);
  const [conn, setConn] = useState([]);               //This is the connection to another peer.
  const [isHost, setIsHost] = useState(false);          //This is set to true if the browser is the host.
  const [connectionID, setConnectionID] = useState(""); //This is taken from the input field.

  const hostPeerIDPrefix = "elduganocatangame-";

  useEffect(() => {
    if(newestConn != null){
      const playerNumber = conn.length; //This would want to be more sophisticated, incase a player drops out or something.
            //We might not even really need this, and could just pass in newestConn.peer,
            //Then hold peer names in an array.
      newestConn.on('open', function() {
        // Receive messages
        newestConn.on('data', function(data,) {
          //console.log('Received',newestConn.peer, data);
          console.log('Received from:',playerNumber,'. Message:', data);
        });

        // Send messages
        if (isHost)
          newestConn.send("You listen here, I am the host, so I am the boss. You put in my ID, so I am incharge here!");
        else
          newestConn.send("Hey man, I don't want any trouble, I put your ID into my browser, so I'm listening to you!");
      });
      let newConn = [...conn];
      newConn.push(newestConn);
      setConn(newConn);
      setNewestConn(null);
    }
  }, [myPeerID, conn, newestConn, isHost]);

  const connectionButton= () => {
    //This is the client side.
    console.log("Clicked connection button.");
    //let connectionID = hostPeerIDPrefix+connectionID;
    console.log(hostPeerIDPrefix+connectionID);
    let newConn = peer.connect(hostPeerIDPrefix+connectionID);
    setNewestConn(newConn);
  }
  const sendAnotherMessageButton = () => {
    conn[0].send("Do you read me? You were the first connector.");
    if (conn.length==2)
      conn[1].send("Do you read me? You were the second connector.");
  }

  const setHost = () => {
    let newPeerPromise;
    if(myPeerID == null) {
      var shortID=makeid(6)
      var newPeer = new Peer(hostPeerIDPrefix+shortID);
      newPeerPromise = new Promise((resolve, reject) => {
        newPeer.on('open', function(id) {
          console.log("The peerID is: "+id);
          resolve({peer:newPeer,peerId:id});
        });  
      })
      newPeerPromise.then(result =>{
        result.peer.on('connection', function(newConn) {
          console.log("We just connected!");
          setNewestConn(newConn);
          setIsHost(true);
        });
        setMyPeerID(shortID);
        setPeer(result.peer);
      });
    }
  }
  const setClient = () => {
    if(myPeerID == null) {
      var newPeer = new Peer();
        newPeer.on('open', function(id) {
          console.log("The peerID is: "+id);
        setMyPeerID(id);
        setPeer(newPeer);
      })
    }
  }
  const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

  return (
    <>
      <h1>Hello World</h1>
      <button onClick={setHost}>Be Host</button>
      <button onClick={setClient}>Be Client</button><br />
      {myPeerID}<br />
      <label>Connection ID: <input value={connectionID} name="connectionID" onChange={e => setConnectionID(e.target.value)} /></label><br />
      <button onClick={connectionButton}>Connect</button>
      <button onClick={sendAnotherMessageButton}>Send Another Message</button>
      

      <br />

    </>
  )
}

export default App
