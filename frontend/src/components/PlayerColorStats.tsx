import {
    getAllPlayersColors,
    getPlayerNameFromId,
    getPlayerColorWinRates,
    type PlayerColorWinRates,
} from "../services/draftServices";
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
    player_id: string;
    draftsPlayed: number;
    mainColorCounts: Record<string, number>;
    splashColorCounts: Record<string, number>;
    combinationCounts: Record<string, number>;
};

const COLOR_ORDER = ["W", "U", "B", "R", "G"];

function toStackedChartData(
    mainCounts: Record<string, number>,
    splashCounts: Record<string, number>,
    colorRates: PlayerColorWinRates["colorWinRates"]
) {
    return COLOR_ORDER.map((color) => {
        const rate = colorRates[color];

        return {
            name: color,
            main: mainCounts[color] ?? 0,
            splash: splashCounts[color] ?? 0,
            winRate: rate?.winRate ?? 0,
            gamesWon: rate?.gamesWon ?? 0,
            gamesPlayed: rate?.gamesPlayed ?? 0,
        }
    });
}

async function calculateColorStats(data: DraftPlayerColors[]): Promise<PlayerColorStats[]> {
    const players = new Map<string, PlayerColorStats>();

    for (const entry of data) {
        if (!players.has(entry.player_id)) {
            players.set(entry.player_id, {
                player_name: await getPlayerNameFromId(entry.player_id),
                player_id: entry.player_id,
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
    const [winRates, setWinRates] = useState<PlayerColorWinRates[]>([]);

    useEffect(() => {
        async function loadStats() {
            try {
                const [data, rates] = await Promise.all([
                    getAllPlayersColors(),
                    getPlayerColorWinRates(),
                ])
                setStats(await calculateColorStats(data));
                setWinRates(rates);
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
                    <h1>Player Color Stats</h1>

                    {stats.map((player) => {
                        const playerRates = winRates.find(
                            (rate) => rate.player_id === player.player_id
                        );

                        const combinationRates = playerRates?.combinationWinRates ?? {};
                        const colorRates = playerRates?.colorWinRates ?? {};

                        const combinationData = Object.entries(player.combinationCounts)
                            .map(([name, count]) => {
                                const rate = combinationRates[name];

                                return {
                                    name,
                                    count,
                                    colors: name.split("-").sort(
                                        (a, b) =>
                                            COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b)
                                    ),
                                    winRate: rate?.winRate ?? 0,
                                    gamesWon: rate?.gamesWon ?? 0,
                                    gamesPlayed: rate?.gamesPlayed ?? 0,
                                };
                            })
                            .sort((a, b) => b.count - a.count);

                        const data = toStackedChartData(
                            player.mainColorCounts,
                            player.splashColorCounts,
                            colorRates
                        );

                        return (
                            <details key={player.player_id} className="player-stats">
                                <summary className="player-stats-header">
                                    <span>{player.player_name}</span>
                                    <span className="draft-count">
                                        {player.draftsPlayed} drafts played
                                    </span>
                                </summary>

                                <div className="player-stats-content">
                                    <h3>Color Combinations (without splash)</h3>
                                    <ColorComboGraph combinationData={combinationData} />

                                    <h3>Colors</h3>
                                    <ColorGraph data={data} />
                                </div>
                            </details>
                        )
                    })}
                </>
            )}
        </div>
    );
}