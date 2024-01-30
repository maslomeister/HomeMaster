import { createContext, FC, useContext, useEffect, useState } from "react";
import { HomeMasterManager } from "./HomeMasterManager";

const HomeMasterContext = createContext<PublicHomeMasterContext>(null as any);
export const useHomeMasterContext = () => useContext(HomeMasterContext);

interface ProviderProps {
  homeMasterManager: HomeMasterManager
}

interface PublicHomeMasterManager {
  
}
interface PublicHomeMasterContext extends PublicHomeMasterManager {
  homeMasterManager: HomeMasterManager
}

export const HomeMasterContextProvider: FC<ProviderProps> = ({ children, homeMasterManager }) => {
  const [publicState, setPublicState] = useState<PublicHomeMasterManager>({
    // TODO: get homeMasterManager state here
  });

  useEffect(() => {
    function onUpdate() {
      setPublicState({ /* TODO: set homeMasterManager state here */ });
    }

    homeMasterManager.eventBus.addEventListener("stateUpdate", onUpdate);

    return () => {
      homeMasterManager.eventBus.removeEventListener("stateUpdate", onUpdate);
    }
  }, []);

  return (
    <HomeMasterContext.Provider
      value={{
        ...publicState,
        homeMasterManager
      }}
    >
      {children}
    </HomeMasterContext.Provider>
  )
}
