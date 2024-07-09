import {FC} from "react";

const YakLogo: FC = () => {
	return (
		<div className="flex items-center p-5 fixed top-0 left-0 backdrop-blur-md rounded-br-[2rem] gap-3">
			<div className="text-5xl"> 🐃 </div>
			<div className="flex flex-col">
				<a className="text-[14px] opacity-[50%] hover:underline cursor-pointer" target="_blank" href="https://github.com/xiaoFeng5210">张庆风‘s</a>
				<a className="text-2xl hover:underline cursor-pointer" target="_blank" href="https://github.com/xiaoFeng5210/personal-website/tree/main/website">Yak Map</a>
			</div>
		</div>
	);
}

export default YakLogo;