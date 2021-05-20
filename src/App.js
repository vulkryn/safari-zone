import React, { Component } from 'react';
import './App.css';
import Encounter from './Encounter'
import Ball from './Ball'
import Bait from './Bait'
import Run from './Run'
import Rock from './Rock'
import Pokedex from './components/Pokedex'


let encounterTimer = '';
let pokemon = [];
let storedPokemon = JSON.parse(localStorage.getItem("pokemon"));
class App extends Component {
	
	constructor() {
		super();
		this.state = {
			encounter: {},
			catchRate: 0,
			baitCounter: 0,
			mudCounter: 0,
			pending: true,
			pokedex: []
		}
	}
	render() {
		
		return this.state.pending ?
			<>
			<h1>Safari Zone</h1>
			<h2>Waiting for encounter...</h2>
			<Pokedex pokemon={storedPokemon}/>
			</> : (
			<>
			<h1>Safari Zone</h1>
			<Encounter pokemon={this.state.encounter}/>
			<Ball ball={this.ball}/>
			<Bait bait={this.bait}/>
			<Rock rock={this.rock}/>
			<Run run={this.run}/>
			<Pokedex pokemon={storedPokemon}/>
			</>
		);
	}

	componentDidMount() {
		pokemon = storedPokemon;
		this.setState({pokedex: storedPokemon});
		console.log(storedPokemon);
		console.log(this.state.pokedex);
		setTimeout(() => {
			this.encounter();
		}, 5000);
		
		encounterTimer = setInterval(() => {
			this.encounter();
		}, 30000);
	}

	encounter = async () => {
		let pokeNumber = Math.floor(Math.random() * 811) + 1;
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNumber}`)
		const data = await response.json();
		this.setState({encounter: data});
		const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeNumber}`)
		const data2 = await response2.json();
		this.setState({catchRate: data2.capture_rate});
		this.setState({pending: false});
		console.log("Capture rate:", this.state.catchRate);
		console.log(data);
	}

	run = () => {
		console.log("ran away!");
		this.clearTime();
	}

	ball = () => {
		const capture = this.state.catchRate;
		let rng = Math.floor(Math.random() * 255) + 1;
		console.log("Ball rng:", rng);
		//rng < capture
		if (rng < capture) {
			console.log("You caught the pokemon!");
			pokemon.push(this.state.encounter);
			this.setState({pokedex: pokemon});
			localStorage.setItem("pokemon", JSON.stringify(pokemon));
			console.log(pokemon);
			this.clearTime();
		} else {
			console.log("Oh no! The pokemon broke free!");
			this.endTurn();
		}
		
		
	}

	bait = () => {
		console.log("Threw bait!");
		let currentBaitCounter = this.state.baitCounter;
		let catchRate = this.state.catchRate;
		let rngBait = Math.floor(Math.random() * 5) + 1; //generate random # between 1 and 5
		this.setState({baitCounter: Math.min(currentBaitCounter + rngBait, 255), mudCounter: 0})
		this.setState({catchRate: Math.floor(catchRate / 2)});
		this.endTurn();
	}

	rock = () => {
		console.log("Threw a rock!");
		let currentMudCounter = this.state.mudCounter;
		let catchRate = this.state.catchRate;
		let rngMud = Math.floor(Math.random() * 5) + 1; //generate random # between 1 and 5
		this.setState({mudCounter: Math.min(currentMudCounter + rngMud, 255), baitCounter: 0})
		this.setState({catchRate: Math.min(catchRate * 2, 255)});
		this.endTurn();
	}

	clearTime = () => {
		this.setState({pending: true});
		this.setState({encounter: {}, baitCounter: 0, mudCounter: 0, catchRate: 0});
		clearInterval(encounterTimer);
		encounterTimer = setInterval(() => {
			this.encounter();
		}, 30000);
		
	}

	endTurn = () => {
		console.log("ended the turn.")
		let currentBait = this.state.baitCounter;
		let currentMud = this.state.mudCounter;
		let rng = Math.floor(Math.random() * 256); //generate random # between 0 and 255
		if (this.state.baitCounter > 0) {
			this.setState({currentBaitCounter: currentBait - 1})
		}
		if (this.state.mudCounter > 0) {
			this.setState({currentMudCounter: currentMud - 1})
		}
		//if the bait counter is higher than the mud counter, the pokemon is eating.  We should compare the rng to the pokemon's speed stat, divided by 2, rounded down.
		//if the rng is lower than the stat, or the pokemon's speed stat is higher than 128, the pokemon flees.
		console.log("bait:", currentBait);
		console.log("mud:", currentMud);
		console.log("RNG:", rng);
		console.log("Speed:", this.state.encounter.stats[5].base_stat);
		console.log("First if:" , (currentBait > currentMud && rng < Math.floor(this.state.encounter.stats[5].base_stat / 2)) || this.state.encounter.stats[5].base_stat > 128);
		console.log("Second if:", (currentBait === currentMud && rng < (this.state.encounter.stats[5].base_stat * 2)) || this.state.encounter.stats[5].base_stat > 128);
		console.log("Third if:", (currentBait < currentMud && rng < (this.state.encounter.stats[5].base_stat * 4)) || this.state.encounter.stats[5].base_stat > 128);
		console.log("Catch Rate:", this.state.catchRate);
		if ((currentBait > currentMud && rng < Math.floor(this.state.encounter.stats[5].base_stat / 2)) || this.state.encounter.stats[5].base_stat > 128) {
			alert("The stuffed pokemon walked away!");
			this.clearTime();
			
		}
		else if ((currentBait === currentMud && rng < (this.state.encounter.stats[5].base_stat * 2)) || this.state.encounter.stats[5].base_stat > 128) {
			alert("The pokemon ran away!");
			this.clearTime();
		}
		else if ((currentBait < currentMud && rng < (this.state.encounter.stats[5].base_stat * 4)) || this.state.encounter.stats[5].base_stat > 128) {
			alert("The angry pokemon ran away!");
			this.clearTime();
		}
		else {
			alert("The pokemon is watching carefully...");
		}
	}
}

export default App;
