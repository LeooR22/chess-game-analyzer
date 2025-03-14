export interface SearchGamesResponse {
  games: Game[];
}

export interface Game {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  tcn: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: TimeClass;
  rules: Rules;
  white: PlayerMetadata;
  black: PlayerMetadata;
  eco: string;
  accuracies?: Accuracies;
}

export interface Accuracies {
  white: number;
  black: number;
}

export interface PlayerMetadata {
  rating: number;
  result: Result;
  "@id": string;
  username: string;
  uuid: string;
}

export type Black = PlayerMetadata;

export type White = PlayerMetadata;

// export interface Black {
//   rating: number;
//   result: Result;
//   "@id": string;
//   username: string;
//   uuid: string;
// }

// export interface White extends Black {}

export enum Result {
  Abandoned = "abandoned",
  Checkmated = "checkmated",
  Insufficient = "insufficient",
  Repetition = "repetition",
  Resigned = "resigned",
  Timeout = "timeout",
  Timevsinsufficient = "timevsinsufficient",
  Win = "win",
}

export enum Rules {
  Chess = "chess",
}

export enum TimeClass {
  Blitz = "blitz",
  Bullet = "bullet",
  Rapid = "rapid",
}
