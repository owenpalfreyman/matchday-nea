import { useState } from 'react'
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
import { supabase } from '@/lib/supabase'

const CreateLeagueForm = () => {
    // useStates
    const [leagueName, setLeagueName] = useState("")
    const [teamBased, setTeamBased] = useState<boolean | null>(null)
    const [teamLeagueType, setTeamLeagueType] = useState<string | null>(null)
    const [bestOf, setBestOf] = useState<string | undefined>()
    const [includeDoubles, setIncludeDoubles] = useState(false)
    const [useDefaultRoster, setUseDefaultRoster] = useState(false)
    const [minSquadSize, setMinSquadSize] = useState<number>()
    const [maxSquadSize, setMaxSquadSize] = useState<number>()
    const [squadSize, setSquadSize] = useState<number>()



    // isTeamRoundRobin is set to true if the team league type is set to "team-round-robin"
    const isTeamRoundRobin = teamLeagueType === "team-round-robin"

    // Reset dependent state when the league type changes
    function handleTeamBasedChange(value: string) {
        setTeamBased(value === "true")
        setTeamLeagueType(null)
        setBestOf(undefined)
        setIncludeDoubles(false)
        setMaxSquadSize(undefined)
        setMinSquadSize(undefined)
        setSquadSize(undefined)
    }

    // Reset values when the team league type changes
    function handleTeamLeagueTypeChange(value: string) {
        setTeamLeagueType(value)
        setBestOf(undefined)
        setIncludeDoubles(false)
        setMaxSquadSize(undefined)
        setMinSquadSize(undefined)
        setSquadSize(undefined)
        setUseDefaultRoster(false)
    }

    function handleUseDefaultRosterChange(value: boolean) {
        setUseDefaultRoster(value)
        setMaxSquadSize(undefined)
        setMinSquadSize(undefined)
        setSquadSize(undefined)
    }

    // Checks inputs and pushes the data into the table
    async function createLeague() {
        if (!leagueName.trim()) {
            alert("Please enter a league name")
            return
        } // Length checks for the name
        if (leagueName.length < 3 || leagueName.length > 41) {
            alert("Please enter a name between 4 and 41 characters")
            return
        }

        // Following block should only run if teamBased
        if (teamBased) {
            // Default rosters use one squad size
            if (useDefaultRoster) {
                if (squadSize === undefined) {
                    alert("Please enter a squad size")
                    return
                }
                // Range checks for the squadSize
                if (squadSize < 1) {
                    alert("Please enter a valid squad size")
                    return
                }
            } else {
                // Checks to see if either value is undefined
                if (minSquadSize === undefined || maxSquadSize === undefined) {
                    alert("Please enter a minimum and maximum squad size")
                    return
                }
                // Checks to see if either the maximum or minimum squad size is less than 1
                if (minSquadSize < 1 || maxSquadSize < 1) {
                    alert("Please enter a valid squad size")
                    return
                }
                // Checks for whether the minimum squad size is greater than the maximum squad size
                if (minSquadSize > maxSquadSize) {
                    alert("The minimum squad size cannot be greater than the maximum squad size")
                    return
                }
            }
        }

        // Checks to make sure the best of value is entered when appropriate
        if (teamLeagueType !== "team-vs-team") {
            if (bestOf === undefined) {
                alert("Please enter a best of value")
                return
            }
        }

            // Fetch authenticated user
            const { data: authData, error: authError } = await supabase.auth.getUser()

            if (authError) {
                console.error("User could not be found.", authError)
                return
            }

            // Get the user's organisation for the insert
            const { data: organisation, error: orgError } = await supabase
                .from("organisations")
                .select("id")
                .single()

            // Check to see if the user an admin to perform this action
            const { data: member, error: memberError } = await supabase
                .from("organisation_members")
                .select("role")
                .eq("organisation_id", organisation?.id)
                .eq("user_id", authData.user.id)
                .single()
                
            if (memberError) {
                console.error("User not found or does not have the required role", memberError)
                alert("League not created - user not found or does not have the required role.")
                return
            }

            // Insert record into leagues
            const leagueMinSquadSize = useDefaultRoster ? squadSize : minSquadSize
            const leagueMaxSquadSize = useDefaultRoster ? squadSize : maxSquadSize

            // Function to convert the result format
            function getResultFormat(): string {
                if (teamBased === false) return "PlayerVsPlayer"
                if (teamLeagueType === "team-round-robin") return "TeamRoundRobin"
                return "TeamVsTeam"
            }

            if (member.role === "admin") {
                const { data: league, error: insertError } = await supabase
                    .from("leagues")
                    .insert({
                        name: leagueName.trim(),
                        organisation_id: organisation?.id,
                        is_team_based: teamBased,
                        result_format: getResultFormat(),
                        best_of: bestOf ? parseInt(bestOf) : null,
                        include_doubles: includeDoubles,
                        uses_default_roster: useDefaultRoster,
                        min_squad_size: leagueMinSquadSize,
                        max_squad_size: leagueMaxSquadSize
                    })
                if (insertError) {
                    console.error("Error inserting the record.", insertError)
                } else {
                    console.log(league)
                }
            }
        }

  return (
    <Card className="w-full max-w-md p-6">
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
                        <RadioGroup value={teamLeagueType ?? ""} onValueChange={handleTeamLeagueTypeChange}>
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

                {/* Inputs for if the league is team vs team */}
                {teamBased === true && teamLeagueType === "team-vs-team" && (
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Min Squad Size</FieldLabel>
                            <Input
                                id="minSquadSize"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                step={1}
                                value={minSquadSize ?? ""}
                                onChange={(event) => setMinSquadSize(event.target.value ? Number(event.target.value) : undefined)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Max Squad Size</FieldLabel>
                            <Input
                                id="maxSquadSize"
                                type="number"
                                inputMode="numeric"
                                min={minSquadSize ?? 1}
                                step={1}
                                value={maxSquadSize ?? ""}
                                onChange={(event) => setMaxSquadSize(event.target.value ? Number(event.target.value) : undefined)}
                            />
                        </Field>
                    </FieldGroup>
                )}

                {/* Inputs for if the league is a Team Round Robin */}
                {teamBased === true && isTeamRoundRobin && (
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="bestOf">
                                    <Select value={bestOf} onValueChange={(value) => setBestOf(value ?? undefined)}>
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
                                <FieldLabel htmlFor="switch-default-roster">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Use a Default Roster</FieldTitle>
                                            <FieldDescription>
                                                Have each team use a default roster - each player in a team will play every match.
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch id="switch-default-roster" checked={useDefaultRoster} onCheckedChange={handleUseDefaultRosterChange} />
                                    </Field>
                                </FieldLabel>
                            </FieldGroup>

                        </FieldGroup>
                    </FieldSet>
                )}

                {/* Inputs if the league uses a default roster */}
                {teamBased === true && isTeamRoundRobin && useDefaultRoster === true && (
                    <Field>
                        <FieldLabel htmlFor="squadSize">Default Roster Squad Size</FieldLabel>
                        <Input
                            id="squadSize"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            value={squadSize ?? ""}
                            onChange={(event) =>
                                setSquadSize(event.target.value ? Number(event.target.value) : undefined
                                )
                            }
                        />
                    </Field>
                )}

                {/* Inputs if the league does not use a default roster */}
                {teamBased === true && isTeamRoundRobin && useDefaultRoster === false && (
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Min Squad Size</FieldLabel>
                            <Input
                                id="minSquadSize"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                step={1}
                                value={minSquadSize ?? ""}
                                onChange={(event) => setMinSquadSize(event.target.value ? Number(event.target.value) : undefined)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Max Squad Size</FieldLabel>
                            <Input
                                id="maxSquadSize"
                                type="number"
                                inputMode="numeric"
                                min={minSquadSize ?? 1}
                                step={1}
                                value={maxSquadSize ?? ""}
                                onChange={(event) => setMaxSquadSize(event.target.value ? Number(event.target.value) : undefined)}
                            />
                        </Field>
                    </FieldGroup>
                )}


                {/* Inputs for if the league is not team-based */}
                {teamBased === false && teamBased !== null && (
                    <Field>
                        <FieldLabel htmlFor="bestOf">
                            <Select value={bestOf} onValueChange={(value) => setBestOf(value ?? undefined)}>
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