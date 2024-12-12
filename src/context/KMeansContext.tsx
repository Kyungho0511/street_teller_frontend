import { createContext } from "react";

type KMeansContextProps = {};

export const KMeansContext = createContext<KMeansContextProps>(
  {} as KMeansContextProps
);

export function KMeansContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KMeansContext.Provider value={{}}>{children}</KMeansContext.Provider>;
}
