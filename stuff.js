class Stuff {
	constructor(name, rarity, diggable = true){
		this.name = name;
		this.rarity = rarity;
		this.diggable = diggable;
		this.amount = 0;
	}

	mined(depth){
		let chance = this.rarity / depth;
		if (chance < 1 && Math.random() > chance){
			this.amount++;
		}
	}
}

let stuff = [
	new Stuff("Rock", 0),
];

function mined(depth){
	stuff.forEach(item => item.mined(depth));
}