import { useEffect, useState } from "react";
import { getDrafts, deleteDraft } from "../services/draftServices";
import { useNavigate } from "react-router-dom";
import type { Draft } from "../types";
import CreateDraftForm from "../components/CreateDraftForm";
import EnterPassword from "../components/EnterPassword";
import { useAuth } from "../components/AuthContext";

export default function Home() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const { session } = useAuth();
    const isLoggedIn = !!session;
    const navigate = useNavigate();

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
            <h1>MTG Draft Tracker</h1>

            <div className="nav">
                <button
                    className="button"
                    onClick={() => navigate(`/playerStats`)}
                >
                    View Player Stats
                </button>

                <EnterPassword />
            </div>

            {isLoggedIn && <CreateDraftForm onCreated={loadDrafts} />}

            <div className="grid">
                {drafts.map((d) => (
                    <div
                        key={d.draft_id}
                        className="card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/draft/${d.draft_id}`)}
                    >
                        <h3>{d.set_name}</h3>
                        <p>{d.draft_type} • {d.format}</p>
                        <p>{new Date(d.date).toLocaleDateString()}</p>
                        <p className="muted">{d.location}</p>

                        {isLoggedIn && <button
                            className="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(d.draft_id)
                            }}
                            style={{ marginTop: "10px", background: "#c0392b" }}
                        >
                            Delete
                        </button>}
                    </div>
                ))}
            </div>
        </div>
    );
}