import { supabase } from "../lib/supabase";
import type { Draft } from "../types";

export type CreateDraftInput = {
    draft_id: string;
    set_name: string;
    date: string;
    draft_type: "Draft" | "Sealed";
    format: "Bo1" | "Bo3" | "Bo5";
    location: string;
};

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

export async function getDrafts() {
    const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .order("date", { ascending: false });

    if (error) throw error;

    return data;
}

export async function getDraftById(id: string): Promise<Draft | null> {
    const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .eq("draft_id", id)
        .maybeSingle();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

export async function getDraftDetails(draftId: string) {
    const [draftRes, playersRes, matchesRes] = await Promise.all([
        supabase
            .from("drafts")
            .select("*")
            .eq("draft_id", draftId)
            .single(),

        supabase
            .from("draft_players")
            .select(`
                *,
                players (
                    id,
                    name
                )
            `)
            .eq("draft_id", draftId),

        supabase
            .from("matches")
            .select("*")
            .eq("draft_id", draftId),
    ]);


    if (draftRes.error) throw draftRes.error;
    if (playersRes.error) throw playersRes.error;
    if (matchesRes.error) throw matchesRes.error;

    return {
        draft: draftRes.data as Draft | null,
        players: playersRes.data || [],
        matches: matchesRes.data || [],
    };
}

export async function createMatch(match: {
    draft_id: string;
    player1_id: string;
    player2_id: string;
    player1_games_won: number;
    player2_games_won: number;
    round: number;
    winner_id?: string;
}) {
    const { data, error } = await supabase
        .from("matches")
        .insert([match])
        .select();

    if (error) {
        throw error;
    }

    return data;
}

export async function updateMatch(
    matchId: string,
    updates: {
        draft_id: string;
        player1_id: string;
        player2_id: string;
        player1_games_won: number;
        player2_games_won: number;
        round: number;
        winner_id?: string;
    }) {
    const { data, error } = await supabase
        .from("matches")
        .update(updates)
        .eq("match_id", matchId)
        .select()
        .single()

    if (error) throw error;

    return data;
}

export async function deleteMatch(matchId: string) {
    const { error } = await supabase
        .from("matches")
        .delete()
        .eq("match_id", matchId)

    if (error) throw error;
}

export async function createDraft(input: CreateDraftInput) {
    const { error } = await supabase.from("drafts").insert([input]);

    if (error) throw error;
}

export async function deleteDraft(draft_id: string) {
    const { error } = await supabase
        .from("drafts")
        .delete()
        .eq("draft_id", draft_id)

    if (error) {
        throw error;
    }
}

export async function addPlayerToDraft(input: {
    draft_id: string;
    player_name: string;
    colors?: string[];
    main_colors?: string[];
    splash_colors?: string[];
}) {

    // Check if player already exists
    let { data: player } = await supabase
        .from("players")
        .select("*")
        .eq("name", input.player_name)
        .single();

    // Create player if not found
    if (!player) {
        const { data: newPlayer, error } = await supabase
            .from("players")
            .insert({ name: input.player_name })
            .select("*")
            .single();

        if (error) throw error;

        player = newPlayer;
    }

    const { data, error } = await supabase
        .from("draft_players")
        .insert({
            draft_id: input.draft_id,
            player_id: player.id,
            main_colors: input.main_colors,
            splash_colors: input.splash_colors,
            placement: 0,
        })
        .select();

    if (error) throw error;

    return data;
}

export async function deletePlayer(playerId: string) {
    const { error } = await supabase
        .from("draft_players")
        .delete()
        .eq("player_id", playerId)

    if (error) throw error;
}

export async function updatePlayer(
    playerId: string,
    draftId: string,
    updates: {
        player_name?: string;
        colors?: string[];
        main_colors?: string[];
        splash_colors?: string[];
    }
) {
    const updateData: {
        player_id?: string;
        main_colors?: string[];
        splash_colors?: string[];
    } = {};

    if (updates.player_name) {
        // Try to find existing player
        let { data: player } = await supabase
            .from("players")
            .select("id")
            .eq("name", updates.player_name)
            .single();

        // Create player if it doesn't exist
        if (!player) {
            const { data: newPlayer, error } = await supabase
                .from("players")
                .insert({ name: updates.player_name })
                .select("id")
                .single();

            if (error) throw error;

            player = newPlayer;
        }

        updateData.player_id = player.id;
    }

    updateData.main_colors = updates.main_colors;
    updateData.splash_colors = updates.splash_colors != undefined ? updates.splash_colors : [];

    const { data, error } = await supabase
        .from("draft_players")
        .update(updateData)
        .eq("player_id", playerId)
        .eq("draft_id", draftId)
        .select()
        .single();

    if (error) throw error;

    return data;
}
export async function getPlayerIdFromNameAndDraft(
    playerName: string,
    draftId: string
) {
    const { data, error } = await supabase
        .from("draft_players")
        .select(`
            player_id,
            players!inner (
                name
            )
        `)
        .eq("draft_id", draftId)
        .eq("players.name", playerName)
        .single();

    if (error) throw error;

    return data.player_id;
}

export async function getPlayerNameFromId(playerId: string) {
    const { data, error } = await supabase
        .from("players")
        .select("name")
        .eq("id", playerId)
        .single();

    if (error) throw error;

    return data.name;
}

export async function getPlayerWinCountForDraft(draftId: string, playerId: string, round: number) {
    const { data, error } = await supabase
        .from("matches")
        .select("winner_id")
        .eq("draft_id", draftId)
        .eq("winner_id", playerId)
        .lt("round", round)

    if (error) {
        throw error;
    }

    return data.length;
}

export async function getNumberOfRoundsPlayed(playerId: string, draftId: string) {
    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("draft_id", draftId)
        .or(`player1_id.eq.${playerId}, player2_id.eq.${playerId}`)

    if (error) {
        throw error;
    }

    return data.length;
}

export async function getPlayerStats(): Promise<PlayerStat[]> {
    const { data: players } = await supabase
        .from("players")
        .select("*");

    const { data: matches } = await supabase
        .from("matches")
        .select("*");

    const { data: draftPlayers } = await supabase
        .from("draft_players")
        .select("*");

    const playerMap = new Map(
        (players ?? []).map(p => [p.id, p.name])
    );

    return (players ?? []).map(player => {
        const playerMatches = matches?.filter(
            m => m.player1_id === player.id || m.player2_id === player.id
        ) ?? [];

        const matchWins = playerMatches.filter(
            m => m.winner_id === player.id
        ).length;

        const matchLosses = playerMatches.length - matchWins;

        let gamesWon = 0;
        let gamesLost = 0;
        const headToHead: Record<string, { wins: number; losses: number }> = {};

        playerMatches.forEach((match) => {
            const opponentId =
                match.player1_id === player.id
                    ? match.player2_id
                    : match.player1_id;

            if (!headToHead[opponentId]) {
                headToHead[opponentId] = { wins: 0, losses: 0 };
            }

            if (match.winner_id === player.id) {
                headToHead[opponentId].wins += 1;
            } else {
                headToHead[opponentId].losses += 1;
            }

            if (match.player1_id === player.id) {
                gamesWon += match.player1_games_won;
                gamesLost += match.player2_games_won;
            } else {
                gamesWon += match.player2_games_won;
                gamesLost += match.player1_games_won;
            }
        });

        const headToHeadNamed: Record<string, { wins: number; losses: number }> = {};

        Object.entries(headToHead).forEach(([opponentId, record]) => {
            const name = playerMap.get(opponentId) ?? "Unknown";

            headToHeadNamed[name] = record;
        });

        const drafts = new Set(
            (draftPlayers ?? [])
                .filter(dp => dp.player_id === player.id)
                .map(dp => dp.draft_id)
        ).size;

        return {
            id: player.id,
            name: player.name,
            drafts,
            matches: playerMatches.length,
            matchWins,
            matchLosses,
            winRate:
                playerMatches.length > 0
                    ? (matchWins / playerMatches.length) * 100
                    : 0,
            gamesWon,
            gamesLost,
            gameWinRate:
                gamesWon + gamesLost > 0
                    ? (gamesWon / (gamesWon + gamesLost)) * 100
                    : 0,
            headToHead: headToHeadNamed,
        };
    });
}