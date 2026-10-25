type AvailabilityWindow = {
    start_time: string
    end_time: string
}

// Supabase returns "HH:MM:SS" but the form gives "HH:MM", so trim both to "HH:MM"
const toHHMM = (time: string): string => time.slice(0, 5)

const hasOverlap = (
    startTime: string,
    endTime: string,
    existing: AvailabilityWindow[] | null | undefined,
): boolean => {
    const newStart = toHHMM(startTime)
    const newEnd = toHHMM(endTime)

    return (existing ?? []).some(
        (slot) => newStart < toHHMM(slot.end_time) && newEnd > toHHMM(slot.start_time),
    )
}

export default hasOverlap