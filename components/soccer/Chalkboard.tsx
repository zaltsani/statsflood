'use client'

import { useState } from "react"
import Pitch from "./Pitch"
import { Button, ButtonGroup } from "@mui/material"
import Shots from "./events/Shots"
import Passes from "./events/Passes"

export default function Chalkboard({ match_id }) {
    const events_data = require(`@/components/soccer_data/events_data/${match_id}.json`)
    const dimensions = require('./dimensions.json')
    const raw_shots_data = require(`@/components/soccer_data/shots_data/${match_id}.json`)
    const dimension = dimensions['opta']

    const [homeAway, setHomeAway] = useState('home')
    const [statsType, setStatsType] = useState('passes')
    const listStatsType = [
        {name: 'Passes', key: 'passes'},
        {name: 'Shot', key: 'shots'},
        // {name: 'Defence', key: 'defence'},
    ]

    const margin = {
        top: 2,
        left: 2,
        right: 2,
        bottom: 5
    }

    const innerWidth = dimension.length
    const innerHeight = dimension.width * dimension.aspect

    // FotMob
    // const homeTeamName = raw_shots_data.general.homeTeam.name
    // const awayTeamName = raw_shots_data.general.awayTeam.name
    const homeTeamId = raw_shots_data.general.homeTeam.id
    const awayTeamId = raw_shots_data.general.awayTeam.id

    // Events Data
    const passesDataAll = events_data.filter(d => d.type === 'Pass')
    const shotsDataAll = raw_shots_data.content.shotmap.shots

    // Team Data
    const passesData = passesDataAll.filter(d => d.h_a === (homeAway === 'home' ? 'h' : 'a'))
    const shotsData = shotsDataAll.filter(d => d.teamId === (homeAway === 'home' ? homeTeamId : awayTeamId))

    return (
        <>
            <p className="text-center font-bold font-lg mb-0">Chalkboard</p>
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 overflow-x-auto">
                    <ButtonGroup size="small" variant="outlined" aria-label="Small button group" className="col-span-2">
                        {listStatsType.map(stats => (
                            <Button key={stats.key} variant={`${statsType === stats.key ? 'contained' : 'outlined'}`} onClick={() => setStatsType(stats.key)}>{stats.name}</Button>
                        ))}
                    </ButtonGroup>
                </div>
                <div className="col-span-1">
                    <ButtonGroup size="small" variant="outlined" aria-label="Small button group" className="flex justify-end">
                        <Button variant={`${homeAway === 'home' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('home')}>Home</Button>
                        <Button variant={`${homeAway === 'away' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('away')}>Away</Button>
                    </ButtonGroup>
                </div>
            </div>

            <Pitch
                margin={margin}
                innerWidth={innerWidth}
                innerHeight={innerHeight}
            >
                {statsType === 'passes' ? (
                    <Passes
                        data={passesData}
                        innerWidth={innerWidth}
                        innerHeight={innerHeight}
                    />
                ) : (
                    <Shots
                        data={shotsData}
                        innerWidth={innerWidth}
                        innerHeight={innerHeight}
                    />
                )}
            </Pitch>
        </>
    )
}