import React from 'react';
import './Card.css';

const Card = ({id, name}) => {
	
	return (
			<div className="entry">
				<img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`} alt={`Sprite of ${name}`}></img>
		
				<h2>{name}</h2>
				<p>{id}</p>
			</div>
	
	);
}

export default Card;