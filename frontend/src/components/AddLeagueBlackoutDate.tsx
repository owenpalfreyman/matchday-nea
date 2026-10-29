import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Card } from './ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Button } from './ui/button'

type AddBlackoutProps = {
    leagueId: string
}

const AddLeagueBlackoutDate = ({ leagueId }: AddBlackoutProps) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [description, setDescription] = useState("")

    const handleSubmit = async () => {
        // 1. Handle the dateRange, and convert it to YYYY/MM/DD for Supabase
        let startDate = dateRange?.from?.toLocaleDateString("sv-SE");
        let endDate = dateRange?.to?.toLocaleDateString("sv-SE")
    
        // 2. Call the function to upload the data to the table
        await addLeagueBlackout(startDate, endDate)
    }
    
    async function addLeagueBlackout(startDate: string, endDate: string) {
        // Data Insertion
        const { data: addLeagueBlackoutData, error: addLeagueBlackoutError} = await supabase
            .from("league_blackouts")
            .insert({
                league_id: leagueId,
                start_date: startDate,
                end_date: endDate,
                description: description,
            })
    
        if (addLeagueBlackoutError) {
            console.error("Error adding blackout for this venue.", addLeagueBlackoutError)
        }
    
    }

  return (
    <Card className="w-full max-w-3xl p-6 shadow-sm">
            <FieldSet className="gap-6">
                <FieldLegend className="text-lg">Add League Blackout Date</FieldLegend>
                <FieldDescription>
                    Add a window of no availability in this league for this date.
                </FieldDescription>
                <FieldGroup className="gap-4">
                    <Field>
                        {/* User selects the start and end dates for the blackout */}
                        <FieldLabel className="text-sm font-medium">Dates Window</FieldLabel>
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            className="w-full max-w-full rounded-lg"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="blackout-description">Description</FieldLabel>
                        <Input
                            id="blackout-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. School Holiday"
                        />
                    </Field>
                    <Field>
                        <Button className="w-full sm:w-auto" onClick={handleSubmit} disabled={!dateRange?.from}>
                            Add Blackout
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </Card>
  )
}

export default AddLeagueBlackoutDate