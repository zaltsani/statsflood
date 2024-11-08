'use client'

import * as d3 from "d3"
import ChartContainer from "../chart/ChartContainer"
import { useEffect } from "react"

export default function XGMatchStory({ match_id }) {
    const raw_data = require(`@/data/soccer_data/shots_data/${match_id}.json`)

    const homeTeamName = raw_data.general.homeTeam.name
    const awayTeamName = raw_data.general.awayTeam.name
    const homeTeamId = raw_data.general.homeTeam.id
    const awayTeamId = raw_data.general.awayTeam.id

    const shotMap = raw_data.content.shotmap
    
    const all = shotMap.shots
    const firstHalf = shotMap.Periods.FirstHalf
    const secondHalf = shotMap.Periods.SecondHalf

    // Max Minute
    const firstMinute = d3.max([45, d3.max(firstHalf, (d) => d.min + d.minAdded)])
    const secondMinute = d3.max([90, d3.max(secondHalf, (d) => d.min + d.minAdded)])

    const homeAll = all.filter(d => d.teamId === homeTeamId)
    const awayAll = all.filter(d => d.teamId === awayTeamId)
    const cumHome = homeAll.reduce((acc, curr) => acc + curr.expectedGoals, 0)
    const cumAway = awayAll.reduce((acc, curr) => acc + curr.expectedGoals, 0)

    const homeFirstHalf = firstHalf.filter(d => d.teamId === homeTeamId)
    const homeSecondHalf = secondHalf.filter(d => d.teamId === homeTeamId)
    const awayFirstHalf = firstHalf.filter(d => d.teamId === awayTeamId)
    const awaySecondHalf = secondHalf.filter(d => d.teamId === awayTeamId)

    let cumHomeFirstHalf = homeFirstHalf.map((shot, index, arr) => ({
        data: shot,
        cumXG: arr.slice(0, index + 1).reduce((acc, curr) => acc + curr.expectedGoals, 0)
    }))
    
    let cumHomeSecondHalf = homeSecondHalf.map((shot, index, arr) => ({
        data: shot,
        cumXG: arr.slice(0, index + 1).reduce((acc, curr) => acc + curr.expectedGoals, d3.max(cumHomeFirstHalf, (d) => d.cumXG))
    }))

    let cumAwayFirstHalf = awayFirstHalf.map((shot, index, arr) => ({
        data: shot,
        cumXG: arr.slice(0, index + 1).reduce((acc, curr) => acc + curr.expectedGoals, 0)
    }))
    
    let cumAwaySecondHalf = awaySecondHalf.map((shot, index, arr) => ({
        data: shot,
        cumXG: arr.slice(0, index + 1).reduce((acc, curr) => acc + curr.expectedGoals, d3.max(cumAwayFirstHalf, (d) => d.cumXG))
    }))

    cumHomeFirstHalf.unshift({data: {min: 0}, cumXG: 0})
    cumHomeFirstHalf.push({data: {min: d3.max([ 45, d3.max(firstHalf, (d) => d.min + d.minAdded) ])}, cumXG: d3.max(cumHomeFirstHalf, (d) => d.cumXG)})
    cumHomeSecondHalf.unshift({data: {min: 45}, cumXG: d3.max(cumHomeFirstHalf, (d) => d.cumXG)})
    cumHomeSecondHalf.push({data: {min: d3.max([ 90, d3.max(secondHalf, (d) => d.min + d.minAdded) ])}, cumXG: d3.max(cumHomeSecondHalf, (d) => d.cumXG)})

    cumAwayFirstHalf.unshift({data: {min: 0}, cumXG: 0})
    cumAwayFirstHalf.push({data: {min: d3.max([ 45, d3.max(firstHalf, (d) => d.min + d.minAdded) ])}, cumXG: d3.max(cumAwayFirstHalf, (d) => d.cumXG)})
    cumAwaySecondHalf.unshift({data: {min: 45}, cumXG: d3.max(cumAwayFirstHalf, (d) => d.cumXG)})
    cumAwaySecondHalf.push({data: {min: d3.max([ 90, d3.max(secondHalf, (d) => d.min + d.minAdded) ])}, cumXG: d3.max(cumAwaySecondHalf, (d) => d.cumXG)})

    let goals = all.filter(d => d.eventType === 'Goal')
    goals = goals.map(d => {
        const teamId = d.teamId
        const homeAway = teamId === homeTeamId ? homeAll : awayAll
        const index = homeAway.findIndex(e => e.id === d.id)
        const cumXG = homeAway.slice(0, index).reduce((acc, curr) => acc + curr.expectedGoals, 0)
        return ({
            ...d,
            cumXG: cumXG

        })
    })
    let goalsFirst = firstHalf.filter(d => d.eventType === 'Goal')
    goalsFirst = goalsFirst.map(d => {
        const teamId = d.teamId
        const homeAway = teamId === homeTeamId ? homeAll : awayAll
        const index = homeAway.findIndex(e => e.id === d.id)
        const cumXG = homeAway.slice(0, index+1).reduce((acc, curr) => acc + curr.expectedGoals, 0)
        return ({
            ...d,
            cumXG: cumXG

        })
    })
    let goalsSecond = secondHalf.filter(d => d.eventType === 'Goal')
    goalsSecond = goalsSecond.map(d => {
        const teamId = d.teamId
        const homeAway = teamId === homeTeamId ? homeAll : awayAll
        const index = homeAway.findIndex(e => e.id === d.id)
        const cumXG = homeAway.slice(0, index+1).reduce((acc, curr) => acc + curr.expectedGoals, 0)
        return ({
            ...d,
            cumXG: cumXG

        })
    })

    // SVG Properties
    const margin = {left: 30, top: 20, right: 70, bottom: 20}
    const width = 600
    const height = 300
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Scale
    const xScale = d3.scaleLinear().domain([ 0, d3.max([ 90, d3.max(all, (d) => d.min + d.minAdded) ]) ]).range([ 0, innerWidth ])
    const yScale = d3.scaleLinear().domain([ 0, d3.max([ cumHome, cumAway  ]) + d3.max([ cumHome, cumAway  ])/8 ]).range([ innerHeight, 0 ])
    const xScaleFirst = d3.scaleLinear().domain([ 0, d3.max([ 45, d3.max(firstHalf, (d) => d.min + d.minAdded) ]) ]).range([0, innerWidth/2 - innerWidth/60])
    const xScaleSecond = d3.scaleLinear().domain([ 45, d3.max([ 90, d3.max(secondHalf, (d) => d.min + d.minAdded) ]) ]).range([innerWidth/2 + innerWidth/60, innerWidth])

    // Generator Data
    const curveGenerator = d3.line()
        .x(d => xScale(d.data.min))
        .y(d => yScale(d.cumXG))
        .curve(d3.curveStepAfter)

    const curveGeneratorFirst = d3.line()
        .x(d => xScaleFirst(d.data.min))
        .y(d => yScale(d.cumXG))
        .curve(d3.curveStepAfter)

    const curveGeneratorSecond = d3.line()
        .x(d => xScaleSecond(d.data.min))
        .y(d => yScale(d.cumXG))
        .curve(d3.curveStepAfter)

    // Axis
    const bottomAxis = d3.axisBottom(xScale)
        .tickValues(d3.range(0, d3.max(all, (d) => d.min + d.minAdded), 10))
    const leftAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(0, d3.max([ cumHome, cumAway ]) + d3.max([ cumHome, cumAway ])/8, 0.25 ))
        .tickFormat(d3.format(",.2f"))
    
    const bottomAxisFirst = d3.axisBottom(xScaleFirst)
        .tickValues([0, 10, 20, 30, 40])
    const bottomAxisSecond = d3.axisBottom(xScaleSecond)
        .tickValues([50, 60, 70, 80, secondMinute])

    useEffect(() => {
        const axisChart = d3.select("#axis")
        axisChart.selectAll('*').remove()
        // axisChart
        //     .append('g')
        //         .attr('transform', `translate(0, ${innerHeight})`)
        //         .call(bottomAxis)
        axisChart
            .append('g')
                .attr('transform', `translate(0, ${innerHeight})`)
                .call(bottomAxisFirst)
        axisChart
            .append('g')
                .attr('transform', `translate(0, ${innerHeight})`)
                .call(bottomAxisSecond)
        axisChart
            .append('g')
                // .attr('transform')
                .call(leftAxis)
    })

    return (
        <>
            <p className="text-center font-bold font-lg mb-0">xG Match Story</p>
            <ChartContainer
                width={width}
                height={height}
                margin={margin}
            >
                <path
                    d={curveGeneratorFirst(cumHomeFirstHalf)}
                    fill="none"
                    stroke="red"
                    stroke-width={2}
                />
                <path
                    d={curveGeneratorSecond(cumHomeSecondHalf)}
                    fill="none"
                    stroke="red"
                    stroke-width={2}
                />

                <path
                    d={curveGeneratorFirst(cumAwayFirstHalf)}
                    fill="none"
                    stroke="blue"
                    stroke-width={2}
                />
                <path
                    d={curveGeneratorSecond(cumAwaySecondHalf)}
                    fill="none"
                    stroke="blue"
                    stroke-width={2}
                />
                <g id="axis"
                />

                {/* <rect className="fill-current dark:text-gray-300 text-white" x={innerWidth} y={yScale(cumHome) - 15} width="70" height="38" rx="5" ry="5"/>
                <rect className="fill-current dark:text-gray-300 text-white" x={innerWidth} y={yScale(cumAway) - 15} width="70" height="38" rx="5" ry="5"/> */}
                <text
                    className="fill-current text-current text-xs"
                    x={innerWidth}
                    y={yScale(cumHome)}
                    // style={{
                    //     "font-size": "11px"
                    // }}
                >
                    <tspan>{homeTeamName}</tspan>
                    <tspan x={innerWidth} dy={15} >xG {Math.round(cumHome * 100) / 100}</tspan>
                </text>
                <text
                    className="fill-current text-current text-xs"
                    x={innerWidth}
                    y={yScale(cumAway)}
                >
                    <tspan>{awayTeamName}</tspan>
                    <tspan x={innerWidth} dy={15} >xG {Math.round(cumAway * 100) / 100}</tspan>
                </text>
                {goalsFirst.map(d => (
                    <circle
                        key={d}
                        cx={xScaleFirst(d.min)}
                        cy={yScale(d.cumXG)}
                        r={4}
                        fill={d.teamId === homeTeamId ? 'red' : 'blue'}
                    />
                ))}
                {goalsSecond.map(d => (
                    <circle
                        key={d}
                        cx={xScaleSecond(d.min)}
                        cy={yScale(d.cumXG)}
                        r={4}
                        fill={d.teamId === homeTeamId ? 'red' : 'blue'}
                    />
                ))}
            </ChartContainer>
        </>
    )
}