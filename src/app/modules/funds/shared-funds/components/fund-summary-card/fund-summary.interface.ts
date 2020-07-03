export interface FundSummaryInterface {
  fund: {
    nombre_bot: string;
    currency: string;
  };
  balance: {
    start_balance: string;
    end_balance: string;
  };
}
