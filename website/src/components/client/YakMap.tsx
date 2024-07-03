'use client'
import * as d3 from "d3";
import {useEffect, useRef} from "react";
import {nodes} from "~/mock/nodes";

const width = 928;
const height = 680;
const color = d3.scaleOrdinal(d3.schemeCategory10);

const YakMap = () => {
	const yakRef = useRef(null);
	
	useEffect(() => {
		const dom = document.getElementById("yak_map_id");
		if (dom) {
			createD3()
		}
	}, []);
	
	const createD3 = () => {
		const simulation = d3.forceSimulation(nodes)
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter())
			.on('tick', () => {
				node.attr("cx", d => d.x)
			} )
		
		const svg = d3.create("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [-width / 2, -height / 2, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		const node = svg.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 10)
			.attr("fill", d => 'red');
		
		// @ts-ignore
		d3.select(yakRef.current)?.node()!.append(svg.node());
	}
	
	return (
		<div ref={yakRef} id="yak_map_id" className="w-screen h-screen flex justify-center items-center">
		</div>
	);
}

export default YakMap;