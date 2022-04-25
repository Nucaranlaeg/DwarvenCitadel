// On the map:
//	0		Empty
//	0<x<=1	Rock
//	2		Construction

let map = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0],
	[1,1,1,1,1,1,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

let furthestDug = 0;

// On the pathmap, each cell value is the number of spaces to the nearest dwarf.

let enemyPathMap = [];
const directions = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

function rebuildEnemyPathMap(){
	enemyPathMap = new Array(map.length).fill(0).map(x => new Array(map[0].length).fill(Infinity));
	let locs = dwarves.map(dwarf => {
		enemyPathMap[dwarf.y][dwarf.x] = 0;
		return [dwarf.y, dwarf.x];
	});
	while (locs.length){
		directions.forEach(dir => {
			const currentDist = enemyPathMap[locs[0][0]][locs[0][1]];
			const nextTile = map[locs[0][0] + dir[0]][locs[0][1] + dir[1]];
			const nextDist = currentDist + (nextTile == 0 ? 1
										  : nextTile == 2 ? getConstructionMoveCost(locs[0][1] + dir[1], locs[0][0] + dir[0])
										  : Infinity);
			if (enemyPathMap[locs[0][0] + dir[0]][locs[0][1] + dir[1]] > nextDist){
				enemyPathMap[locs[0][0] + dir[0]][locs[0][1] + dir[1]] = nextDist;
				locs.push([locs[0][0] + dir[0], locs[0][1] + dir[1]]);
			}
		});
		locs.shift();
	}
	furthestDug = enemyPathMap.findIndex(row => row.some(cell => cell < Infinity));
}

function mineSquare(x, y, skill){
	if (map[y][x] == 0 || map[y][x] > 1) return;
	const mineDifficulty = y > 10 ? (y - 10) * 1000 : 1000;
	map[y][x] -= skill / mineDifficulty;
	if (map[y][x] <= 0){
		map[y][x] = 0;
		spaceMined(y);
		rebuildEnemyPathMap();
		expandMap();
	}
}

function expandMap(){
	if (furthestDug <= map.length - 10) return;
	while (furthestDug > map.length - 10){
		map.push(new Array(map[0].length).fill(1));
	}
	redrawMap();
}

function redrawMap(){
	const mapNode = document.querySelector("#map");
	while (mapNode.firstChild()){
		mapNode.removeChild(mapNode.lastChild());
	}
	map.forEach(row => {
		const rowNode = document.createElement("div");
		rowNode.classList.add("map-row");
		row.forEach(cell => {
			const cellNode = document.createElement("div");
			cellNode.classList.add("map-cell");
			if (cell){
				cellNode.classList.add("rock");
				cellNode.dataset.mineprogress = Math.ceil(cell * 100);
			} else {
				cellNode.classList.add("empty");
			}
			rowNode.appendChild(cellNode);
		});
		mapNode.appendChild(rowNode);
	});
}
