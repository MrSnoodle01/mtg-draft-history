export type MatchResult = {
    match_id: string;
    draft_id: string;
    player1_id: string;
    player2_id: string;

    player1_games_won: number;
    player2_games_won: number;

    round: number;
    winner_id?: string; // undefined = draw
}