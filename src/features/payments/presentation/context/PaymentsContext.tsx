import React, { createContext, useContext, useMemo } from "react";
import { PaymentEntity } from "../../domain/entities/PaymentEntity";
import { PaymentTransformerService } from "../../domain/services/PaymentTransformerService";
import { useEvents } from "@/features/events/presentation/context/EventsContext";

interface PaymentsContextType {
  payments: PaymentEntity[];
  isLoading: boolean;
  error: string | null;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { events, isLoading, error } = useEvents();

  // Transforma eventos em pagamentos
  const payments = useMemo(() => {
    const transformed = PaymentTransformerService.transformEventsToPayments(events);
    // Ordena por urgência (mais urgente primeiro)
    return PaymentTransformerService.sortByUrgency(transformed);
  }, [events]);

  return (
    <PaymentsContext.Provider value={{ payments, isLoading, error }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error("usePayments deve ser usado dentro de PaymentsProvider");
  }
  return context;
}

