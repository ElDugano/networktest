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
  console.log("------------------");

  useEffect(() => {
    console.log("Startin useEffect");
    if(newestConn != null){
      console.log("We had a newestConn.");
      let newConn = [...conn];
      newConn.push(newestConn);
      setConn(newConn);
      setNewestConn(null);
    }
    let myPromise;
    if(myPeerID == null) {
      var newPeer = new Peer();           //Leave this blank to generate a unique random ID.
          //We can pass a string like elduganocatangame-[random string], then only show the random string to enter.
      myPromise = new Promise((resolve, reject) => {
        newPeer.on('open', function(id) {
          console.log('My peer ID is: ' + id);
          setMyPeerID(id);
          setPeer(newPeer);
          resolve(newPeer);
        });  
      })
      //newPeer.on('open', function(id) {
      //  console.log('My peer ID is: ' + id);
      //  setMyPeerID(id);
      //  setPeer(newPeer);
      //});
      console.log("NEXT!");
      myPromise.then(result =>{
        console.log("We did the prmoise thing. here is our peer");
        console.log(result);
      });

    }
  }, [myPeerID, conn, newestConn]);

  console.log("||||| THIS IS MY PEER |||||");
  console.log(peer);
  console.log("||||| This is my conn |||||");
  console.log(conn[0]);

  if (myPeerID != null) {
    console.log("myPeerID is set, looking at the peer.on");
    peer.on('connection', function(newConn) {
      console.log("We just connected!");
      console.log(newConn);
      setNewestConn(newConn);
      setIsHost(true);
    });
  }


  if (conn.length != 0) {
    conn[0].on('open', function() {
      // Receive messages
      conn[0].on('data', function(data) {
        console.log('Received', data);
      });

      // Send messages
      if (isHost)
        conn[0].send("You listen here, I am the host, so I am the boss. You put in my ID, so I am incharge here!");
      else
        conn[0].send("Hey man, I don't want any trouble, I put your ID into my browser, so I'm listening to you!");
    });
    if(conn.length == 2){
      console.log("conn length is 2.")  //We probably only want this to occure once, really.
      conn[1].on('open', function() {
        // Receive messages
        conn[1].on('data', function(data) {
          console.log('Received', data);
        });

        // Send messages
        if (isHost)
          conn[1].send("You listen here, I am the host, so I am the boss. You put in my ID, so I am incharge here!");
        else
          conn[1].send("This is a message that should never be sent, because only the host has more than 1 connection.");
      });
    }
  }

  const connectionButton= () => {
    //This is the client side.
    console.log("Clicked connection button.");
    console.log(conn);
    console.log(connectionID);
    let newConn = peer.connect(connectionID);
    console.log(newConn);
    setConn([newConn]);
  }
  const sendAnotherMessageButton = () => {
    conn[0].send("Do you read me? You were the first connector.");
    conn[1].send("Do you read me? You were the second connector.");
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
