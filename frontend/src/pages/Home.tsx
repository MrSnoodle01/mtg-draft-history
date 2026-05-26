import { useState } from "react";
import { Link } from "react-router-dom";
import type { Draft } from "../types/draft";
import CreateDraftForm from "../components/CreateDraftForm";

export default function Home() {
    const [drafts, setDrafts] = useState<Draft[]>([]);

    function handleCreate(draft: Draft) {
        setDrafts((prev) => [draft, ...prev]);
    }

    return (
        <div className="main">
            <h1>MTG Draft Tracker</h1>

            <CreateDraftForm onCreate={handleCreate} />

            <h2 style={{ marginTop: "2rem" }}>Drafts</h2>

            {drafts.map((d) => (
                <Link key={d.draftId} to={`/draft/${d.draftId}`}>
                    <div className="card">
                        <h3>{d.set}</h3>
                        <p>{d.type} • {d.format}</p>
                        <p>{d.location}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}