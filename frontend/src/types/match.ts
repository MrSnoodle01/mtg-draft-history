export type MatchResult = {
    matchId: string;
    draftId: string;
    player1Id: string;
    player2Id: string;

    player1GamesWon: number;
    player2GamesWon: number;

    round: number;
    winnerId?: string; // undefined = draw
}