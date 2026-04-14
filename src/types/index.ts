export interface Issue {
  id: string;
  text: string;
  type: 'positive' | 'negative';
}

export interface Dimension {
  id: string;
  title: string;
  issues: Issue[];
}

export interface VoteState {
  [issueId: string]: number;
}

export interface VoteRecord {
  timestamp: number;
  votes: VoteState;
}
