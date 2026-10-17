import CreateTeamForm from '@/components/CreateTeamForm';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Get the league with the matching leagueId which is passed in
async function getLeague(leagueId: string) {
    const { data: league, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

    // Error handling
    if (error) {
        console.error('Error fetching league:', error);
        return null;
    }

    return league;
}


const League = () => {
    const { leagueId } = useParams();
    const [league, setLeague] = useState(null);

    useEffect(() => {
        if (!leagueId) return;

        // Fetch the league data when the component mounts or when leagueId changes
        const fetchLeague = async () => {
            const league = await getLeague(leagueId);
            setLeague(league);
        };

        fetchLeague();
    }, [leagueId]);

    

  return (
    <>
    <div>League: {leagueId}</div>
    <CreateTeamForm leagueId={leagueId} />
    </>
  )
}

export default League