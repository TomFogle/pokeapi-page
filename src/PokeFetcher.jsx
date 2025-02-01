import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokeFetcher = () => {
    const [pokeData, setPokeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const pokeUrl = 'https://pokeapi.co/api/v2/pokemon';

    useEffect(() => {
        const pokeFetch = async () => {
            try {
                const pokeDataResponse = await axios.get(pokeUrl);
                const pokeList = pokeDataResponse.data.results;

                const cleanedPokeData = await Promise.all(
                    pokeList.map(async (pokemon) => {
                        const details = await axios.get(pokemon.url);
                        return {
                            name: pokemon.name,
                            gif: details.data.sprites.other.showdown.front_default
                        };
                    })
                );

                setPokeData(cleanedPokeData);
            } catch (err) {
                setFetchError(err.message);
            }

            setLoading(false);
        };

        pokeFetch();
    }, []);

    if (loading) return <p>Loading Pokemon...</p>;
    if (fetchError) return <p>Error: {fetchError}</p>;

    return (
        <div>
            <h1>Poke List</h1>
            <ul>
                {pokeData && pokeData.map((pokemon, index) => (
                    <li key={index}>
                        {pokemon.name}
                        <img src={pokemon.gif} alt={pokemon.name + ' gif'} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PokeFetcher;
