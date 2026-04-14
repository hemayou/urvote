export type SwotType = 'strength' | 'weakness' | 'opportunity' | 'threat';

export interface SwotPoint {
  id: string;
  text: string;
  type: SwotType;
}

export interface DimensionWithSwot {
  id: string;
  title: string;
  points: SwotPoint[];
}

// 投票状态：维度ID -> 投票数
export interface VoteState {
  [dimensionId: string]: number;
}

export interface VoteRecord {
  timestamp: number;
  votes: VoteState;
  voterName: string;
}
