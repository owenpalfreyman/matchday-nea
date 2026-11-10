import type { NewFixture } from "./generate-schedule";
import { supabase } from "./supabase";

// Function to save each fixture as a row in the database
async function saveFixtures(leagueId:number, fixtures: NewFixture[]) {
    // Define each row to be inserted into the database
    const rows = fixtures.map(fixture => ({
        ...fixture, league_id: leagueId
    }))

    // Database insert
    const { error } = await supabase
        .from("fixtures")
        .insert(rows)

    // Error handling
    if (error) {
        console.error("Error saving fixtures.", error)
        return false
    }
    
    // Return a success status if the fixtures were saved successfully
    console.log("Fixtures saved successfully.") // Testing log - to be removced afterwards
    return true
}

export default saveFixtures