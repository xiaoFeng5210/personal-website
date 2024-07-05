'use client'
import * as d3 from "d3";
import {useEffect, useRef} from "react";
import {links, nodes} from "~/mock/nodes";
import {D3DragEvent} from "d3";

const width = 300;
const height = 300;
const color = d3.scaleOrdinal(d3.schemeCategory10);
const textOffsetY = 14

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
			// .force("center", d3.forceCenter())
			.force("link", d3.forceLink(links).strength(0.5).distance(50).iterations(10))
			.on('tick', () => {
				link
					.attr("x1", d => (d.source as any).x)
					.attr("y1", d => (d.source as any).y)
					.attr("x2", d => (d.target as any).x)
					.attr("y2", d => (d.target as any).y)
				
				node.attr("cx", d => d.x)
					.attr("cy", d => d.y);

				labels
					.attr("x", d => d.x)
					.attr("y", d => d.y + textOffsetY);
			});
		
		const svg = d3.select(yakRef.current)
			// .attr("width", width)
			// .attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		const link = svg.append("g")
			.attr("stroke", "#9D9DA0")
			.attr("stroke-opacity", 0.3)
			.selectAll()
			.data(links)
			.join("line")
			.attr("stroke-width", d => d.value);

		const node = svg.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 0)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 10)
			.attr("fill", d => d.color);
		
		const labels = svg.append("g")
			.selectAll("text")
			.data(nodes)
			.join("text")
			// .attr("dy", ".35em")
			.attr("x", d => d.x)
			.attr("y", d => d.y + textOffsetY)
			.attr("text-anchor", "middle")
			.attr("font-size", "0.5rem")
			.attr("fill", "#000")
			.text(d => d.text); // Assuming each node has a 'name' property


		// Optional: Add drag behavior for nodes
		node.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

		function dragstarted(event: D3DragEvent<any, any, any>, d: any) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event, d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event, d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
	}
	
	return (
			<svg ref={yakRef} id="yak_map_id"
			     className="w-screen h-screen flex justify-center items-center cursor-pointer select-none">
			</svg>
	);
}

export default YakMap;