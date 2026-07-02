import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMatch, getPlayerIdFromNameAndDraft } from "../services/draftServices";
import type { DraftPlayer } from "../types";


type Props = {
    players: DraftPlayer[],
    load: () => void,
}

export default function AddMatch({ players, load }: Props) {
    const { draftId } = useParams();

    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [player1Wins, setPlayer1Wins] = useState("");
    const [player2Wins, setPlayer2Wins] = useState("");
    const [round, setRound] = useState("");

    async function handleAddMatch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!draftId) return;

        const player1Id = await getPlayerIdFromNameAndDraft(player1, draftId);
        const player2Id = await getPlayerIdFromNameAndDraft(player2, draftId);
        const winnerId = Number(player1Wins) - Number(player2Wins) > 0 ? player1Id : player2Id;

        try {
            await createMatch({
                draft_id: draftId,
                player1_id: player1Id,
                player2_id: player2Id,
                player1_games_won: Number(player1Wins),
                player2_games_won: Number(player2Wins),
                round: Number(round),
                winner_id: winnerId,
            });

            load();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h3>Add Match</h3>

            <form className="card form" onSubmit={handleAddMatch}>
                <div className="field">
                    <label htmlFor="player1">Player 1</label>
                    <select
                        id="player1"
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                        required
                    >
                        <option value="">Select Player 1</option>
                        {players.map((p) => (
                            <option key={p.player_id} value={p.players.name}>
                                {p.players.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="player2">Player 2</label>
                    <select
                        id="player2"
                        value={player2}
                        onChange={(e) => setPlayer2(e.target.value)}
                        required
                    >
                        <option value="">Select Player 2</option>
                        {players.map((p) => (
                            <option key={p.player_id} value={p.players.name}>
                                {p.players.name}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="field">
                    <label htmlFor="p1Wins">Player 1 Wins</label>
                    <input
                        id="p1Wins"
                        type="text"
                        value={player1Wins}
                        onChange={(e) => setPlayer1Wins(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label htmlFor="p2Wins">Player 2 Wins</label>
                    <input
                        id="p2Wins"
                        type="text"
                        value={player2Wins}
                        onChange={(e) => setPlayer2Wins(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label htmlFor="round">Round</label>
                    <input
                        id="round"
                        type="text"
                        value={round}
                        onChange={(e) => setRound(e.target.value)}
                    />
                </div>

                <button className="button" type="submit">
                    Add Match
                </button>
            </form>
        </div>
    )
}
