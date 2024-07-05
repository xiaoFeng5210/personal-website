'use client'

import {useD3} from "~/hooks/useD3";

const YakMap = () => {
	const {yakRef} = useD3()
	
	return (
			<svg ref={yakRef} id="yak_map_id"
			     className="w-screen h-screen flex justify-center items-center cursor-pointer select-none">
			</svg>
	);
}

export default YakMap;