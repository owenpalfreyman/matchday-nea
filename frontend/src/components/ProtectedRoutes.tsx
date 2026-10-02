import { Outlet, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react";
import { type Session } from "@supabase/supabase-js";

const ProtectedRoutes = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession() // Loads current session from Supabase

                // Log the error if needed
                if (error) {
                    console.error(error)
                } else {
                    const session = data.session
                    setSession(session)
                }
            } finally {
                setLoading(false)
            }
        };

        // Subscribe to changes in the auth state and update the session
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        });

        loadSession();

        return () => {
            // Unsubscribe from the auth state changes when the component unmounts
            subscription.unsubscribe()
        }
    }, []);

    if (loading) return null

    // If there is a session render outlet, but otherwise redirect to login page
    return session ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoutes