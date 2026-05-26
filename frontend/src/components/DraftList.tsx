import type { Draft } from "../types/draft";

type Props = {
    drafts: Draft[];
};

export default function DraftList({ drafts }: Props) {
    if (drafts.length === 0) {
        return <p className="muted">No drafts yet.</p>;
    }

    return (
        <div className="grid">
            {drafts.map((d) => (
                <div key={d.draftId} className="card">
                    <h3>{d.set}</h3>
                    <p className="muted">{d.type.toUpperCase()}</p>
                    <p>Format: {d.format}</p>
                    <p>{d.location}</p>
                </div>
            ))}
        </div>
    );
}