import { useEffect, useState } from "react";
import { getDrafts, deleteDraft } from "../services/draftServices";
import { useNavigate } from "react-router-dom";
import type { Draft } from "../types";
import CreateDraftForm from "../components/CreateDraftForm";

export default function Home() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
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

    function onSubmitPassword(input: string) {
        if (input == '555') {
            alert("balls");
            setLoggedIn(true);
        }
    }

    useEffect(() => {
        loadDrafts();
    }, []);

    return (
        <div className="main">
            <h1>MTG Draft Tracker</h1>

            <button
                className="button"
                onClick={() => navigate(`/playerStats`)}
            >
                View Player Stats
            </button>

            <input
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="button"
                onClick={() => onSubmitPassword(password)}
            >
                enter password
            </button>

            <CreateDraftForm onCreated={loadDrafts} />

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

                        {loggedIn && <button
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