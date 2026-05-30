import type { MatchResult } from "../types"
import { getPlayerNameFromId, deleteMatch, updateMatch } from "../services/draftServices"
import { useState, useEffect } from "react";

type Props = {
    m: MatchResult,
    load: () => void;
}

export default function ViewMatch({ m, load }: Props) {
    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");

    useEffect(() => {
        async function fetchNames() {
            const p1 = await getPlayerNameFromId(m.player1_id);
            const p2 = await getPlayerNameFromId(m.player2_id);

            setPlayer1Name(p1);
            setPlayer2Name(p2);
        }

        fetchNames();
    }, [m.player1_id, m.player2_id]);

    async function handleDeleteMatch(matchId: string) {
        if (!confirm("Delete this Match?")) return;

        try {
            await deleteMatch(matchId);
            load();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEditMatch(match: any) {
        const newP1GamesWon = Number(prompt("Player 1 games won: ", match.player1_games_won));

        if (!newP1GamesWon && newP1GamesWon != 0) return;

        const newP2GamesWon = Number(prompt("Player 2 games won: ", match.player2_games_won));

        if (!newP2GamesWon && newP2GamesWon != 0) return;

        const newRound = prompt("New Round: ", match.round);

        if (!newRound) return;

        try {
            await updateMatch(match.match_id, {
                ...m,
                player1_games_won: newP1GamesWon,
                player2_games_won: newP2GamesWon,
            });

            load();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div key={m.match_id} className="card">
            {/* TODO: have match wins next to player name */}
            <h2>Round: {m.round} {player1Name} vs {player2Name}</h2>
            {m.player1_games_won > m.player2_games_won
                ?
                <h3>{player1Name} defeats {player2Name} {m.player1_games_won} - {m.player2_games_won}</h3>
                :
                <h3>{player2Name} defeats {player1Name} {m.player2_games_won} - {m.player1_games_won}</h3>
            }

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button
                    className="button"
                    onClick={() => handleEditMatch(m)}
                >
                    Edit
                </button>

                <button
                    className="button"
                    onClick={() => handleDeleteMatch(m.match_id)}
                    style={{ background: "#c0392b" }}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}