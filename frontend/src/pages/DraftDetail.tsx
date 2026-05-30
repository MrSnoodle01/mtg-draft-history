import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDraftDetails, createMatch, addPlayerToDraft, updatePlayer, deletePlayer } from "../services/draftServices";
import Player from "../components/Player";
import type { Draft } from "../types";

export default function DraftDetail() {
    const { draftId } = useParams();
    const navigate = useNavigate();

    const [newPlayerName, setNewPlayerName] = useState("");
    const [newPlayerColors, setNewPlayerColors] = useState<string[]>([]);

    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [player1Wins, setPlayer1Wins] = useState(0);
    const [player2Wins, setPlayer2Wins] = useState(0);
    const [round, setRound] = useState(1);

    const [draft, setDraft] = useState<Draft | null>(null);
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, [draftId]);

    async function load() {
        if (!draftId) return;

        try {
            const data = await getDraftDetails(draftId);

            setDraft(data.draft);
            setPlayers(data.players);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAddPlayer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!draftId) return;

        try {
            await addPlayerToDraft({
                draft_id: draftId,
                player_name: newPlayerName,
                colors: newPlayerColors,
            });

            setNewPlayerName("");
            setNewPlayerColors([]);

            load();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAddMatch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!draftId) return;

        try {
            await createMatch({
                draft_id: draftId,
                player1_id: player1,
                player2_id: player2,
                player1_games_won: player1Wins,
                player2_games_won: player2Wins,
                round,
            });

            load();
        } catch (err) {
            console.error(err);
        }
    }

    if (!draft) return <p>Loading draft...</p>;

    return (
        <div className="main">
            <button className="button" onClick={() => navigate("/")}>
                ← Back
            </button>
            <h1>{draft.set_name}</h1>
            <p>{draft.draft_type} • {draft.format}</p>
            <p>{new Date(draft.date).toLocaleDateString()}</p>
            <p className="muted">{draft.location}</p>

            <hr />

            <h2>Players</h2>
            <div className="grid">
                {players.map((p) => (
                    <Player p={p} load={() => load()} />
                ))}
            </div>

            <hr />

            <h3>Add Player</h3>

            <form className="card form" onSubmit={handleAddPlayer}>
                <input
                    placeholder="Player name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    required
                />

                <input
                    placeholder="Colors (comma separated, e.g. W,U)"
                    value={newPlayerColors.join(",")}
                    onChange={(e) =>
                        setNewPlayerColors(
                            e.target.value.split(",").map((c) => c.trim())
                        )
                    }
                />

                <button className="button" type="submit">
                    Add Player
                </button>
            </form>

            <h3>Add Match</h3>

            <form className="card form" onSubmit={handleAddMatch}>
                <select
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    required
                >
                    <option value="">Select Player 1</option>
                    {players.map((p) => (
                        <option key={p.player_id} value={p.player_name}>
                            {p.player_name}
                        </option>
                    ))}
                </select>

                <select
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    required
                >
                    <option value="">Select Player 2</option>
                    {players.map((p) => (
                        <option key={p.player_id} value={p.player_name}>
                            {p.player_name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="P1 Wins"
                    value={player1Wins}
                    onChange={(e) => setPlayer1Wins(Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="P2 Wins"
                    value={player2Wins}
                    onChange={(e) => setPlayer2Wins(Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="Round"
                    value={round}
                    onChange={(e) => setRound(Number(e.target.value))}
                />

                <button className="button" type="submit">
                    Add Match
                </button>
            </form>
        </div>
    );
}