import {FC} from "react";

const Yak: FC = () => {
	return (
		<div className="flex items-center p-5 fixed top-0 left-0 backdrop-blur-md rounded-br-[2rem] gap-3">
			<div className="text-5xl"> 🐃 </div>
			<div className="flex flex-col">
				<div className="text-[14px] opacity-[50%]">张庆风‘s</div>
				<div className="text-2xl hover:underline">Yak Map</div>
			</div>
		</div>
	)
}

export default Yak;