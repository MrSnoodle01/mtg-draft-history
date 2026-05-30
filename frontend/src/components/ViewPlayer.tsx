import { updatePlayer, deletePlayer } from "../services/draftServices";
import type { DraftPlayer } from "../types";

type Props = {
    p: DraftPlayer,
    load: () => void,
}

export default function Player({ p, load }: Props) {

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
        const newName = prompt("Player name: ", player.player_name);

        if (!newName) return;

        const colorsInput = prompt(
            "Colors (comma separated)",
            player.colors?.join(",") ?? ""
        );

        const colors = colorsInput ? colorsInput.split(",").map((c) => c.trim()) : [];

        try {
            await updatePlayer(player.player_id, {
                player_name: newName,
                colors,
            });

            load();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div key={p.player_id} className="card">
            <h3>{p.player_name}</h3>
            <p>Placement: {p.placement}</p>
            <p>Colors: {p.colors?.join(", ")}</p>

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
            </div>
        </div>
    )
}