type VenueBlackout = {
    start_date: string
    end_date: string
}

// Remove unnecessary characters
const toDate = (date: string): string => date.slice(0, 10)

const hasBlackoutOverlap = (
    startDate: string,
    endDate: string,
    existing: VenueBlackout[] | null | undefined,
): boolean => {
    const newStartDate = toDate(startDate)
    const newEndDate = toDate(endDate)

    // Return boolean of whether there is an overlap
    return (existing ?? []).some((blackout) => {
        const existingStartDate = toDate(blackout.start_date)
        const existingEndDate = toDate(blackout.end_date)

        return newStartDate <= existingEndDate && newEndDate >= existingStartDate
    })
}

export default hasBlackoutOverlap