import { useParams } from "react-router-dom";
import { useState } from "react";

import type { Draft } from "../types/draft";
import type { DraftPlayer } from "../types/draft";

type MatchResult = {
    matchId: string;
    player1Id: string;
    player2Id: string;
    player1GamesWon: number;
    player2GamesWon: number;
    round: number;
};

export default function DraftDetail() {
    const { draftId } = useParams();

    const [draft] = useState<Draft>({
        draftId: draftId!,
        date: new Date().toISOString(),
        set: "Example Set",
        type: "Draft",
        format: "Bo3",
        location: "Test",
    });

    const [players] = useState<DraftPlayer[]>([
        { playerId: "josh", draftId: draftId!, placement: 1, colors: ["W", "U"] },
        { playerId: "mike", draftId: draftId!, placement: 2, colors: ["R", "G"] },
    ]);

    const [matches, setMatches] = useState<MatchResult[]>([]);

    function addMatch() {
        setMatches((prev) => [
            ...prev,
            {
                matchId: crypto.randomUUID(),
                player1Id: "josh",
                player2Id: "mike",
                player1GamesWon: 2,
                player2GamesWon: 1,
                round: 1,
            },
        ]);
    }

    return (
        <div className="main">
            <h1>{draft.set}</h1>
            <p>{draft.type} • {draft.format}</p>
            <p>{draft.location}</p>

            <hr />

            <h2>Players</h2>
            <div className="grid">
                {players.map((p) => (
                    <div key={p.playerId} className="card">
                        <h3>{p.playerId}</h3>
                        <p>Placement: {p.placement}</p>
                        <p>Colors: {p.colors.join(", ")}</p>
                    </div>
                ))}
            </div>

            <hr />

            <h2>Matches</h2>

            <button className="button" onClick={addMatch}>
                Add Test Match
            </button>

            <div className="grid" style={{ marginTop: "1rem" }}>
                {matches.map((m) => (
                    <div key={m.matchId} className="card">
                        <p>
                            {m.player1Id} ({m.player1GamesWon}) vs {m.player2Id} ({m.player2GamesWon})
                        </p>
                        <p>Round {m.round}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}