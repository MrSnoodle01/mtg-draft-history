import { useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "admin@example.com";

export default function EnterPassword() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmitPassword() {
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password,
        });

        if (error) {
            setError("Incorrect password");
        }

        setLoading(false);
    }

    return (
        <div>
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="button"
                disabled={loading}
                onClick={onSubmitPassword}
            >
                {loading ? "Signing In..." : "Enter Password"}
            </button>

            {error && <p>{error}</p>}
        </div>
    );
}