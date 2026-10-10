import { useNavigate } from "react-router-dom";
import PlayerStatsTable from "../components/PlayerStatsTable";
import PlayerColorStats from "../components/PlayerColorStats";
import { useState } from "react";

export default function PlayerStats() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<"players" | "colors">("players");

    return (
        <div className="main">
            <button className="button" onClick={() => navigate("/")}>
                ← Back
            </button>

            <div className="stats-tabs">
                <button
                    className={activeTab === "players" ? "active" : ""}
                    onClick={() => setActiveTab("players")}
                >
                    Player Stats
                </button>

                <button
                    className={activeTab === "colors" ? "active" : ""}
                    onClick={() => setActiveTab("colors")}
                >
                    Player Colors
                </button>
            </div>

            {activeTab === "players" ? (
                <PlayerStatsTable />
            ) : (
                <PlayerColorStats />
            )}
        </div>
    );
}