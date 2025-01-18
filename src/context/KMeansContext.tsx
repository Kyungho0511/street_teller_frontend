import { createContext } from "react";
import { KMeansLayer } from "../constants/kMeansConstants";
import useSessionStorage from "../hooks/useSessionStorage";

type KMeansContextProps = {
  kMeansLayers: KMeansLayer[];
  setKMeansLayers: React.Dispatch<React.SetStateAction<KMeansLayer[]>>;
};

export const KMeansContext = createContext<KMeansContextProps>(
  {} as KMeansContextProps
);

export function KMeansContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [kMeansLayers, setKMeansLayers] = useSessionStorage<KMeansLayer[]>(
    "kMeansLayers",
    []
  );

  return (
    <KMeansContext.Provider
      value={{
        kMeansLayers,
        setKMeansLayers,
      }}
    >
      {children}
    </KMeansContext.Provider>
  );
}
