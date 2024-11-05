'use client'

import { useEffect, useState } from "react"
import Pitch from "./Pitch"
import * as d3 from "d3"
import { Button, ButtonGroup } from "@mui/material"

export default function Chalkboard({ match_id }) {
    const events_data = require(`@/data/soccer_data/events_data/${match_id}.json`)
    const dimensions = require('./dimensions.json')
    const dimension = dimensions['opta']

    const [homeAway, setHomeAway] = useState('home')
    const [statsType, setStatsType] = useState('passes')
    const listStatsType = [
        {name: 'Passes', key: 'passes'},
        {name: 'Shot', key: 'shot'}
    ]

    const innerWidth = dimension.length
    const innerHeight = dimension.width * dimension.aspect

    // Scale X and Y
    const xScale = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
    const yScale = d3.scaleLinear().domain([ 0, dimension.width ]).range([ 0, innerHeight ])

    // Events Data
    const passesData = events_data.filter(d => d.type === 'Pass')

    useEffect(() => {
        const svg = d3.select("#chalkboard")
        svg.selectAll("*").remove()
        var arrowLength = 1;
        function angle(x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            var angle = Math.atan2(dy, dx)
            var baseLeftX = x2 - arrowLength * Math.cos(angle - Math.PI / 6)
            var baseLeftY = y2 - arrowLength * Math.sin(angle - Math.PI / 6)
            var baseRightX = x2 - arrowLength * Math.cos(angle + Math.PI / 6)
            var baseRightY = y2 - arrowLength * Math.sin(angle + Math.PI / 6)
            
            return ({
                'baseLeftX': baseLeftX,
                'baseLeftY': baseLeftY,
                'baseRightX': baseRightX,
                'baseRightY': baseRightY
            })
        }
        const passes = svg.selectAll(".event-group-passes")
            .data(passesData)
            .join('g')
                .attr("class", "event-group")
        passes
            .append("line")
                .attr("x1", d => xScale(d.x))
                .attr("y1", d => yScale(d.y))
                .attr("x2", d => xScale(d.endX))
                .attr("y2", d => yScale(d.endY))
                .attr("stroke", 'blue')
                .attr("stroke-width", 0.1)
        passes
            .append('path')
                .attr( 'd', d => {
                    const startX = d.x
                    const startY = d.y
                    const endX = d.endX
                    const endY = d.endY
                    const baseLeftX = angle(startX, startY, endX, endY)['baseLeftX']
                    const baseLeftY = angle(startX, startY, endX, endY)['baseLeftY']
                    const baseRightX = angle(startX, startY, endX, endY)['baseRightX']
                    const baseRightY = angle(startX, startY, endX, endY)['baseRightY']
                    return `M ${xScale(endX)}, ${yScale(endY)}
                            L ${xScale(baseLeftX)}, ${yScale(baseLeftY)}
                            L ${xScale(baseRightX)}, ${yScale(baseRightY)}
                            L ${xScale(endX)}, ${yScale(endY)}`
                })
                .attr("fill", 'blue')
        

    })
    return (
        <>
            <p className="text-center font-bold font-lg">Chalkboard</p>
            <div className="grid grid-cols-3">
                <ButtonGroup size="small" variant="outlined" aria-label="Small button group" className="col-span-2">
                    {listStatsType.map(stats => (
                        <Button key={stats.key} variant={`${statsType === stats.key ? 'contained' : 'outlined'}`} onClick={() => setStatsType(stats.key)}>{stats.name}</Button>
                    ))}
                </ButtonGroup>
                <ButtonGroup size="small" variant="outlined" aria-label="Small button group" className="flex justify-end">
                    <Button variant={`${homeAway === 'home' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('home')}>Home</Button>
                    <Button variant={`${homeAway === 'away' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('away')}>Away</Button>
                </ButtonGroup>
            </div>

            <Pitch>
                <g id="chalkboard"></g>
            </Pitch>
        </>
    )
}