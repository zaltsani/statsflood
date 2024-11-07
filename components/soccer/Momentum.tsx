'use client'

import * as d3 from "d3"
import ChartContainer from "../chart/ChartContainer"
import Curve from "../chart/Curve"
import { Card } from "@mui/material"

export default function Momentum({ match_id }) {
    const data = require(`@/data/soccer_data/shots_data/${match_id}.json`)
    const momentumData = data.content.matchFacts.momentum.main.data
    momentumData.unshift({minute: 0, value: 0})

    const margin = {top: 40, right: 40, bottom: 25, left: 40}
    const width = 1000
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const lineColor = 'grey'
    const lineWidth = 5

    const homeTeamName = data.general.homeTeam.name
    const awayTeamName = data.general.awayTeam.name
    
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(momentumData.map(d => d.minute))])
        .range([0, innerWidth]);
    const yScale = d3.scaleLinear()
        .domain([-100, 100])
        .range([innerHeight, 0]);

    return (
        <div className="">
            <p className="text-center font-bold text-xl">Momentum</p>
            <ChartContainer
                width={width}
                height={height}
                margin={margin}>
                    <Curve
                        data={momentumData}
                        xScale={xScale}
                        yScale={yScale}
                        xAccessor="minute"
                        yAccessor="value"
                        stroke={lineColor}
                        strokeWidth={lineWidth}
                    />
                    <line
                        x1={0}
                        x2={xScale(d3.max(momentumData.map(d => d.minute)))}
                        y1={innerHeight/2}
                        y2={innerHeight/2}
                        stroke={lineColor}
                        strokeWidth={lineWidth}
                    />
                    <line
                        x1={0}
                        x2={0}
                        y1={0}
                        y2={innerHeight}
                        stroke={lineColor}
                        strokeWidth={lineWidth}
                    />
                    {/* <text
                        x={0}
                        y={0}
                    >
                        {homeTeamName}
                    </text> */}
            </ChartContainer>
        </div>
    )
}