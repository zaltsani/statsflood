'use client'

import { useState } from "react"
import Pitch from "./Pitch"
import * as d3 from "d3"
import { Button, ButtonGroup } from "@mui/material"

export default function PassingNetwork({ match_id }) {
    const match_data = require(`@/data/soccer_data/match_data/${match_id}.json`)
    const events_data = require(`@/data/soccer_data/events_data/${match_id}.json`)
    const homeTeamId = match_data['home']['teamId']
    const awayTeamId = match_data['away']['teamId']

    const [homeAway, setHomeAway] = useState('home')
    const teamId = homeAway === 'home' ? homeTeamId : awayTeamId
    
    const starterPlayerIds = match_data[homeAway]['formations'][0]['playerIds'].slice(0, 11)
    const playerIdNameDictionary = match_data['playerIdNameDictionary']
    const passes = events_data.filter(d => d.type === 'Pass')
    const passesStarterPlayer = passes.filter(d => starterPlayerIds.includes(d.playerId))
    const passesStarterPlayerAccurate = passesStarterPlayer.filter(d => d.outcomeType === 'Successful')
    const passesStarterPlayerReceive = passesStarterPlayerAccurate.map((d) => {
        const eventId = d.eventId + 1
        const event = events_data.find(e => e.eventId === eventId && e.teamId === teamId)
        if (event !== undefined) {
            const receivePlayerId = event.playerId
            return {
                ...d,
                receivePlayerId: receivePlayerId
            }
        } else {
            return d
        }
    })

    const passingNetworkDataPasses = passesStarterPlayerReceive.filter(d => 'receivePlayerId' in d)
    const passingNetworkData = []
    for (const index in starterPlayerIds) {
        const playerId = starterPlayerIds[index]
        const playerPasses = passingNetworkDataPasses.filter(d => d.playerId === playerId)
        
        const passXTotal = playerPasses.reduce((accumulator, currentItem) => accumulator + currentItem.x, 0)
        const passYTotal = playerPasses.reduce((accumulator, currentItem) => accumulator + currentItem.y, 0)
        const AverageXLocation = passXTotal / playerPasses.length;
        const AverageYLocation = passYTotal / playerPasses.length;

        // Connection
        const passingConnection = []
        for (const index in starterPlayerIds) {
            const playerIdConnection = starterPlayerIds[index]
            const passesToConnection = playerPasses.filter(d => d.receivePlayerId === playerIdConnection)
            passingConnection.push({
                'playerId': playerIdConnection,
                'numberPasses': passesToConnection.length
            })
        }
        passingNetworkData.push({
            playerId: starterPlayerIds[index],
            playerName: playerIdNameDictionary[playerId],
            average_passing_location: [AverageXLocation, AverageYLocation],
            passingConnection: passingConnection
        })
    }

    // Scale
    const dimensions = require('./dimensions.json')
    const dimension = dimensions['opta']
    const margin = {top: 2, left: 2, right: 2, bottom: 5}
    const innerWidth = dimension.length
    const innerHeight = dimension.width * dimension.aspect
    const xScale = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
    const yScale = d3.scaleLinear().domain([ 0, dimension.width ]).range([ innerHeight, 0 ])
    const lineWidthScale = d3.scaleLinear().domain([0, 20]).range([0.2, 1])

    return (
        <>
            <p className="text-center font-bold font-lg mb-0">Passing Network</p>
            <ButtonGroup size="small" variant="outlined" aria-label="Small button group">
                <Button variant={`${homeAway === 'home' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('home')}>Home</Button>
                <Button variant={`${homeAway === 'away' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('away')}>Away</Button>
            </ButtonGroup>
            <Pitch
                margin={margin}
                innerWidth={innerWidth}
                innerHeight={innerHeight}
            >
                <g id="passing-network">
                    {passingNetworkData.map((d) => (
                        <g key={d.playerName} id="player-passing-network">
                            <circle
                                cx={xScale(d.average_passing_location[0])}
                                cy={yScale(d.average_passing_location[1])}
                                r={1.6}
                                fill='white'
                                stroke="red"
                                stroke-width={.35}
                            />
                            {d.passingConnection.map((e) => (
                                <g key={e.playerId} >
                                    <line
                                        x1={xScale(d.average_passing_location[0])}
                                        x2={xScale(passingNetworkData.find(f => f.playerId === e.playerId).average_passing_location[0])}
                                        y1={yScale(d.average_passing_location[1])}
                                        y2={yScale(passingNetworkData.find(f => f.playerId === e.playerId).average_passing_location[1])}
                                        stroke='red'
                                        strokeWidth={e.numberPasses < 4 ? 0 : e.numberPasses <= 20 ? lineWidthScale(e.numberPasses) : 1}
                                    />
                                </g>
                            ))}
                            
                        </g>
                    ))}
                </g>
                {passingNetworkData.map((d) => (
                    <g key={d.playerName} >
                        <text
                            className="fill-current text-current"
                            x={xScale(d.average_passing_location[0])}
                            y={yScale(d.average_passing_location[1])}
                            style={{
                                "font-size": "1.5px",
                                "dominant-baseline": "middle",
                                "text-anchor": "middle",
                                "font-weight": "bold"
                            }}
                        >{d.playerName}</text>
                    </g>
                ))}
            </Pitch>
        </>
    )
}