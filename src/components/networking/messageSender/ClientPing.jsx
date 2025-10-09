import { useEffect, useContext } from "react"
//import { NetworkingContext } from "../NetworkingContext";
import { NetworkingClientContext } from "../NetworkingClientContext";

export default function ClientPing(props) {
  //const { conn } = useContext(NetworkingContext);
  const { conn } = useContext(NetworkingClientContext);

  useEffect(() => {
    if (props.recievedPing == true) {
      conn.send({header:props.pingHeader})
      props.setRecievedPing(false);
    }

  }, [conn, props])

  return <></>;
}