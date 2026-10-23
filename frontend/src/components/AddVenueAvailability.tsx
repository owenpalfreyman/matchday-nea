import { useState } from 'react'
import { Card } from './ui/card'
import { FieldLegend, FieldSet, FieldDescription, FieldGroup, FieldLabel, Field } from './ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const AddVenueAvailability = () => {
    const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const [selectedDay, setSelectedDay] = useState<string | null>(null)

  return (
    <Card>
        <FieldSet>
            <FieldLegend>Add Venue Availability</FieldLegend>
            <FieldDescription>
                Add a window of availability for a venue
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel>
                        <Select days={daysOfTheWeek} onValueChange={(value) => setSelectedDay(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {daysOfTheWeek.map((day) => (
                                        <SelectItem key={day} value={day}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FieldLabel>
                </Field>
            </FieldGroup>
        </FieldSet>
    </Card>
  )
}

export default AddVenueAvailability