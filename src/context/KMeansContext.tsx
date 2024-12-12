import { createContext, useState } from "react";
import { KMeansLayer } from "../constants/kMeansConstants";

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
  const [kMeansLayers, setKMeansLayers] = useState<KMeansLayer[]>([]);

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
