import { useEffect } from "react"
import * as d3 from "d3"

export default function Shots({ data, innerWidth, innerHeight }) {
    const xScale = d3.scaleLinear().domain([ 0, 105 ]).range([ 0, innerWidth ])
    const yScale = d3.scaleLinear().domain([ 0, 68 ]).range([ innerHeight, 0 ])
    const xgScale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0.5, 4 ])

    // console.log(data)

    useEffect(() => {
        const graph = d3.select("#shots-events-group")
        graph.selectAll("*").remove()
        const shotEvent = graph.selectAll(".shot-event")
            .data(data)
            .join('g')
                .attr("class", "shot-event")
        shotEvent
            .append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", d => xgScale(d.expectedGoals))
                .attr("fill", "yellow")
    })

    return (
        <g id="shots-events-group"
        />
    )
}