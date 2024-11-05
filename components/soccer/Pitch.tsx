'use client'

import * as d3 from "d3";
import ChartContainer from "../chart/ChartContainer";

export default function Pitch(props) {
    const dimensions = require('./dimensions.json')
    const dimension = dimensions['opta']
    const margin = {
        top: 2,
        left: 2,
        right: 2,
        bottom: 2
    }
    const lineWidth = 0.2
    const lineColor = 'grey'

    const width = dimension.length + margin.left + margin.right
    const height = dimension.width * dimension.aspect + margin.top + margin.bottom
    const innerWidth = dimension.length
    const innerHeight = dimension.width * dimension.aspect

    // Scale X and Y
    const xScale = d3.scaleLinear().domain([ 0, dimension.length ]).range([ 0, innerWidth ])
    const yScale = d3.scaleLinear().domain([ 0, dimension.width ]).range([ 0, innerHeight ])

    const arcGenerator = d3.arc()
        .outerRadius(xScale(dimension.circle_diameter/2)-lineWidth/4)
        .innerRadius(xScale(dimension.circle_diameter/2)+lineWidth/4)

    return (
        <ChartContainer
            width={width}
            height={height}
            margin={margin}>
                <g 
                    id="pitch"
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={lineWidth}
                >
                    <rect
                        x={0}
                        y={0}
                        width={innerWidth}
                        height={innerHeight}
                    />

                    {/* Center Line */}
                    <line
                        x1={innerWidth/2}
                        x2={innerWidth/2}
                        y1={0}
                        y2={innerHeight}
                    />

                    {/* Goal Area */}
                    <path
                        d={`M0 ${yScale(dimension.invert_y ? dimension.penalty_area_top : dimension.penalty_area_bottom)}
                            h${xScale(dimension.penalty_area_length)}
                            v${yScale(dimension.penalty_area_width)}
                            h-${xScale(dimension.penalty_area_length)}`}
                    />
                    <path
                        d={`M${innerWidth} ${yScale(dimension.invert_y ? dimension.penalty_area_top : dimension.penalty_area_bottom)}
                            h-${xScale(dimension.penalty_area_length)}
                            v${yScale(dimension.penalty_area_width)}
                            h${xScale(dimension.penalty_area_length)}`}
                    />

                    {/* Six-Yard Box */}
                    <path
                        d={`M0 ${yScale(dimension.invert_y ? dimension.six_yard_top : dimension.six_yard_bottom)}
                            h${xScale(dimension.six_yard_length)}
                            v${yScale(dimension.six_yard_width)}
                            h-${xScale(dimension.six_yard_length)}`}
                    />
                    <path
                        d={`M${innerWidth} ${yScale(dimension.invert_y ? dimension.six_yard_top : dimension.six_yard_bottom)}
                            h-${xScale(dimension.six_yard_length)}
                            v${yScale(dimension.six_yard_width)}
                            h${xScale(dimension.six_yard_length)}`}
                    />

                    {/* Center Circle */}
                    <circle
                        cx={innerWidth/2}
                        cy={innerHeight/2}
                        r={xScale(dimension.circle_diameter/2)}
                    />

                    {/* Penalty Box */}
                    <path
                        transform={`translate(${xScale(dimension.penalty_left)}, ${yScale(dimension.width/2)})`}
                        d={arcGenerator({
                            startAngle:Math.asin((dimension.penalty_area_length-dimension.penalty_left)/(dimension.circle_diameter/2)),
                            endAngle:Math.PI - Math.asin((dimension.penalty_area_length-dimension.penalty_left)/(dimension.circle_diameter/2))
                        })}
                    />
                    <path
                        transform={`translate(${xScale(dimension.penalty_right)}, ${yScale(dimension.width/2)})`}
                        d={arcGenerator({
                            startAngle:Math.PI + Math.asin((dimension.penalty_area_length-dimension.penalty_left)/(dimension.circle_diameter/2)),
                            endAngle:2*Math.PI-Math.asin((dimension.penalty_area_length-dimension.penalty_left)/(dimension.circle_diameter/2))
                        })}
                    />

                    {/* Goal */}
                    <path
                        d={`M0 ${yScale(dimension.invert_y ? dimension.goal_top : dimension.goal_bottom)} h-${xScale(dimension.goal_length)} v${yScale(dimension.goal_width)} h${xScale(dimension.goal_length)}`}
                    />
                    <path
                        d={`M${xScale(dimension.length)} ${yScale(dimension.invert_y ? dimension.goal_top : dimension.goal_bottom)} h${xScale(dimension.goal_length)} v${yScale(dimension.goal_width)} h-${xScale(dimension.goal_length)}`}
                    />

                    {/* Penalty Spot */}
                    <circle
                        cx={xScale(dimension.penalty_left)}
                        cy={yScale(dimension.width/2)}
                        r={lineWidth}
                        fill={lineColor}
                    />
                    <circle
                        cx={xScale(dimension.penalty_right)}
                        cy={yScale(dimension.width/2)}
                        r={lineWidth}
                        fill={lineColor}
                    />

                    {/* Center Spot */}
                    <circle
                        cx={innerWidth/2}
                        cy={yScale(dimension.width/2)}
                        r={lineWidth}
                        fill={lineColor}
                    />
                </g>
                {props.children}
        </ChartContainer>
    )
}