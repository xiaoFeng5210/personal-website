'use client'
import * as d3 from "d3";
import {useEffect, useRef} from "react";
import {links, nodes} from "~/mock/nodes";

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
			.force("link", d3.forceLink(links).strength(0.5).distance(50).iterations(10))
			.on('tick', () => {
				link
					.attr("x1", d => (d.source as any).x)
					.attr("y1", d => (d.source as any).y)
					.attr("x2", d => (d.target as any).x)
					.attr("y2", d => (d.target as any).y)
				
				node.attr("cx", d => d.x)
					.attr("cy", d => d.y);
			});
		
		const svg = d3.select(yakRef.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [-width / 2, -height / 2, width, height])
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
		
		// TODO: node我希望增加文字显示
		const labels = svg.append("g")
			.selectAll("text")
			.data(nodes)
			.join("text")
			.attr("dy", ".35em")
			.attr("x", d => d.x)
			.attr("y", d => d.y)
			.attr("text-anchor", "middle")
			.attr("font-size", "10px")
			.attr("fill", "#000")
			.text(d => d.text); // Assuming each node has a 'name' property
	}
	
	
	
	return (
		<svg ref={yakRef} id="yak_map_id" className="w-screen h-screen flex justify-center items-center">
		</svg>
	);
}

export default YakMap;