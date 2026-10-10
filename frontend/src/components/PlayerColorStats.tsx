import { getAllPlayersColors, getPlayerNameFromId } from "../services/draftServices";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

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

const COLORS: Record<string, string> = {
    W: "#F9FAF4", // White
    U: "#4786D1", // Blue
    B: "#383838", // Black
    R: "#E64946", // Red
    G: "#3B9B62", // Green
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

                    {stats.map((player) => {
                        const data = toStackedChartData(
                            player.mainColorCounts,
                            player.splashColorCounts
                        );

                        return (
                            <section key={player.player_name}>
                                <h3>Player: {player.player_name}</h3>
                                <p>Drafts played: {player.draftsPlayed}</p>

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

                                <h3>Colors</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data}>
                                        <defs>
                                            {Object.entries(COLORS).map(([color, fill]) => (
                                                <pattern
                                                    key={color}
                                                    id={`splash-${color}`}
                                                    patternUnits="userSpaceOnUse"
                                                    width={6}
                                                    height={6}
                                                    patternTransform="rotate(45)"
                                                >
                                                    <rect width={6} height={6} fill="white" />
                                                    <line
                                                        x1={0}
                                                        y1={0}
                                                        x2={0}
                                                        y2={6}
                                                        stroke={fill}
                                                        strokeWidth={3}
                                                    />
                                                </pattern>
                                            ))}
                                        </defs>

                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />

                                        <Bar
                                            dataKey="main"
                                            name="Main color"
                                            stackId="colors"
                                            shape={(props) => {
                                                const { x, y, width, height, payload } = props;

                                                if (
                                                    x == null ||
                                                    y == null ||
                                                    width == null ||
                                                    height == null ||
                                                    height === 0
                                                ) {
                                                    return <g />;
                                                }

                                                return (
                                                    <rect
                                                        x={x}
                                                        y={y}
                                                        width={width}
                                                        height={height}
                                                        fill={COLORS[payload.name] ?? "#8884d8"}
                                                    />
                                                );
                                            }}
                                        />

                                        <Bar
                                            dataKey="splash"
                                            name="Splash color"
                                            stackId="colors"
                                            shape={(props) => {
                                                const { x, y, width, height, payload } = props;

                                                if (
                                                    x == null ||
                                                    y == null ||
                                                    width == null ||
                                                    height == null ||
                                                    height === 0
                                                ) {
                                                    return <g />;
                                                }

                                                return (
                                                    <rect
                                                        x={x}
                                                        y={y}
                                                        width={width}
                                                        height={height}
                                                        fill={`url(#splash-${payload.name})`}
                                                    />
                                                );
                                            }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </section>
                        )
                    })}
                </>
            )}
        </div>
    );
}