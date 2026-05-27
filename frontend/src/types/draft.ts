import { Color } from "./enums";

export type Draft = {
    draft_id: string;
    date: string;
    set_name: string;
    draft_type: "Draft" | "Sealed";
    format: "Bo1" | "Bo3" | "Bo5";
    location: string;
}

export type DraftPlayer = {
    playerId: string;
    draftId: string;
    placement: number;
    colors: Color[];
}