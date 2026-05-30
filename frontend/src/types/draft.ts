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
    player_name: string;
    player_id: string;
    draft_id: string;
    placement: number;
    colors: Color[];
}