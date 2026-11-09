export type TeamInput = {
    id: number
    home_venue_id: number | null
}
 
// Options chosen by the admin before generating
export type FixtureOptions = {
    format: 'single' | 'double'
    forceHomeVenue: boolean
}
 
// Structure for each fixture
export type NewFixture = {
    home_team_id: number
    away_team_id: number
    gameweek: number
    venue_id: number | null
}


export function generateFixtures(teams: TeamInput[], { format, forceHomeVenue }: FixtureOptions): NewFixture[] {
    const venueOf = new Map(teams.map((t) => [t.id, t.home_venue_id]))

    // Circle of rotation
    const rotation: (number | null)[] = teams.map((t) => t.id)

    // Odd number of teams: there is a "bye" week represented by null
    if (rotation.length % 2) rotation.push(null)

    const n = rotation.length
    const rounds = n - 1        // each team plays every other team once over n - 1 rounds
    const fixtures: NewFixture[] = []

    // Helper that builds a fixture in its final shape and adds it to the list.
    const add = (home: number, away: number, gameweek: number) =>
        fixtures.push({
            home_team_id: home,
            away_team_id: away,
            gameweek,
            venue_id: forceHomeVenue ? (venueOf.get(home) ?? null) : null,
        })

        for (let r = 0; r < rounds; r++) {
        // Pair the first team with the last, second with second-last, and so on
        for (let i = 0; i < n / 2; i++) {
            const a = rotation[i]
            const b = rotation[n - 1 - i]
 
            // If one of the pair is the bye, that team has no match this round
            if (a === null || b === null) continue
 
            // Alternate home and away so teams don't always host
            const [home, away] = (i + r) % 2 === 0 ? [a, b] : [b, a]
            add(home, away, r + 1)
 
            // Double round robin: the reverse fixture is played in the second half
            // of the season, so its gameweek is shifted on by the number of rounds
            if (format === 'double') add(away, home, r + 1 + rounds)
        }
 
        rotation.splice(1, 0, rotation.pop()!)
    }
 
    return fixtures
}
