'use client'

import * as d3 from "d3";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";


export default function MatchStats({ match_id }) {

    const match_data = require(`@/data/soccer_data/match_data/${match_id}.json`)
    const events_data = require(`@/data/soccer_data/events_data/${match_id}.json`)
    const shots_data = require(`@/data/soccer_data/shots_data/${match_id}.json`)

    const [statsType, setStatsType] = useState('topStats')

    // Match Data
    const homePossession = Object.values(match_data['home']['stats']['possession']).reduce((a, b) => Number(a) + Number(b), 0)
    const awayPossession = Object.values(match_data['away']['stats']['possession']).reduce((a, b) => Number(a) + Number(b), 0)
    const totalPossession = Number(homePossession) + Number(awayPossession)
    const homeShots = Object.keys(match_data['away']['stats']['shotsTotal']).length

    // Events Data
    const shot = events_data.filter(d => d.type === 'Goal' || d.type === 'SavedShot' || d.type === 'MissedShots')
    const pass = events_data.filter(d => d.type === 'Pass')
    const homePass = pass.filter(d => d.h_a === 'h')
    const awayPass = pass.filter(d => d.h_a === 'a')
    
    // Shots Data
    const homeTeamId = shots_data.general.homeTeam.id
    const awayTeamId = shots_data.general.awayTeam.id
    // const shots = shots_data.content.shotmap.shots
    const topStats = shots_data.content.stats.Periods.All.stats[0].stats
    const shotsStats = shots_data.content.stats.Periods.All.stats[1].stats
    const xgStats = shots_data.content.stats.Periods.All.stats[2].stats
    const passesStats = shots_data.content.stats.Periods.All.stats[3].stats
    const defenceStats = shots_data.content.stats.Periods.All.stats[4].stats
    const duelsStats = shots_data.content.stats.Periods.All.stats[5].stats
    const disciplineStats = shots_data.content.stats.Periods.All.stats[6].stats

    const statsList = statsType === 'topStats' ? topStats : statsType === 'shots' ? shotsStats : statsType === 'xg' ? xgStats : statsType === 'passes' ? passesStats : statsType === 'defence' ? defenceStats: statsType === 'duels' ? duelsStats : statsType === 'discipline' ? disciplineStats : topStats

    // Convert Data for Home and Away Stats
    const homeStats = (data) => {
        return data.filter(d => d.h_a === 'h').length
    }
    const awayStats = (data) => {
        return data.filter(d => d.h_a === 'a').length
    }

    // Stats Data
    const summaryStats = [
        {title: 'Possession', home: `${Math.round(Number(homePossession)/Number(totalPossession)*1000)/10}%`, away: `${Math.round(Number(awayPossession)/Number(totalPossession)*1000)/10}%`},
        {title: 'xG', home: 1, away: 1},
        {title: 'Pass', home: homeStats(pass), away: awayStats(pass)},
    ]
    

    return (
        <>
            <p className="text-center font-bold font-lg">Match Statistics</p>
            <ButtonGroup size="small" variant="outlined" aria-label="Small button group">
                <Button variant={`${statsType === 'topStats' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('topStats')}>Top Stats</Button>
                <Button variant={`${statsType === 'shots' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('shots')}>Shots</Button>
                <Button variant={`${statsType === 'xg' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('xg')}>Expected Goals (xG)</Button>
                <Button variant={`${statsType === 'passes' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('passes')}>Passes</Button>
                <Button variant={`${statsType === 'defence' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('defence')}>Defence</Button>
                <Button variant={`${statsType === 'duels' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('duels')}>Duels</Button>
                <Button variant={`${statsType === 'discipline' ? 'contained' : 'outlined'}`} onClick={() => setStatsType('discipline')}>Discipline</Button>
            </ButtonGroup>

            {/* {summaryStats.map((stats, index) => (
                <li className="grid grid-cols-3 text-lg py-5" key={stats.title}>
                    <div className="text-start">
                        <span className="bg-blue-800 p-4 rounded-3xl">{stats.home}</span>
                    </div>
                    <div  className="text-center">
                        <span className="p-4">{stats.title}</span>
                    </div>
                    <div className="text-end">
                        <span className="p-4 text-end">{stats.away}</span>
                    </div>
                </li>
            ))} */}

            {statsList.map(stats => (
                <li className="grid grid-cols-3 text-md py-3" key={stats.title}>
                    <div className="text-start">
                        <span className={`${stats.highlighted === 'home' ? 'bg-blue-800 text-white' : ''} p-2 px-5 rounded-3xl`}>{stats.stats[0]}{stats.key === "BallPossesion" ? '%' : ''}</span>
                    </div>
                    <div  className="text-center">
                        <span className="p-4">{stats.title}</span>
                    </div>
                    <div className="text-end">
                        <span className={`${stats.highlighted === 'away' ? 'bg-red-800 text-white' : ''} p-2 px-5 rounded-3xl text-end`}>{stats.stats[1]}</span>
                    </div>
                </li>
            ))}
        </>
    )
}