import { supabase } from "../lib/supabase";

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

export async function createDraft(input: CreateDraftInput) {
    const { error } = await supabase.from("drafts").insert([input]);

    if (error) throw error;
}