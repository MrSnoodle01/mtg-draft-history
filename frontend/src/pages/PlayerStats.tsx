import { useNavigate } from "react-router-dom"

export default function PlayerStats() {
    const navigate = useNavigate();

    return (
        <div className="main">
            <button className="button" onClick={() => navigate("/")}>
                ← Back
            </button>
            <h1>hehehe player stats</h1>
        </div>
    )
}