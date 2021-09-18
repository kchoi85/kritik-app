import React, { useState } from "react";

function App() {
  const [neighborsStatus, setNeighborsStatus] = useState(null);
  const [countries, setCountries] = useState(null);
  const [groupings, setGroupings] = useState(null);

  const generateGroupings = async () => {
    const response = await fetch("https://travelbriefing.org/countries.json");
    const json = await response.json();

    // set an array to store 10 randomly fetched countries
    let array = [];
    for (let i = 0; i < 10; i++) {
      array.push(json[Math.floor(Math.random() * json.length)]);
    }

    // map the random 10 countries into a list
    const randomCountries = array?.map((d) => <li key={d.name}>{d.name}</li>);
    setCountries(randomCountries);

    // fetch each countries info with given url
    for (let i = 0; i < array.length; i++) {
      const countryInfo = await fetch(array[i].url);
      const info = await countryInfo.json();
      array[i].neighbors = info.neighbors;
    }

    // can: us, port
    // us: can
    // .info.neighbors.name
    // function groupCountries(list, key) {
    //   return list.reduce(function (rv, x) {
    //     (rv[x[key]] = rv[x[key]] || []).push(x);
    //     return rv;
    //   }, {});
    // }
    // console.log(groupCountries(array, array.neighbors));
    //array.info.neighbors.name

    const map = new Map();
    for (let i = 0; i < array.length; i++) {
      if (!map.has(array[i].name)) {
        map.set(array[i].name, array[i].neighbors);
      }
    }
    let mutualCountries = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].neighbors.length; j++) {
        if (map.has(array[i].neighbors[j].name)) {
          mutualCountries.push({
            first: array[i].name,
            second: array[i].neighbors[j].name,
          });
        }
      }
    }

    if (mutualCountries.length === 0) {
      setNeighborsStatus("No neighbors found:");
      setGroupings("No groupings found.");
    } else {
      setNeighborsStatus("Multiple mutual neighbors found");
      setGroupings(
        mutualCountries.map((d) => (
          <li key={d.first}>
            {d.first} - {d.second}
          </li>
        ))
      );
    }
  };
  return (
    <div>
      <div>
        <b>
          <u>{neighborsStatus}</u>
        </b>
      </div>
      <div>
        <button onClick={generateGroupings}>Generate Groupings</button>
      </div>
      <div>
        <b>Selected Countries</b>
      </div>
      <div>{countries}</div>
      <div>
        <b>Neighbors</b>
      </div>
      <div>{groupings}</div>
    </div>
  );
}

export default App;
