import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Card, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableRow } from './ui/table'

type CurrentAvailabilityProps = {
    venueId: string
}

type BlackoutWindow = {
    id: string
    venue_id: string
    start_date: string
    endDate: string
    description: string
}

const CurrentBlackouts = ({ venueId }: CurrentAvailabilityProps) => {
    const [blackoutWindows, setBlackoutWindows] = useState<BlackoutWindow[]>([])

    // Function to load the current venue's blackout dates
    async function loadBlackouts() {
        const { data, error: blackoutsError } = await supabase
            .from("venue_blackouts")
            .select("*")
            .eq("venue_id", venueId) // Filter only for the venue with the ID

        if (blackoutsError) {
            console.log("Error getting the blackout windows for this venue.", blackoutsError)
        }

        // If there is no data, save an empty list
        setBlackoutWindows(data ?? [])
    }

    useEffect(() => {
        loadBlackouts()
    }, [venueId])

    return (
        <Card>
            <CardTitle>This Venue's Blackout Windows</CardTitle>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/* If there are currently no blackout windows */}
                    {blackoutWindows.length === 0 ? (
                        <TableRow>
                            <TableCell>No Availability added yet</TableCell>
                        </TableRow>
                    ) : (
                        blackoutWindows.map((slot) => (
                            <TableRow key={slot.id}>
                                <TableCell>{slot.start_date}</TableCell>
                                <TableCell>{slot.endDate}</TableCell>
                                <TableCell>{slot.description}</TableCell>
                                {/* TODO: Add delete button */}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}

export default CurrentBlackouts