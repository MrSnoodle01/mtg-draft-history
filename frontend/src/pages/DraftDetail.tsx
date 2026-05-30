import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDraftDetails, addPlayerToDraft } from "../services/draftServices";
import Player from "../components/ViewPlayer";
import AddMatch from "./AddMatch";
import ViewMatch from "../components/ViewMatch";
import type { Draft } from "../types";

export default function DraftDetail() {
    const { draftId } = useParams();
    const navigate = useNavigate();

    const [newPlayerName, setNewPlayerName] = useState("");
    const [newPlayerColors, setNewPlayerColors] = useState<string[]>([]);

    const [draft, setDraft] = useState<Draft | null>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, [draftId]);

    async function load() {
        if (!draftId) return;

        try {
            const data = await getDraftDetails(draftId);

            setDraft(data.draft);
            setPlayers(data.players);
            setMatches(data.matches);
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

            <AddMatch players={players} load={() => load()} />

            <h3>Matches</h3>

            <div className="grid">
                {matches.map((m) => (
                    <ViewMatch m={m} load={() => load()} />
                ))}
            </div>
        </div>
    );
}