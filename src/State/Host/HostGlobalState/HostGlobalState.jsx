import { useState } from "react";
import { HostGlobalStateContext } from "./HostGlobalStateContext";

export const HostGlobalState = ( props ) => {
  const [test, setTest] = useState(false);

  return <HostGlobalStateContext.Provider value={{
      test,
      setTest
    }}>
      {props.children}
    </HostGlobalStateContext.Provider>
}

export default HostGlobalState