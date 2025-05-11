import { createContext, useContext, useState } from "react";

interface FinancialContextType {
    currentCash: number;
    monthInflow: number;
    monthOutflow: number;
    setFinancialData: (data: { currentCash: number; monthInflow: number; monthOutflow: number }) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
    const [currentCash, setCurrentCash] = useState(0);
    const [monthInflow, setMonthInflow] = useState(0);
    const [monthOutflow, setMonthOutflow] = useState(0);
  
    const setFinancialData = ({
        monthInflow,
        monthOutflow
    }: {
        currentCash: number;
        monthInflow: number;
        monthOutflow: number;
    }) => {
        setCurrentCash(monthInflow - monthOutflow);
        setMonthInflow(monthInflow);
        setMonthOutflow(monthOutflow);
    };
  
    return (
        <FinancialContext.Provider
            value={{ currentCash, monthInflow, monthOutflow, setFinancialData }}
        >
            {children}
        </FinancialContext.Provider>
    );
  }
export function useFinancial() {
    const context = useContext(FinancialContext);
    if (!context) throw new Error("useFinancial precisa estar dentro do FinancialProvider");
    return context;
}
