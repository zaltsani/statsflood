import { useEffect } from "react"
import * as d3 from "d3"

export default function Passes({ data, innerWidth, innerHeight }) {

    const dimensions = require('../dimensions.json')
    const dimension = dimensions['opta']
    const xScale = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
    const yScale = d3.scaleLinear().domain([ 0, dimension.width ]).range([ 0, innerHeight ])

    useEffect(() => {
        const svg = d3.select("#passes-events-groups")
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
            .data(data)
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
        <g id="passes-events-groups"
        />
    )
}