import React, { useState } from 'react'
import { Card } from './ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from './ui/field'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'

const CreateLeagueForm = () => {
    const [leagueName, setLeagueName] = useState("")
    const [teamBased, setTeamBased] = useState<boolean | null>(null)
    const [teamLeagueType, setTeamLeagueType] = useState("")
    const [bestOf, setBestOf] = useState<string | undefined>()
    const [includeDoubles, setIncludeDoubles] = useState(false)

    // isTeamRoundRobin is set to true is the team league type is set to "team-round-robin"
    const isTeamRoundRobin = teamLeagueType === "team-round-robin"

    // Reset dependent state when the league type changes
    function handleTeamBasedChange(value: string) {
        setTeamBased(value === "true")
        setTeamLeagueType("")
        setBestOf(undefined)
        setIncludeDoubles(false)
    }

    // Reset best of and doubles when the team league type changes
    function handleTeamLeagueTypeChange(value: string) {
        setTeamLeagueType(value)
        setBestOf(undefined)
        setIncludeDoubles(false)
    }

    async function createLeague() {
        if (!leagueName.trim()) {
            alert("Please enter a league name")
            return
        } // Length checks for the name
        if (leagueName.length < 3 || leagueName.length > 41) {
            alert("Please enter a name between 4 and 41 characters")
            return
        }

        console.log({ leagueName, teamBased, teamLeagueType, bestOf, includeDoubles })
        // Todo: Logic for the creation of a league in the table
    }

  return (
    <Card className="mx-auto w-full max-w-md p-6">
        <FieldSet>
            <FieldLegend>Create League</FieldLegend>
            <FieldDescription>Now, time to make a league?</FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">League Name</FieldLabel>
                    <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Division 1"
                        value={leagueName}
                        onChange={(e) => setLeagueName(e.target.value)}
                    />
                    <FieldDescription>
                        This is how users will search and join your league.
                    </FieldDescription>
                </Field>

                <FieldSet>
                    <FieldLegend variant="label">League Type</FieldLegend>
                    <RadioGroup
                        value={teamBased === null ? undefined : String(teamBased)}
                        onValueChange={handleTeamBasedChange}
                    >
                        <FieldLabel htmlFor="team-based">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Team based</FieldTitle>
                                    <FieldDescription>
                                        Teams compete against each other, e.g. a football league.
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem value="true" id="team-based" />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="individual">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Individual players</FieldTitle>
                                    <FieldDescription>
                                        Players compete one-on-one in their own standings.
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem value="false" id="individual" />
                            </Field>
                        </FieldLabel>
                    </RadioGroup>
                </FieldSet>

                {/* Inputs for if the league type is Team Based */}
                {teamBased === true && (
                    <FieldSet>
                        <FieldLegend variant="label">Team League Type</FieldLegend>
                        <RadioGroup value={teamLeagueType} onValueChange={handleTeamLeagueTypeChange}>
                            <FieldLabel htmlFor="team-vs-team">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Team vs Team</FieldTitle>
                                        <FieldDescription>
                                            Simple game of one team against another - like a football game.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="team-vs-team" id="team-vs-team" />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="team-round-robin">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Team Round Robin</FieldTitle>
                                        <FieldDescription>
                                            Every player in one team will player every player in the other.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="team-round-robin" id="team-round-robin" />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                    </FieldSet>
                )}

                {/* Inputs for if the league is a Team Round Robin */}
                {teamBased === true && isTeamRoundRobin && (
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="bestOf">
                                    <Select value={bestOf} onValueChange={setBestOf}>
                                        <SelectTrigger id="bestOf">
                                            <SelectValue placeholder="Select number of sets" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="7">7</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription>
                                        The maximum number of sets to be played in each game.
                                    </FieldDescription>
                                </FieldLabel>
                            </Field>

                            <FieldGroup className="w-full max-w-sm">
                                <FieldLabel htmlFor="switch-doubles">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Include Doubles</FieldTitle>
                                            <FieldDescription>
                                                Have a doubles match included within the team round robin - this will contribute to the team sets.
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch id="switch-doubles" checked={includeDoubles} onCheckedChange={setIncludeDoubles} />
                                    </Field>
                                </FieldLabel>
                            </FieldGroup>

                        </FieldGroup>
                    </FieldSet>
                )}

                {/* Inputs for if the league is not team-based */}
                {teamBased === false && teamBased !== null && (
                    <Field>
                        <FieldLabel htmlFor="bestOf">
                            <Select value={bestOf} onValueChange={setBestOf}>
                                <SelectTrigger id="bestOf">
                                    <SelectValue placeholder="Select number of sets" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="7">7</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                The maximum number of sets to be played in each game.
                            </FieldDescription>
                        </FieldLabel>
                    </Field>
                )}

                <Button className="mt-4" onClick={createLeague}>
                    Create League
                </Button>

            </FieldGroup>
        </FieldSet>
    </Card>
  )
}

export default CreateLeagueForm