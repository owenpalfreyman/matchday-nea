import React from 'react'
import { Card, CardTitle } from './ui/card'

// Types
export type FixtureRow = {
    id: string | number
    gameweek: number
    fixture_date?: string | null
    home_team?: { name?: string | null } | null
    away_team?: { name?: string | null } | null
}

const FixtureList = ({ fixtures}: { fixtures: FixtureRow[] }) => {
	// Group fixtures by gameweek
	const byGameweek = new Map<number, FixtureRow[]>()
	for (const fixture of fixtures) {
		byGameweek.set(fixture.gameweek, [...(byGameweek.get(fixture.gameweek) || []), fixture])
	}

	return (
		<div className="space-y-4">
            {/* Render fixtures by gameweek */}
            {[...byGameweek.entries()].map(([gameweek, items]) => (
                <Card key={gameweek}>
                    <CardTitle>Gameweek {gameweek}</CardTitle>
                    <ul>
                        {items.map((f) => (
                            <li key={f.id}>
                                {f.home_team?.name} vs {f.away_team?.name}
                                {f.fixture_date ? ` - ${f.fixture_date}` : ' - no date set'}
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>
	)
}

export default FixtureList
 