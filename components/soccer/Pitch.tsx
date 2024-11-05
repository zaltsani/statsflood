'use client'

import { useEffect } from "react"
import * as d3 from "d3";

export default function Pitch() {
    useEffect(() => {
        const dimensions = require('./dimensions.json')
        const dimension = dimensions['opta']
        const margin = {
            top: 10,
            left: 10,
            right: 8,
            bottom: 8
        }

        const lineWidth = 1
        const lineColor = 'grey'

        const innerWidth = dimension.length
        const innerHeight = dimension.width * dimension.aspect

        // Scale X and Y
        const scX = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
        const scY = d3.scaleLinear().domain([ 0, dimension.width ]).range([ 0, innerHeight ])

        const svg = d3.select(".pitch")
        svg
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${margin.left + dimension.length + margin.right} ${margin.top + (dimension.width * dimension.aspect) + margin.bottom}`)
            .attr("fill", "none")
        const pitch = svg
            .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .attr("class", "pitch-draw")
                .attr('stroke', lineColor)
                .attr('stroke-width', lineWidth);
        pitch
            .append('path')
                .attr('d', `M0 0 H${innerWidth} V${innerHeight} H0 V0`)
            .append('path')
                .attr('d', `M${innerWidth/2} 0 V${innerHeight}`)
    })

    return (
        <svg className="pitch">

        </svg>
    )
}