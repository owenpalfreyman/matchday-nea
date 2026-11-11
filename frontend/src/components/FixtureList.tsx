import React from 'react'
import { Card, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'

// Types
export type FixtureRow = {
    id: string | number
    gameweek: number
    fixture_date?: string | null
    start_time?: string | null
    venue?: { name?: string | null } | null
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
                <Card key={gameweek} className="gap-3 p-4">
                    <CardTitle className="text-lg">Gameweek {gameweek}</CardTitle>
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                {/* Styling means that cells are the same width for uniformity */}
                                <TableHead className="w-1/5 px-3 py-2">Home Team</TableHead>
                                <TableHead className="w-1/5 px-3 py-2">Away Team</TableHead>
                                <TableHead className="w-1/5 px-3 py-2">Fixture Date</TableHead>
                                <TableHead className="w-1/5 px-3 py-2">Start Time</TableHead>
                                <TableHead className="w-1/5 px-3 py-2">Venue</TableHead>
                                <TableHead className="w-1/5 px-3 py-2">Actions</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((fixture) => (
                                <TableRow key={fixture.id}>
                                    {/* Styling makes sure that the columns are truncated and have padding for better readability */}
                                    <TableCell className="truncate px-3 py-2">{fixture.home_team?.name ?? '-'}</TableCell>
                                    <TableCell className="truncate px-3 py-2">{fixture.away_team?.name ?? '-'}</TableCell>
                                    <TableCell className="truncate px-3 py-2">{fixture.fixture_date ?? 'No Date Set'}</TableCell>
                                    <TableCell className="truncate px-3 py-2">{fixture.start_time ?? 'No Time Set'}</TableCell>
                                    <TableCell className="truncate px-3 py-2">{fixture.venue?.name ?? '-'}</TableCell>
                                    <TableCell className="truncate px-3 py-2"><Button>Manage</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ))}
        </div>
	)
}

export default FixtureList
 