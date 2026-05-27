import { useState } from "react";
import { createDraft } from "../services/draftServices";

type Props = {
    onCreated?: () => void;
}

export default function CreateDraftForm({ onCreated }: Props) {
    const [setName, setSetName] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<"Draft" | "Sealed">("Draft");
    const [format, setFormat] = useState<"Bo1" | "Bo3" | "Bo5">("Bo3");
    const [location, setLocation] = useState("");

    async function handleCreateDraft(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await createDraft({
                draft_id: crypto.randomUUID(),
                set_name: setName,
                date,
                draft_type: type,
                format,
                location,
            });

            onCreated?.();

            setSetName("");
            setDate("");
            setLocation("");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>MTG Draft Tracker</h1>

            <form className="card form" onSubmit={handleCreateDraft}>
                <h2>Create Draft</h2>

                <input
                    placeholder="Set name"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    required
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <select value={type} onChange={(e) => setType(e.target.value as any)}>
                    <option value="Draft">Draft</option>
                    <option value="Sealed">Sealed</option>
                </select>

                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                >
                    <option value="Bo3">Bo3</option>
                    <option value="Bo1">Bo1</option>
                    <option value="Bo5">Bo5</option>
                </select>

                <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <button className="button" type="submit">
                    Create Draft
                </button>
            </form>
        </div>
    );
}