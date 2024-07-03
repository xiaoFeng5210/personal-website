'use client'
import * as d3 from "d3";
import {useEffect, useRef} from "react";

const YakMap = () => {
	const yakRef = useRef(null);
	
	useEffect(() => {
		const dom = document.getElementById("yak_map_id");
		if (dom) {
			createD3()
		}
	}, []);
	
	const createD3 = () => {
		console.log('create')
		const svg = d3.select(yakRef.current).append("svg");
		svg.attr("width", 500)
			.attr("height", 500)
			.style("background-color", "gray");
		
		svg.append("circle")
			.attr("cx", 250)
			.attr("cy", 250)
			.attr("r", 50)
			.attr('x', 12)
			.style("fill", "blue");
	}
	
	return (
		<div ref={yakRef} id="yak_map_id" className="w-screen h-screen flex justify-center items-center">
		</div>
	);
}

export default YakMap;