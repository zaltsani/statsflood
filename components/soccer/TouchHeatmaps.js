'use client'

import { useEffect } from 'react'
import Pitch from './Pitch'
import * as d3 from "d3"

export default function TouchHeatmaps({ match_id }) {
  const match_data = require(`@/data/soccer_data/match_data/${match_id}.json`)
  const events_data = require(`@/data/soccer_data/events_data/${match_id}.json`)

  const touchData = events_data.filter(d => d.isTouch && d.x && d.y)
  const homeTouchData = touchData.filter(d => d.h_a === 'h')
  
  const dimensions = require('./dimensions.json')
  const dimension = dimensions["opta"]
  const margin = {
      top: 2,
      left: 2,
      right: 2,
      bottom: 5
  }
  const innerWidth = dimension.length
  const innerHeight = dimension.width * dimension.aspect
  const xScale = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
  const yScale = d3.scaleLinear().domain([ 0, dimension.width ]).range([ 0, innerHeight ])

  const densityData = d3.contourDensity()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .size([innerWidth, innerHeight])
    .bandwidth(13)(homeTouchData)
  const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(densityData, d => d.value)])

  useEffect(() => {
    const graph = d3.select("#touch-heatmaps")
    graph.selectAll("*").remove()
    graph
      .selectAll(".heatmapsAction")
      .data(densityData)
          .join("path")
              .attr("d", d3.geoPath())
              .attr("fill", d => color(d.value))
  })

  return (
    <>
      <div>Touch Heatmaps</div>
      <Pitch>
        <g id="touch-heatmaps" />
      </Pitch>
    </>
  )
}