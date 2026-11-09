import GenerateFixtures from '@/components/GenerateFixtures'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Scheduler = () => {
	const { leagueId } = useParams<{ leagueId: string }>()
	const [hasFixtures, setHasFixtures] = useState<boolean | null>(null)

	useEffect(() => {
		// Function to get the fixtures
		async function getFixtures() {
			if (!leagueId) {
				return
			}

			// Database query for fixtures
			const { data: fixtures, error } = await supabase
				.from('fixtures')
				.select('*')
				.eq('league_id', leagueId)
				.maybeSingle()

			// Error handling
			if (error) {
				console.error('Error fetching fixtures:', error)
				return
			}

			// Fixtures is either true or false based on whether any exist
			setHasFixtures(fixtures !== null)
		}

		void getFixtures()
	}, [leagueId])

	// If no fixtures exist, render the GenerateFixtures component
	if (hasFixtures === false && leagueId) {
		return <GenerateFixtures leagueId={leagueId} />
	}

	return <div>{hasFixtures ? 'Fixtures found' : 'Scheduler'}</div>
}

export default Scheduler
