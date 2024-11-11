'use client'

import { useEffect, useState } from 'react'
import Pitch from './Pitch'
import * as d3 from "d3"
import { Button, ButtonGroup, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material'

export default function TouchHeatmaps({ match_id }) {
  const match_data = require(`@/components/soccer_data/match_data/${match_id}.json`)
  const events_data = require(`@/components/soccer_data/events_data/${match_id}.json`)
  const touchData = events_data.filter(d => d.isTouch && d.x && d.y)

  const [homeAway, setHomeAway] = useState('home')
  const [selectedPlayer, setSelectedPlayer] = useState([])

  const teamTouchData = touchData.filter(d => d.h_a === (homeAway === 'home' ? 'h' : 'a'))
  const playerNameList = teamTouchData.map(item => item.playerName).filter((value, index, self) => self.indexOf(value) === index)

  useEffect(() => {
    setSelectedPlayer(
      playerNameList.map(player => ({
        playerName: player,
        isChecked: true
      }))
    )
  }, [homeAway])

  const filterPlayer = []
  selectedPlayer.map(player => {
    if (player.isChecked) {
      filterPlayer.push(player.playerName)
    }
  })
  
  const filterTouchData = teamTouchData.filter(d => filterPlayer.includes(d.playerName))

  const handlePlayerCheck = (playerName) => {
    setSelectedPlayer(selectedPlayer.map(player => 
      player.playerName === playerName
      ? {...player, isChecked: !player.isChecked}
      : player
    ))
  }

  const [selectAll, setSelectAll] = useState(true)
  const handleSelectAll = () => {
    setSelectedPlayer(selectedPlayer.map(player => (
      {...player, isChecked: !selectAll}
    )))
    setSelectAll(!selectAll)
  }
  
  const dimensions = require('./dimensions.json')
  const dimension = dimensions["opta"]
  const margin = {top: 8, left: 15, right: 15, bottom: 20}
  const innerWidth = dimension.length * 3
  const innerHeight = dimension.width * dimension.aspect * 3
  const xScale = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
  const yScale = d3.scaleLinear().domain([ 0, dimension.width ]).range([ innerHeight, 0 ])

  const densityData = d3.contourDensity()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .size([innerWidth, innerHeight])
    .bandwidth(13)(filterTouchData)

  const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(densityData, d => d.value)])


  useEffect(() => {
    const graph = d3.select("#touch-heatmaps")
    graph.selectAll("*").remove()
    graph
      .append("clipPath")
          .attr("id", "clipHeatmap")
          .append("rect")
              .attr("width", innerWidth)
              .attr("height", innerHeight)
    graph
      .selectAll(".heatmapsAction")
      .data(densityData)
          .join("path")
              .attr("d", d3.geoPath())
              .attr("fill", d => d.value === 0 ? "none" : color(d.value))
              .attr("clip-path", "url(#clipHeatmap)")
    graph
      .selectAll(".touch-event")
      .data(filterTouchData)
        .join("circle")
          .attr("cx", d => xScale(d.x))
          .attr("cy", d => yScale(d.y))
          .attr("r", 1)
          .attr("fill", "red")
          .attr("opacity", 0.3)
  })

  return (
    <>
        <p className="text-center font-bold font-lg mb-0">Touch Heatmaps</p>
        <div className='grid grid-cols-3 my-1'>

          <div className='col-span-1'>
            <ButtonGroup size="small" variant="outlined" aria-label="Small button group" className="mb-3">
                <Button variant={`${homeAway === 'home' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('home')}>Home</Button>
                <Button variant={`${homeAway === 'away' ? 'contained' : 'outlined'}`} color="success" onClick={() => setHomeAway('away')}>Away</Button>
            </ButtonGroup>
          </div>

          <div className='col-span-2'>
            <FormControl
              fullWidth
            >
              <InputLabel id="select-player-label" className='text-current'>Select Player</InputLabel>
              <Select
                labelId='select-player-label'
                multiple
                value={selectedPlayer}
                sx={{
                  ' .MuiSelect-icon': {
                    color: 'gray',
                  },
                  borderColor: 'gray',
                  borderWidth: 1,
                }}
              >
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAll}
                        onChange={() => handleSelectAll()}
                      />
                    }
                    label="Select All"
                  />
                </MenuItem>
                {selectedPlayer.map(player => (
                  <MenuItem key={player.playerName}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={player.isChecked}
                          onChange={() => handlePlayerCheck(player.playerName)}
                        />
                      }
                      label={player.playerName}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        

        <Pitch
        margin={margin}
        innerWidth={innerWidth}
        innerHeight={innerHeight}
        fillColor={"white"}
      >
        <g id="touch-heatmaps" />
      </Pitch>
    </>
  )
}