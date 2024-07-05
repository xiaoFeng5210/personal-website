import {nodeTheme} from "~/config/theme";

export const nodes = [
	{
		id: 0,
		x: 10,
		y: 10,
		vx: 0,
		vy: 0,
		color: nodeTheme.mainColor[4],
		text: 'Javascript'
	},
	{
		id: 1,
		x: 30,
		y: 30,
		vx: 0,
		vy: 0,
		color: nodeTheme.mainColor[0],
		text: 'Vue'
	},
	{
		id: 2,
		x: 100,
		y: 200,
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
		source: 1,
		target: 2,
		value: 2
	},
]