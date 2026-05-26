export const Color = {
    White: "W",
    Blue: "U",
    Black: "B",
    Red: "R",
    Green: "G"
} as const;

export type Color = typeof Color[keyof typeof Color];