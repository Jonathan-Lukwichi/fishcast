import { createContext, useContext, useState } from 'react';

// Shared state: the last forecast the user ran
const ForecastContext = createContext(null);

export function ForecastProvider({ children }) {
  const [lastForecast, setLastForecast] = useState(null);
  // lastForecast shape:
  // {
  //   source: 'marine' | 'tanganyika' | 'congo' | 'lualaba',
  //   sourceLabel: string,
  //   species: string,
  //   zone: string,
  //   horizon: number,          // months
  //   baseVal: number,          // last known tonnage
  //   nextMonthVal: number,
  //   nextMonthLabel: string,   // e.g. "Juin 2026"
  //   nextMonthDiff: number,
  //   nextMonthPct: string,
  //   finalFc: number,
  //   totalPct: string,
  //   tableRows: array,         // period detail rows
  //   mapHighlights: object,    // for WorldMap
  //   timestamp: Date,
  // }

  return (
    <ForecastContext.Provider value={{ lastForecast, setLastForecast }}>
      {children}
    </ForecastContext.Provider>
  );
}

export function useForecast() {
  return useContext(ForecastContext);
}
