import { useState } from 'react'
import { Card } from './ui/card'
import { FieldLegend, FieldSet, FieldDescription, FieldGroup, FieldLabel, Field } from './ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'
import { useParams } from 'react-router-dom'
import findOverlap from '@/lib/find-overlap'

const AddVenueAvailability = () => {
  const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  // Get the venue ID
  const { venueId } = useParams();


  async function addVenueAvailability() {
    // Convert the day of the week into an integer for the day
    const day_of_the_week = selectedDay
      ? daysOfTheWeek.indexOf(selectedDay) + 1
      : null

    // 1. End must be after the start
    if (!startTime || !endTime || endTime <= startTime) {
      alert("The end time must be after the start time.")
      return
    }

    if (day_of_the_week === null) {
      alert("Please select a day of the week.")
      return
    }

    // 2. Fetch existing availability windows for the day
    const { data: existing, error: fetchError } = await supabase
      .from("venue_availability")
      .select("*")
      .eq("venue_id", venueId)
      .eq("day_of_week", day_of_the_week);
    
    if (fetchError) {
      console.error("Error finding existing slots - availability cannot be added without a clash check.", fetchError)
      alert("Existing availability could not be checked. Please try again.")
      return
    }

    // 3. Check for clash between new times and old times
    if (findOverlap(startTime, endTime, existing)) {
      alert("This availability window overlaps with an existing window.")
      return
    }

    // 4. Data Insertion
    const { data: addAvailabilityData, error: addAvailabilityError } = await supabase
      .from("venue_availability")
      .insert({
        venue_id: venueId,
        day_of_week: day_of_the_week,
        start_time: startTime,
        end_time: endTime,
      })

    if (addAvailabilityError) {
      console.log("Error adding availability.", addAvailabilityError)
    }
  }

  return (
    <Card className="w-full max-w-md p-6 shadow-sm">
      <FieldSet className="gap-6">
        <FieldLegend className="text-lg">Add Venue Availability</FieldLegend>
        <FieldDescription>
          Add a window of availability for a venue
        </FieldDescription>
        <FieldGroup className="gap-4">
          <Field>
            {/* User selects the day of the week for the venue availability slot */}
            <FieldLabel htmlFor='day-of-the-week'>Day of the Window</FieldLabel>
            { /* Upon a change, update the state of selectedDay */}
            <Select days={daysOfTheWeek} onValueChange={(value) => setSelectedDay(value)}>
              <SelectTrigger id="day-of-the-week" className="w-full">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* Map over day of week array so each day is an option for the select */}
                  {daysOfTheWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="start-time">Start Time</FieldLabel>
            <Input
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              type="time"
              id="start-time"
              step="60"
              className="w-full appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="end-time">End Time</FieldLabel>
            <Input
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              type="time"
              id="end-time"
              step="60"
              className="w-full appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
        </FieldGroup>
        <Button type="button" onClick={addVenueAvailability}>Add Availability</Button>
      </FieldSet>
    </Card>
  )
}

export default AddVenueAvailability