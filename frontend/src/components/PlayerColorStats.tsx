import { getAllPlayersColors, getPlayerNameFromId } from "../services/draftServices";
import { useEffect, useState } from "react";
import ColorComboGraph from "./ColorComboGraph";
import ColorGraph from "./ColorGraph";

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

const COLOR_ORDER = ["W", "U", "B", "R", "G"];

function toStackedChartData(
    mainCounts: Record<string, number>,
    splashCounts: Record<string, number>
) {
    return COLOR_ORDER.map((color) => ({
        name: color,
        main: mainCounts[color] ?? 0,
        splash: splashCounts[color] ?? 0,
    }));
}

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

        const combination = [...(entry.main_colors ?? [])]
            .sort(
                (a, b) => COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b)
            )
            .join("-");

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

                    {stats.map((player) => {
                        const data = toStackedChartData(
                            player.mainColorCounts,
                            player.splashColorCounts
                        );

                        const combinationData = Object.entries(player.combinationCounts)
                            .map(([name, count]) => ({
                                name,
                                count,
                                colors: name.split("-").sort(
                                    (a, b) => COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b)
                                ),
                            }))
                            .sort((a, b) => b.count - a.count);

                        return (
                            <section key={player.player_name}>
                                <h3>Player: {player.player_name}</h3>
                                <p>Drafts played: {player.draftsPlayed}</p>

                                <h3>Color Combinations (without splash)</h3>
                                <ColorComboGraph combinationData={combinationData} />

                                <h3>Colors</h3>
                                <ColorGraph data={data} />
                            </section>
                        )
                    })}
                </>
            )}
        </div>
    );
}