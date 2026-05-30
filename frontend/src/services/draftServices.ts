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
            .select("*")
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
    colors: string[];
}) {
    const { data, error } = await supabase
        .from("draft_players")
        .insert([
            {
                draft_id: input.draft_id,
                player_name: input.player_name,
                colors: input.colors,
                placement: 0,
            },
        ])
        .select();

    if (error) {
        throw error;
    }

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
    updates: {
        player_name?: string;
        colors?: string[];
        placement?: number;
    }
) {
    const { data, error } = await supabase
        .from("draft_players")
        .update(updates)
        .eq("player_id", playerId)
        .select()
        .single()

    if (error) throw error;

    return data;
}

export async function getPlayerIdFromNameAndDraft(playerName: string, draftId: string) {
    const { data, error } = await supabase
        .from("draft_players")
        .select("player_id")
        .eq("draft_id", draftId)
        .eq("player_name", playerName)
        .single()

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error(`No player found for ${playerName}`);
    }

    return data.player_id;
}

export async function getPlayerNameFromId(playerId: string) {
    const { data, error } = await supabase
        .from("draft_players")
        .select("player_name")
        .eq("player_id", playerId)
        .single()

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error(`No player found for ${playerId}`)
    }

    return data.player_name;
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