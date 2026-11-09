import React from 'react'
import { Card, CardDescription, CardTitle } from './ui/card'
import { Button } from './ui/button'

const GenerateFixtures = () => {
	return (
		<Card>
            <CardTitle>Generate Fixtures</CardTitle>
            <CardDescription>
                You currently have no fixtures for this league. Click the button below to generate them.
            </CardDescription>

            <Button>Generate Fixtures</Button>
        </Card>
	)
}

export default GenerateFixtures
