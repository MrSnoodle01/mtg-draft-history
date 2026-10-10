import { getAllPlayersColors, getPlayerNameFromId } from "../services/draftServices";
import { useEffect, useState } from "react";

type DraftPlayerColors = {
    draft_id: string;
    player_id: string;
    main_colors: string[];
    splash_colors: string[];
}

type PlayerColorStats = {
    player_name: string;
    draftsPlayed: number;
    mainColorCounts: Record<string, number>;
    splashColorCounts: Record<string, number>;
    combinationCounts: Record<string, number>;
};

async function calculateColorStats(data: DraftPlayerColors[]): Promise<PlayerColorStats[]> {
    const players = new Map<string, PlayerColorStats>();

    for (const entry of data) {
        if (!players.has(entry.player_id)) {
            players.set(entry.player_id, {
                player_name: await getPlayerNameFromId(entry.player_id),
                draftsPlayed: 0,
                mainColorCounts: {},
                splashColorCounts: {},
                combinationCounts: {},
            });
        }

        const stats = players.get(entry.player_id)!;

        stats.draftsPlayed++;

        for (const color of entry.main_colors ?? []) {
            stats.mainColorCounts[color] = (stats.mainColorCounts[color] ?? 0) + 1;
        }

        for (const color of entry.splash_colors ?? []) {
            stats.splashColorCounts[color] = (stats.splashColorCounts[color] ?? 0) + 1;
        }

        const combination = [...(entry.main_colors ?? [])].sort().join("-");

        if (combination) {
            stats.combinationCounts[combination] = (stats.combinationCounts[combination] ?? 0) + 1;
        }
    }

    return Array.from(players.values());
}

export default function PlayerStats() {

    const [stats, setStats] = useState<PlayerColorStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getAllPlayersColors();
                setStats(await calculateColorStats(data));
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
            {loading ? (
                <p>Loading...</p>
            ) : stats.length === 0 ? (
                <p>No player data found.</p>
            ) : (
                <>
                    <h2>Player Color Statistics</h2>

                    {stats.map((player) => (
                        <section key={player.player_name}>
                            <h3>Player: {player.player_name}</h3>
                            <p>Drafts played: {player.draftsPlayed}</p>

                            <h4>Main Colors</h4>
                            <ul>
                                {Object.entries(player.mainColorCounts).map(
                                    ([color, count]) => (
                                        <li key={color}>
                                            {color}: {count}
                                        </li>
                                    )
                                )}
                            </ul>

                            <h4>Splash Colors</h4>
                            <ul>
                                {Object.entries(player.splashColorCounts).map(
                                    ([color, count]) => (
                                        <li key={color}>
                                            {color}: {count}
                                        </li>
                                    )
                                )}
                            </ul>

                            <h4>Color Combinations</h4>
                            <ul>
                                {Object.entries(player.combinationCounts).map(
                                    ([combination, count]) => (
                                        <li key={combination}>
                                            {combination}: {count}
                                        </li>
                                    )
                                )}
                            </ul>
                        </section>
                    ))}
                </>
            )}
        </div>
    );
}