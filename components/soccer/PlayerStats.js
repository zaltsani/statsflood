'use client'

import * as d3 from "d3";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function PlayerStats({ match_id }) {
    const raw_data = require(`@/data/soccer_data/shots_data/${match_id}.json`)
    const statsData = raw_data.content.playerStats
    const lineups = raw_data.content.lineup
    const homeLineups = lineups.homeTeam
    const awayLineups = lineups.awayTeam
    const homeStarters = homeLineups.starters
    const homeSubs = homeLineups.subs
    const homeSubsPlay = homeSubs.filter(d => 'substitutionEvents' in d.performance)
    const homePlayersPlay = homeStarters.concat(homeSubsPlay).filter(d => d.usualPlayingPositionId !== 0)
    const homePlayersId = []
    homePlayersPlay.map(d => {
        homePlayersId.push(d.id)
    })
    const topStatsOutfield = Object.keys(statsData[homePlayersPlay[1].id]['stats'][0]['stats']).filter(d => d !== 'Shotmap' && d !== 'Fantasy points')
    // const statsDataFilter = statsData.filter(d => homePlayersId.include(d))
    // console.log(homePlayersPlay[0])
    // console.log(homePlayersId)
    // console.log(statsData)
    // console.log(topStatsOutfield[5], statsData[homePlayersId[3]].stats[0].stats[topStatsOutfield[5]].stat.value)
    // console.log(statsData[homePlayersPlay[1].id]['stats'][0]['stats'])
    // console.log(topStats)
    // console.log(statsData[169162])
    // console.log(Object.keys(statsData[homePlayersPlay[1].id]['stats'][0]['stats']))

    const [statsType, setStatsType] = useState('summary')
    const listStatsType = [
        {name: 'Summary', key: 'summary'},
        {name: 'Attack', key: 'attack'},
        {name: 'Defense', key: 'defense'},
        {name: 'Duels', key: 'duels'}
    ]
    // const statsTypeData = 

    return (
        <>
            <p className="text-center font-bold font-lg mb-0 mt-10">Player Statistics</p>
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Player Name</TableCell>
                            {topStatsOutfield.map((d) => (
                                <TableCell key={d} className="text-center">{d === 'FotMob rating' ? 'Rating' : d}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {homePlayersId.map(id => (
                            <TableRow key={id} >
                                <TableCell className="text-current">{statsData[id].name}</TableCell>
                                {topStatsOutfield.map(d => {
                                    try {
                                        return (
                                            <TableCell className="text-center text-current">{statsData[id].stats[0].stats[d].stat.value}</TableCell>
                                        )
                                    } catch(error) {
                                        return (
                                            <TableCell className="text-center text-current">-</TableCell>
                                        )
                                    }
                                })}
                            </TableRow>
                        ))}
                        <TableRow>
                            
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}