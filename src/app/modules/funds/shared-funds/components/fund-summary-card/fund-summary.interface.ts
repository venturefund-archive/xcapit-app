export interface FundSummaryInterface {
  fund: {
    nombre_bot: string;
  };
  balance: {
    balance_inicio: string;
    balance_fin: string;
    date_info: {
      cantidad_dias_inicio_restantes: string;
      cantidad_horas_inicio_restantes: string;
    };
  };
}
