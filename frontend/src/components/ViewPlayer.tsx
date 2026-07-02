import { updatePlayer, deletePlayer, getNumberOfRoundsPlayed } from "../services/draftServices";
import type { DraftPlayer } from "../types";
import { useEffect, useState } from "react";
import { getPlayerWinCountForDraft } from "../services/draftServices";
import { useAuth } from "./AuthContext";

type Props = {
    p: DraftPlayer,
    load: () => void,
}

export default function Player({ p, load }: Props) {
    const [playerWins, setPlayerWins] = useState(0);
    const [playerLosses, setPlayerLosses] = useState(0);
    const mainColors = p.main_colors;
    const splashColors = p.splash_colors;

    const { session } = useAuth()
    const isLoggedIn = !!session;

    useEffect(() => {
        async function fetchData() {
            const roundsPlayed = await getNumberOfRoundsPlayed(p.player_id, p.draft_id);
            const p1Wins = await getPlayerWinCountForDraft(p.draft_id, p.player_id, roundsPlayed + 1);

            setPlayerWins(p1Wins);
            setPlayerLosses(roundsPlayed - p1Wins);
        }

        fetchData();
    })

    async function handleDeletePlayer(playerId: string) {
        if (!confirm("Delete this player?")) return;

        try {
            await deletePlayer(playerId);
            load();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEditPlayer(player: any) {
        const newName = prompt("Player name: ", player.players.name);

        if (!newName) return;

        const mainColorsInput = prompt(
            "Main colors (comma separated)",
            ""
        );

        if (mainColorsInput === null) return;

        const splashColorsInput = prompt(
            "Splash colors (comma separated)",
            ""
        );

        try {
            await updatePlayer(player.player_id, player.draft_id, {
                player_name: newName,
                main_colors: mainColorsInput.split(",").map((c) => c.trim()),
                splash_colors: splashColorsInput ? splashColorsInput.split(",").map((c) => c.trim()) : [],
            });

            load();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div key={p.player_id} className="card">
            <h3>{p.players.name}({playerWins}-{playerLosses})</h3>
            <p>Main colors: {mainColors ? mainColors.join(", ") : "—"}</p>
            <p>Splash colors: {splashColors ? splashColors.join(", ") : "—"}</p>

            {isLoggedIn &&
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button
                        className="button"
                        onClick={() => handleEditPlayer(p)}
                    >
                        Edit
                    </button>

                    <button
                        className="button"
                        onClick={() => handleDeletePlayer(p.player_id)}
                        style={{ background: "#c0392b" }}
                    >
                        Delete
                    </button>

                </div>}

        </div>
    )
}