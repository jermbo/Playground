import React from "react";
import "./app.css";
import PokemonTable from "./PokemonTable";

function App() {
  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text"></input>
        <div>Power threshold</div>
        <input type="text"></input>
        <div>Count over threshold: </div>
      </div>
      <div className="two-column">
        <PokemonTable pokemon={[]} />
        <div>
          <div>Min: </div>
          <div>Max: </div>
        </div>
      </div>
    </div>
  );
}

export default App;
