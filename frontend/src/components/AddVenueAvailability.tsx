import { useState } from 'react'
import { Card } from './ui/card'
import { FieldLegend, FieldSet, FieldDescription, FieldGroup, FieldLabel, Field } from './ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'

const AddVenueAvailability = () => {
  const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

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
              type="time"
              id="start-time"
              step="60"
              defaultValue="00:00"
              className="w-full appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="end-time">End Time</FieldLabel>
            <Input
              type="time"
              id="end-time"
              step="60"
              defaultValue="00:00"
              className="w-full appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}

export default AddVenueAvailability