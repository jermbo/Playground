import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAll, getByName, Pokemon } from "./API";
import "./app.css";
import PokemonTable from "./PokemonTable";
import { calculatePower } from "./utils";

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const [search, setSearch] = useState("");
  const onSetSearch = useCallback((evt) => setSearch(evt.target.value), []);

  useEffect(() => {
    getByName(search).then(setPokemon);
  }, [search]);

  const pokemonWithPower = useMemo(
    () =>
      pokemon.map((p) => ({
        ...p,
        power: calculatePower(p),
      })),
    [pokemon]
  );

  const [threshold, setThreshold] = useState(0);
  const onSetThreshold = useCallback(
    (evt) => setThreshold(parseInt(evt.target.value, 10) || 0),
    []
  );

  const countOverThreshold = useMemo(
    () => pokemonWithPower.filter((p) => p.power > threshold).length,
    [pokemonWithPower, threshold]
  );

  const min = useMemo(
    () => Math.min(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );
  const max = useMemo(
    () => Math.max(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" value={search} onChange={onSetSearch}></input>
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold}></input>
        <div>Count over threshold: {countOverThreshold}</div>
      </div>
      <div className="two-column">
        <PokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
