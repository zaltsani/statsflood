'use client'

import { useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, ButtonGroup } from "@mui/material";


export default function PlayerStats({ match_id }) {
    const raw_data = require(`@/components/soccer_data/shots_data/${match_id}.json`)
    const statsData = raw_data.content.playerStats
    const lineups = raw_data.content.lineup
    const homeLineups = lineups.homeTeam
    const awayLineups = lineups.awayTeam
    const homeStarters = homeLineups.starters
    const awayStarters = awayLineups.starters
    const homeSubs = homeLineups.subs
    const awaySubs = awayLineups.subs
    const homeSubsPlay = homeSubs.filter(d => 'substitutionEvents' in d.performance)
    const awaySubsPlay = awaySubs.filter(d => 'substitutionEvents' in d.performance)
    const homePlayersPlay = homeStarters.concat(homeSubsPlay).filter(d => d.usualPlayingPositionId !== 0)
    const awayPlayersPlay = awayStarters.concat(awaySubsPlay).filter(d => d.usualPlayingPositionId !== 0)
    const allPlayersPlay = homePlayersPlay.concat(awayPlayersPlay)

    const homePlayersId = []
    homePlayersPlay.map(d => {
        homePlayersId.push(d.id)
    })

    const allPlayersPlayId = []
    allPlayersPlay.map(d => {
        allPlayersPlayId.push(d.id)
    })


    const topStatsOutfield = Object.keys(statsData[homePlayersPlay[1].id]['stats'][0]['stats']).filter(d => d !== 'Shotmap' && d !== 'Fantasy points')
    const attackStatsOutfield = Object.keys(statsData[homePlayersPlay[1].id]['stats'][1]['stats'])
    // console.log("console", statsData[homePlayersPlay[1].id])

    // const statsDataFilter = statsData.filter(d => homePlayersId.include(d))
    // console.log(statsData['113836']['stats'].find(object => object[0]['key'] === 'top_stats'))
    console.log(statsData['113836']['stats'].find(d => d.key === 'top_stats'))

    const [statsType, setStatsType] = useState('summary')
    const listStatsType = [
        {name: 'Summary', key: 'summary', statsData: 'top_stats', stats: ['FotMob rating', 'Minutes played', 'Goals', 'Assists', 'Total shots', 'Accurate passes', 'Chances created', 'Expected goals (xG)', 'Expected assists (xA)', 'xG + xA'], title_stats: ['Rating', 'Minutes', 'Goals', 'Assists', 'Shots', 'Passes Accuracy', 'Chances Created', 'xG', 'xA', 'xG + xA']},
        {name: 'Attack', key: 'attack', statsData: 'attack', stats: [''], title_stats: ['']},
        {name: 'Passes', key: 'passes'},
        {name: 'Defense', key: 'defense'},
        {name: 'Duels', key: 'duels'}
    ]


    return (
        <>
            <p className="text-center font-bold font-lg mb-0 mt-10 text-current">Player Statistics</p>
            <ButtonGroup>
                {listStatsType.map(stat => (
                    <Button
                        key={stat.key}
                        variant={`${statsType === stat.key ? 'contained' : 'outlined'}`}
                        onClick={() => setStatsType(stat.key)}
                    >{stat.name}</Button>
                ))}
            </ButtonGroup>
            
            <TableContainer className="text-current">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Player Name</TableCell>
                            {listStatsType.find(d => d.key === statsType).title_stats.map((d) => (
                                <TableCell key={d} className="text-center">{d === 'FotMob rating' ? 'Rating' : d}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {homePlayersId.map(id => (
                            <TableRow key={id} >
                                <TableCell className="text-current">{statsData[id].name}</TableCell>
                                {listStatsType.find(type => type.key === statsType).stats.map(statskey => {
                                    try {
                                        const stats = statsData[id]['stats'].find(d => d.key === "top_stats").stats
                                        const statValue = stats[statskey].stat.value

                                        let formattedValue = statValue;
                                        if (typeof statValue === 'number' && !Number.isInteger(statValue)) {
                                            formattedValue = statValue.toFixed(2); // Use your formatting function from before
                                        }
                                        return (
                                            <TableCell>{formattedValue}</TableCell>
                                        )
                                    } catch(error) {
                                        return (
                                            <TableCell>-</TableCell>
                                        )
                                    }
                                })}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}