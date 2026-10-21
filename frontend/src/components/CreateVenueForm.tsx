import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { supabase } from '@/lib/supabase'
import getOrganisationId from '@/lib/get-current-organisation-id'
import { Button } from './ui/button'

// TODO: Make the form have the list update.

const CreateVenueForm = () => {
    const [venueName, setVenueName] = useState("")
    const [leagues, setLeagues] = useState<{ id: string; name: string }[]>([])
    const [selectedLeague, setSelectedLeague] = useState("")

    useEffect(() => {
        // Get the leagues which will be rendered in the dropdown
        async function getLeagues() {
            const organisation = await getOrganisationId()

            // Database query
            const { data: leagues, error: leaguesError } = await supabase
                .from("leagues")
                .select("id, name")
                .eq("organisation_id", organisation.organisationId)
                .order("name", { ascending: true })

            // Error handling
            if (leaguesError) {
                console.error("Error fetching leagues.", leaguesError)
                return
            }

            // Set the leagues as the data returned
            setLeagues(leagues ?? [])
        }

        getLeagues()
    }, [])

    // Checks inputs and inserts into the table
    async function createVenue() {
        const trimmedVenueName = venueName.trim()

        // Length check
        if (trimmedVenueName.length > 40) {
            alert("Venue name must be 40 characters or fewer")
            return
        }

        // General check for missing inputs
        if (!trimmedVenueName || !selectedLeague) {
            alert("Please enter a venue name and select a league")
            return
        }

        const organisation = await getOrganisationId()

        // Insert into the table
        const { data, error: venueInsertError } = await supabase
            .from("venues")
            .insert({
                name: trimmedVenueName,
                organisation_id: organisation.organisationId,
                league_id: selectedLeague,
            })
        
        if (venueInsertError) {
            console.error("Error inserting the record.", venueInsertError)
            alert("Venue not created - something went wrong.")
            return
        }

        setVenueName("")
        setSelectedLeague("")
    }

  return (
        <Card className="w-full max-w-md p-6">
            <FieldSet>
                <FieldLegend>Add League Venue</FieldLegend>
                <FieldDescription>
                    Add a venue to a league so it can be used across all league games.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="league">League</FieldLabel>
                        <Select
                            value={selectedLeague || undefined}
                            onValueChange={(value) => setSelectedLeague(value ?? "")}
                        >
                            <SelectTrigger id="league" className="w-full">
                                <SelectValue placeholder="Select a league">
                                    {(value) => leagues.find((league) => league.id === value)?.name ?? "Select a league"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {leagues.map((league) => (
                                    <SelectItem key={league.id} value={league.id}>
                                        {league.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="name">Venue Name</FieldLabel>
                        <Input
                            id="name"
                            autoComplete="off"
                            placeholder="Venue"
                            value={venueName}
                            onChange={(e) => setVenueName(e.target.value)}
                        />
                    </Field>
 
                    <Button className="mt-4" onClick={createVenue}>
                        Add Venue
                    </Button>
                </FieldGroup>
            </FieldSet>
        </Card>
    )
}
 
export default CreateVenueForm
