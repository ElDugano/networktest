import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [myPeerID, setMyPeerID] = useState(null);     //This is the browser's own connection ID.
    const [peer, setPeer] = useState(null);           //This is an object to connect?
  console.log("My Peer ID State is: "+myPeerID);
  console.log("This is what peer is:");
  console.log(peer);


  useEffect(() => {
    if(myPeerID == null) {
      var newPeer = new Peer();
      newPeer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        setMyPeerID(id);
      });
      setPeer(newPeer);
    }
  }, []);

  



  //var conn = null;
  const [conn, setConn] = useState(null);               //This is the connection object.
  const [isHost, setIsHost] = useState(false);          //This is set to true if the browser is the host.
  const [connectionID, setConnectionID] = useState(""); //This is taken from the input field.
  

  if (myPeerID != null) {
    let newConn;
    peer.on('connection', function(newConn) {
      console.log("Waiting for a connection, which should be shown below.");
      console.log(newConn);
      setConn(newConn);
      setIsHost(true);
    });
  }



  console.log("This is what conn is: ");
  console.log(conn);
  if (conn != null) {
    conn.on('open', function() {
      // Receive messages
      conn.on('data', function(data) {
        console.log('Received', data);
      });

      // Send messages
      if (isHost)
        conn.send("You listen here, I am the host, so I am the boss. You put in my ID, so I am incharge here!");
      else
        conn.send("Hey man, I don't want any trouble, I put your ID into my browser, so I'm listening to you!");
    });
  }

  const connectionButton= () => {
    console.log("Clicked connection button.");
    console.log(conn);
    console.log(connectionID);
    let newConn = peer.connect(connectionID);
    console.log(newConn);
    setConn(newConn);
  }
  const sendAnotherMessageButton = () => {
    conn.send("Do you read me?");
  }

  return (
    <>
      <h1>Hello World</h1>
      <label>Connection ID: <input value={connectionID} name="connectionID" onChange={e => setConnectionID(e.target.value)} /></label><br />
      <button onClick={connectionButton}>Connect</button>
      <button onClick={sendAnotherMessageButton}>Send Another Message</button>
    </>
  )
}

export default App
