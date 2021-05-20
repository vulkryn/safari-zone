import React from 'react';
import Card from './Card'
import './Pokedex.css'


const Pokedex = ({pokemon}) => {
	return (
		<details className="pokedex">
			<summary>View your currently owned Pokemon</summary>
			<div className="entries">
			{
				pokemon.map((user, i) => {
					return (<Card 
					key={i} 
					id={pokemon[i].id} 
					name={pokemon[i].name} 
					/>
					);
				})
			}
			</div>
	  	</details>
	);
}

export default Pokedex;