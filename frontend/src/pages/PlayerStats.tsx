import { useNavigate } from "react-router-dom";
import { getPlayerStats } from "../services/draftServices";
import { useEffect, useState, useMemo } from "react";

type PlayerStat = {
    id: string;
    name: string;
    drafts: number;
    matches: number;
    matchWins: number;
    matchLosses: number;
    winRate: number;
    gamesWon: number;
    gamesLost: number;
    gameWinRate: number;

    headToHead: Record<string, { wins: number; losses: number }>;
};

export default function PlayerStats() {
    const navigate = useNavigate();

    const [stats, setStats] = useState<PlayerStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getPlayerStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    const sortedStats = useMemo(() => {
        return [...stats].sort((a, b) => b.winRate - a.winRate);
    }, [stats]);

    return (
        <div className="main">
            <button className="button" onClick={() => navigate("/")}>
                ← Back
            </button>

            <h1 style={{ marginBottom: "1rem" }}>Player Stats</h1>

            {loading ? (
                <p>Loading...</p>
            ) : stats.length === 0 ? (
                <p>No player data found.</p>
            ) : (
                <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border)" }}>
                                <th>#</th>
                                <th>Player</th>
                                <th>Drafts</th>
                                <th>Matches</th>
                                <th>W</th>
                                <th>L</th>
                                <th>Match %</th>
                                <th>Game W</th>
                                <th>Game L</th>
                                <th>Game %</th>
                                <th>Match H2H</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedStats.map((player, index) => (
                                <tr
                                    key={player.id}
                                    style={{
                                        borderBottom: "1px solid var(--border)",
                                    }}
                                >
                                    <td style={{ opacity: 0.6 }}>
                                        {index + 1}
                                    </td>

                                    <td style={{ fontWeight: 600 }}>
                                        {player.name}
                                    </td>

                                    <td>{player.drafts}</td>
                                    <td>{player.matches}</td>
                                    <td>{player.matchWins}</td>
                                    <td>{player.matchLosses}</td>

                                    <td style={{ fontWeight: 600 }}>
                                        {player.winRate.toFixed(1)}%
                                    </td>

                                    <td>{player.gamesWon}</td>
                                    <td>{player.gamesLost}</td>

                                    <td style={{ fontWeight: 600 }}>
                                        {player.gameWinRate.toFixed(1)}%
                                    </td>
                                    <td>
                                        <details>
                                            <summary>View</summary>
                                            <div style={{ fontSize: "0.85rem" }}>
                                                {Object.entries(player.headToHead).map(([opponent, record]) => (
                                                    <div key={opponent}>
                                                        {opponent}: {record.wins}-{record.losses}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}