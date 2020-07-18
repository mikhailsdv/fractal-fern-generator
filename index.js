const scale = 2; //how detalized canvas should be. 2 means 2 times bigger than the screen size
const dotRadius = 1.8;
const dotsAmount = 20000; //how many dots will be used to draw fern
const backgroundColor = "lightgray";
const animateGrowth = true; //if true the fractal will grow smoothly
const width = document.documentElement.offsetWidth * scale; //width of canvas
const height = document.documentElement.offsetHeight * scale; //height of canvas

//setting up canvas
const canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, width, height);

const randInt = (from, to) => {
	return (from + Math.random() * (to - from));
}

const getBarnsley = () => {
	//main function than defines constants for fern
	//returns array of objects of constants
	//play with randInt values to generate different ferns
	let result = [];
	let probabilityTotal = 0;

	for (let i = 0; i < 4; i++) {
		if (i === 0) { //steam
			let probabilitiy = randInt(.05, .07);
			probabilityTotal += probabilitiy;
			result.push({
				a: 0,
				b: 0,
				c: 0,
				d: randInt(0.155, 0.165),
				f: 0,
				p: probabilityTotal, //probabilitiy of using this part
			});
		}
		else if (i === 1) { //successively smaller leaflets
			let probabilitiy = randInt(.7, .85);
			probabilityTotal += probabilitiy;
			result.push({
				a: randInt(.8, .82),
				b: randInt(-.06, .06), //direction
				c: randInt(-.1, .1),
				d: randInt(.8, .9), //average size
				f: randInt(1.55, 1.65),
				p: probabilityTotal, //probabilitiy of using this part
			});
		}
		else if (i === 2) { //largest left-hand leaflet
			let probabilitiy = randInt(.06, .07);
			probabilityTotal += probabilitiy;
			result.push({
				a: randInt(.1, .3), //average leaf size
				b: randInt(-.15, -.25),
				c: randInt(.2, .3),
				d: randInt(.2, .3),
				f: randInt(1.5, 1.7),
				p: probabilityTotal, //probabilitiy of using this part
			});
		}
		else if (i === 3) { //largest right-hand leaflet
			result.push({
				a: randInt(-.1, -.2),
				b: randInt(.2, .3),
				c: randInt(.2, .3),
				d: randInt(.2, .3),
				f: randInt(.4, .5),
				p: 1 - probabilityTotal, //probabilitiy of using this part
			});
		}
	}
	return result;
}

const drawDots = (arr, ctx, color) => {
	//gets an array of dots' positions and drows them
	ctx.fillStyle = color;
	arr.forEach(dot => {
		ctx.beginPath();
		ctx.arc(dot.x, dot.y, dotRadius, 0, 2 * Math.PI);
		ctx.fill();	
	});
}


let x = 0, y = 0; //start x, y
let growthRate = animateGrowth ? 0 : 1;
const barnsley = getBarnsley();
let mutationIndex = 1;

const mutate = () => {
	let dots = [];
	for (let i = 0; i < dotsAmount; i++) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, width, height);
		
		let nextX, nextY;
		let r = Math.random(); //get probability (.p key of constant)
		if (r < barnsley[0].p) {
			nextX =  barnsley[0].a * x + barnsley[0].b * y;
			nextY =  barnsley[0].c * x + barnsley[0].d * y + barnsley[0].f;
		} else if (r < barnsley[1].p) {
			nextX =  barnsley[1].a * growthRate * x + barnsley[1].b * y * growthRate;
			nextY =  barnsley[1].c * growthRate * x + barnsley[1].d * y * growthRate + barnsley[1].f * growthRate;
		} else if (r < barnsley[2].p) {
			nextX =  barnsley[2].a * growthRate * x + barnsley[2].b * y * growthRate;
			nextY =  barnsley[2].c * growthRate * x + barnsley[2].d * y * growthRate + barnsley[2].f * growthRate;
		} else {
			nextX =  barnsley[3].a * growthRate * x + barnsley[3].b * y * growthRate;
			nextY =  barnsley[3].c * growthRate * x + barnsley[3].d * y * growthRate + barnsley[3].f * growthRate;
		}

		//scaling and adjustment
		let plotX = Math.round(width * (x + (width / 400)) / (width / 200));
		let plotY = Math.round(height - height * ((y + (height / 1000)) / (height / 100)));

		dots.push({
			x: plotX,
			y: plotY
		});

		x = nextX;
		y = nextY;
	}

	drawDots(dots, ctx, "black");

	//if animate - start animation loop
	if (animateGrowth) {
		mutationIndex++;
		//here goes any time function you want
		//you should transit growthRate form 0 to 1
		//this is mine. looks ugly - works fine)
		growthRate += (mutationIndex ** -2) * 1.56;
		//stop loop at any point of growthRate
		if (growthRate < .99) window.requestAnimationFrame(mutate);
	}
};

mutate(); //here we go
