import React, { useRef } from 'react'
import { useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import './Homepage.css';
function Homepage() {
  const [characters, setCharacters] = useState([])
  const [nextLink, setNextLink] = useState('');
  const [searchQuery,setSearchQuery] = useState('');
  const optRef = useRef(null)
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
  const onInputChange = val => {
    setSearchQuery(val);
    if(val === ''){
      optRef.current.style.display = 'none';  
    }
    optRef.current.style.display = 'flex'
  }
  const onFocusEvent = () => {
    if(searchQuery) optRef.current.style.display = 'flex';
  }
  const onBlurEvent = (e) => {
    if (!e.currentTarget.parentNode.contains(e.relatedTarget)) {
        optRef.current.style.display = 'none'; 
    }
  }
  return (
    <div>
      <div className="autocomplete">
        <input type="text" id='search' placeholder='Find character' 
          value={searchQuery}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={(e)=> onBlurEvent(e)}
          onFocus={onFocusEvent}
        />
        <div className="options" ref={optRef}>
          {characters.filter(c=> c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(el=>{
            return <Link to={`/character/${el.id}`}className='option' key={el.id}>{el.name}</Link>
          })}
        </div>
      </div>
      
    <Box className='char-list-wrap'>

        <List className='char-list'>
          {characters.map(el=>{
            return <Link to={`/character/${el.id}`} key={el.id} className='char-link'>
                      <ListItem className='char-text'>
                        <ListItemText>{el.name}</ListItemText>
                        <ListItemText>{el.status}</ListItemText>
                      </ListItem>
                    </Link>
          })}
        </List>
    </Box>
      {/* {characters.map(el=>{
        return <Link to={`/character/${el.id}`} key={el.id}>{el.name}</Link>
      })} */}
      <button onClick={loadMore}>Load more</button>
    </div>
    
  )
}

export default Homepage