import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { generateFixtures, type NewFixture, type TeamInput } from '@/lib/generate-schedule'
import getLeagueTeams from '@/lib/get-league-teams'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from './ui/field'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const formatItems = [
    { label: 'Single round robin', value: 'single' },
    { label: 'Double round robin', value: 'double' },
]

type GenerateFixturesProps = {
    leagueId: string
}

const GenerateFixtures = ({ leagueId }: GenerateFixturesProps) => {
    const [teams, setTeams] = useState<TeamInput[]>([])
    const [format, setFormat] = useState<"single" | "double">("single")
    const [forceHomeVenue, setForceHomeVenue] = useState(undefined)
    const [fixtures, setFixtures] = useState<NewFixture[]>([])

    useEffect(() => {
        // Function to get the teams in the lague
        async function fetchTeams() {
            const teamsData = await getLeagueTeams(leagueId)

            if (!teamsData) {
                setTeams([])
                return
            }

            // Set the teams with the relevant home venue ID
            setTeams(
                teamsData.map((team) => ({
                    id: Number(team.id),
                    home_venue_id: team.home_venue_id === null
                        ? null
                        : Number(team.home_venue_id),
                }))
            )
        }

        void fetchTeams()
    }, [leagueId])

    function handleGenerate() {
        // Empty validation check
        if (forceHomeVenue === undefined) return

        // Otherwise run the function
        const generatedFixtures = generateFixtures(teams, { format, forceHomeVenue })
        setFixtures(generatedFixtures)
        console.log('Generated fixtures:', generatedFixtures)
    }
    
    return (
        <Card>
            <CardTitle>Generate Fixtures</CardTitle>
            <CardDescription>
                You currently have no fixtures for this league. Click the button below to generate them.
            </CardDescription>

            <FieldSet>
                <Field>
                    <FieldLabel htmlFor="fixture-format">Format</FieldLabel>
                    <Select
                        items={formatItems}
                        value={format}
                        onValueChange={(value) => {
                            if (value === "single" || value === "double") {
                                setFormat(value)
                            }
                        }}
                    >
                        <SelectTrigger id="fixture-format" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {formatItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldDescription>
                        Choose whether teams play each other once or home and away.
                    </FieldDescription>
                </Field>

                <FieldSet>
                    <FieldLegend variant="label">Force home fixtures</FieldLegend>
                    <RadioGroup
                        value={String(forceHomeVenue)}
                        onValueChange={(value) => setForceHomeVenue(value === "true")}
                    >
                        <FieldLabel htmlFor="force-home-yes">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Yes</FieldTitle>
                                    <FieldDescription>
                                        Always use the home team's venue.
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem value="true" id="force-home-yes" />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="force-home-no">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>No</FieldTitle>
                                    <FieldDescription>
                                        Leave the fixture venue unset.
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem value="false" id="force-home-no" />
                            </Field>
                        </FieldLabel>
                    </RadioGroup>
                </FieldSet>
            </FieldSet>

            <Button onClick={handleGenerate} disabled={forceHomeVenue === undefined}>
                Generate Fixtures
            </Button>
        </Card>
    )
}

export default GenerateFixtures