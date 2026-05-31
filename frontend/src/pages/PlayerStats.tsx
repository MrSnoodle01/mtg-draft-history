import { useNavigate } from "react-router-dom";
import { getPlayerStats } from "../services/draftServices";
import { useEffect, useState } from "react";

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

    return (
        <div className="main">
            <button className="button" onClick={() => navigate("/")}>
                ← Back
            </button>

            <h1>Player Stats</h1>

            {loading ? (
                <p>Loading...</p>
            ) : stats.length === 0 ? (
                <p>No player data found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Drafts</th>
                            <th>Matches</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Match Win %</th>
                            <th>Games Won</th>
                            <th>Games Lost</th>
                            <th>Game Win %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.sort((a, b) => b.matchWins - a.matchWins).map((player) => (
                            <tr key={player.id}>
                                <td>{player.name}</td>
                                <td>{player.drafts}</td>
                                <td>{player.matches}</td>
                                <td>{player.matchWins}</td>
                                <td>{player.matchLosses}</td>
                                <td>{player.winRate.toFixed(1)}%</td>
                                <td>{player.gamesWon}</td>
                                <td>{player.gamesLost}</td>
                                <td>{player.gameWinRate.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}