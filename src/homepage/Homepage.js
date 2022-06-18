import React from 'react'
import { useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './Homepage.css';
function Homepage() {
  const [characters, setCharacters] = useState([])
  const [nextLink, setNextLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
    .then(data =>data.json())
    .then(c => {
        setCharacters(c.results);
        setNextLink(c.info.next)
    })
    return () => {
    }
  }, [])
  const loadMore = () =>{
    fetch(nextLink)
    .then(data=>data.json())
    .then(c => {
        setCharacters([...characters, ...c.results]);
        setNextLink(c.info.next)
    })
  }
  const goToCharPage = name =>{
    let parse = name.split('.')[0];
    window.location.assign(`character/${parse}`);
  }
  return (
    <div>
      {console.log(characters)}
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        getOptionLabel={(characters) =>`${characters.id}.${characters.name}`}
        onChange={(e)=> goToCharPage(e.target.innerText)}
        options={characters}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Character" />}
      />
      {/* <input type="text" id='search' placeholder='Find character' 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
     */}
      {characters.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(el=>{
        return <Link to={`/character/${el.id}`} key={el.id}>{el.name}</Link>
      })}
      <button onClick={loadMore}>Load more</button>
    </div>
    
  )
}

export default Homepage