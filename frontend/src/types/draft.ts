import { Color } from "./enums";

export type Draft = {
    draftId: string;
    date: string;
    set: string;
    type: "draft" | "sealed";
    format: "Bo1" | "Bo3" | "Bo5";
    location: string;
}

export type DraftPlayer = {
    playerId: string;
    draftId: string;
    placement: number;
    colors: Color[];
}