import FixtureList, { type FixtureRow } from '@/components/FixtureList'
import GenerateFixtures from '@/components/GenerateFixtures'
import getLeagueFixtures from '@/lib/get-league-fixtures'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Scheduler = () => {
	const { leagueId } = useParams<{ leagueId: string }>()
	const [fixtures, setFixtures] = useState<FixtureRow[] | null>(null)

	const loadFixtures = useCallback(async () => {
		// Check to make sure that there is a league ID
		if (!leagueId) {
			setFixtures([])
			return
		}

		// Set the fixtures and call the getLeagueFixtures function
		setFixtures(await getLeagueFixtures(Number(leagueId)))
	}, [leagueId])

	// Load the fixtures when the component mounts
	useEffect(() => { void loadFixtures() }, [loadFixtures])

	// Whiilst loading
	if (fixtures === null) return <p>Loading...</p>

	return fixtures.length === 0
		? <GenerateFixtures leagueId={leagueId ?? ''} onGenerated={loadFixtures} />
		: <FixtureList fixtures={fixtures} />
}

export default Scheduler
