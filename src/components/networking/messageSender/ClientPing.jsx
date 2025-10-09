import { useEffect, useContext } from "react"
import { NetworkingContext } from "../NetworkingContext";

export default function ClientPing(props) {
  const { conn } = useContext(NetworkingContext);

  useEffect(() => {
    if (props.recievedPing == true) {
      conn.send({header:props.pingHeader})
      props.setRecievedPing(false);
    }

  }, [conn, props])

  return <></>;
}