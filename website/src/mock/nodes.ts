import {nodeTheme} from "~/config/theme";

export const nodes = [
	{
		id: 0,
		x: 200,
		y: 100,
		vx: 0,
		vy: 0,
		color: nodeTheme.mainColor[4],
		text: 'Web框架'
	},
	{
		id: 1,
		x: 230,
		y: 130,
		vx: 0,
		vy: 0,
		color: nodeTheme.mainColor[0],
		text: 'Vue3'
	},
	{
		id: 2,
		x: 250,
		y: 140,
		vx: 0,
		vy: 0,
		color: nodeTheme.mainColor[0],
		text: 'React'
	}
]

export const links = [
	{
		source: 0,
		target: 1,
		value: 2
	},
	{
		source: 0,
		target: 2,
		value: 2
	},
]