import type { MatchResult } from "../types"
import { getPlayerNameFromId, deleteMatch, updateMatch, getPlayerWinCountForDraft } from "../services/draftServices"
import { useState, useEffect } from "react";
import { useActionData } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
    m: MatchResult,
    load: () => void;
}

export default function ViewMatch({ m, load }: Props) {
    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");
    const [player1CurrWins, setPlayer1CurrWins] = useState(0);
    const [player2CurrWins, setPlayer2CurrWins] = useState(0);
    const [player1CurrLosses, setPlayer1CurrLosses] = useState(0);
    const [player2CurrLosses, setPlayer2CurrLosses] = useState(0);

    const { session } = useAuth();
    const isLoggedIn = !!session;

    useEffect(() => {
        async function fetchData() {
            const p1 = await getPlayerNameFromId(m.player1_id);
            const p2 = await getPlayerNameFromId(m.player2_id);
            const p1Wins = await getPlayerWinCountForDraft(m.draft_id, m.player1_id, m.round);
            const p2Wins = await getPlayerWinCountForDraft(m.draft_id, m.player2_id, m.round);

            setPlayer1Name(p1);
            setPlayer2Name(p2);
            setPlayer1CurrWins(p1Wins);
            setPlayer2CurrWins(p2Wins);
            setPlayer1CurrLosses(m.round - p1Wins - 1);
            setPlayer2CurrLosses(m.round - p2Wins - 1);
        }

        fetchData();
    }, [m.player1_id, m.player2_id, m.player1_games_won, m.player2_games_won]);

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
        const newP1GamesWon = Number(prompt(`${player1Name} games won: `, match.player1_games_won));
        if (!newP1GamesWon && newP1GamesWon != 0) return;

        const newP2GamesWon = Number(prompt(`${player2Name} games won: `, match.player2_games_won));
        if (!newP2GamesWon && newP2GamesWon != 0) return;

        const newRound = prompt("Round number: ", match.round);
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
            <h2>Round {m.round}: {player1Name}({player1CurrWins}-{player1CurrLosses}) vs {player2Name}({player2CurrWins}-{player2CurrLosses})</h2>
            {m.player1_games_won > m.player2_games_won
                ?
                <h3>{player1Name} defeats {player2Name} {m.player1_games_won} - {m.player2_games_won}</h3>
                :
                <h3>{player2Name} defeats {player1Name} {m.player2_games_won} - {m.player1_games_won}</h3>
            }

            {isLoggedIn &&
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
                </div>}

        </div>
    )
}