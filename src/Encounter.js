import React from 'react';
import './Encounter.css';

const Encounter = ({pokemon}) => {
	return (
		<div>
		<h2>A wild {pokemon.name.toUpperCase()} appeared!</h2>
		<img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} alt={`Sprite of ${pokemon.name}`}></img>
		</div>
	)
}

export default Encounter;