import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { TrashIcon } from 'lucide-react'

type CurrentAvailabilityProps = {
    venueId: string
}

type AvailabilityWindow = {
    id: string,
    day_of_week: number,
    start_time: string,
    end_time: string
}

const CurrentAvailability = ({ venueId }: CurrentAvailabilityProps) => {
    const [availabilityWindows, setAvailabilityWindows] = useState<AvailabilityWindow[]>([])

    // Function to load the current venues availability
    async function loadAvailability() {
        // Query to get the availability windows
        const { data, error: availabilityError} = await supabase
            .from("venue_availability")
            .select("*")
            .eq("venue_id", venueId)

        if (availabilityError) {
            console.log("Error getting the availabiliy windows.", availabilityError)
        }

        // If there is no data, then save an empty list
        setAvailabilityWindows(data ?? [])
    }

    async function deleteWindow(id: string) { // ID from the Table Slot
        const { error } = await supabase
            .from("venue_availability")
            .delete()
            .eq("id", id)

        if (error) {
            console.log("Error deleting the availability window.", error)
            return // leave the table as it is
        }
    }

    useEffect(() => {
        loadAvailability()
    }, [venueId])

  return (
    <Card className="w-full">
        <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Venue Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption className="sr-only">Venue's Availability Slots</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {availabilityWindows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                            No availability slots added yet.
                        </TableCell>
                    </TableRow>
                ) : (
                    availabilityWindows.map((slot) => (
                        <TableRow key={slot.id}>
                            <TableCell className="font-medium">{slot.day_of_week}</TableCell>
                            <TableCell>{slot.start_time}</TableCell>
                            <TableCell>{slot.end_time}</TableCell>
                            <TableCell className="text-right">
                                <Button onClick={() => deleteWindow(slot.id)}>
                                    <TrashIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
          </Table>
        </CardContent>
    </Card>
  )
}

export default CurrentAvailability