import { useState } from "react";
import type { Draft } from "../types/draft";

type Props = {
    onCreate: (draft: Draft) => void;
};

export default function CreateDraftForm({ onCreate }: Props) {
    const [set, setSet] = useState("");
    const [type, setType] = useState<"Draft" | "Sealed">("Draft");
    const [format, setFormat] = useState<"Bo1" | "Bo3" | "Bo5">("Bo3");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newDraft: Draft = {
            draftId: crypto.randomUUID(),
            date: new Date().toISOString(),
            set,
            type,
            format,
            location,
        };

        onCreate(newDraft);

        setSet("");
        setLocation("");
    }

    return (
        <form className="card form" onSubmit={handleSubmit}>
            <h2>Create Draft</h2>

            <input
                placeholder="Set"
                value={set}
                onChange={(e) => setSet(e.target.value)}
                required
            />

            <select value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="Draft">Draft</option>
                <option value="Sealed">Sealed</option>
            </select>

            <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
                <option value="Bo1">Bo1</option>
                <option value="Bo3">Bo3</option>
                <option value="Bo5">Bo5</option>
            </select>

            <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
            />

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />

            <button className="button" type="submit">
                Create Draft
            </button>
        </form>
    );
}