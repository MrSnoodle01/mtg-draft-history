import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const AuthContext = createContext<{
    session: Session | null;
}>({
    session: null,
});

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);