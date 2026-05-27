import { useEffect, useState } from "react";
import { getDrafts, deleteDraft } from "../services/draftServices";
import type { Draft } from "../types";
import CreateDraftForm from "../components/CreateDraftForm";

export default function Home() {
    const [drafts, setDrafts] = useState<Draft[]>([]);

    async function loadDrafts() {
        try {
            const data = await getDrafts();
            setDrafts(data || []);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteDraft(id);
            loadDrafts();
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadDrafts();
    }, []);

    return (
        <div className="main">
            <CreateDraftForm onCreated={loadDrafts} />

            <div className="grid">
                {drafts.map((d) => (
                    <div key={d.draft_id} className="card">
                        <h3>{d.set_name}</h3>
                        <p>{d.draft_type} • {d.format}</p>
                        <p>{new Date(d.date).toLocaleDateString()}</p>
                        <p className="muted">{d.location}</p>

                        <button
                            className="button"
                            onClick={() => handleDelete(d.draft_id)}
                            style={{ marginTop: "10px", background: "#c0392b" }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}