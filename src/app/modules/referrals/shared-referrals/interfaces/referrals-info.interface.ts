interface LevelData {
  with_wallet: number;
  without_wallet: number;
  reward: number;
}

export interface ReferralsCount {
  first_order: LevelData;
  second_order: LevelData;
}
