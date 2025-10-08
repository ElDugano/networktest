import { useState } from "react";
import { ClientGlobalStateContext } from "./ClientGlobalStateContext";

export const ClientGlobalState = ( props ) => {
  const [test, setTest] = useState(false);

  return <ClientGlobalStateContext.Provider value={{
      test,
      setTest
    }}>
      {props.children}
    </ClientGlobalStateContext.Provider>
}

export default ClientGlobalState