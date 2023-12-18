import { SectorModel } from "@/models";
import { sectorService } from "@/services/sector";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

interface DataContextProps {
  sectors: SectorModel[];
  fetchSectors: () => Promise<void>
}

export const DataContext = createContext({} as DataContextProps);

interface Props {
  children: React.ReactNode;
}

export const DataProvider: React.FC<Props> = ({ children }) => {
  const [sectors, setSectors] = useState([] as SectorModel[]);

  const fetchSectors = useCallback(async () => {
    sectorService.list({ currentPage: 0, pageSize: 100 })
      .then((data) => setSectors(data.content));
  }, []);

  useEffect(() => { fetchSectors() }, []);

  const value = useMemo(() => ({ sectors, fetchSectors }), [sectors, fetchSectors]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}