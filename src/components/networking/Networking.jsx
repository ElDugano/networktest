import { NetworkingClient } from "./NetworkingClient.jsx";
import { NetworkingHost } from "./NetworkingHost.jsx";

export const Networking = (props) => {
  const pingHeader = "Test Still connected Ping"

  if (props.isHost == false) {
    return (
      <NetworkingClient
        pingHeader={pingHeader}
      >
        {props.children}
      </NetworkingClient>
    )
  }
  else if (props.isHost == true) {
    return (
      <NetworkingHost
        pingHeader={pingHeader}
      >
        {props.children}
      </NetworkingHost>
    )
  }
  else
    return <>{props.children}</>
}