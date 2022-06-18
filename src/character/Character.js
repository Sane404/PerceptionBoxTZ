import React, {useEffect , useState} from 'react'
import { useParams } from 'react-router-dom'
function Character() {
  let { id } = useParams();
  const [character , setCharacter] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  
  const getCharData = () =>{
    fetch(`https://rickandmortyapi.com/api/character/${id}`) //character id fetch
    .then(data => data.json())
    .then(char =>{
        setCharacter(char);
        const episodeNumbers = char.episode.map(episode =>{
            return episode.split('/')[5];
        })
        fetch(`https://rickandmortyapi.com/api/episode/${episodeNumbers}`) // character episodes fetch
        .then(data=>data.json())
        .then(epi => {
            let episodes = [];
            if(!Array.isArray(epi)){
              const {name , episode , id} = epi;
              episodes = [{name,episode,id}];
            }else{
            episodes = epi.map( e => {    //destructuring episodes
                const {name , episode , id} = e;
                return {name, episode ,id};
            })
          }
            setCharacter({...char, episode:[...episodes]}) // finally changing episode property on original character fetch 
            setIsLoading(false)   
            } 
        )
        
    })
  }
  const dateFormat = date =>{
    let d = new Date(date).toString();
    let formattedDate = d.split(' ');
    let result = formattedDate.splice(1,4);
    return result
  }
  useEffect(() => {
    getCharData();
  }, [])
  return (
    <div>
        {isLoading ? <h1>Page is loading</h1>
         : <div>
            {character.name}
            {character.species}
            {character.gender}
            {character.location.name}
            {character.episode.map(item =>{
                return <em key={item.id}>{item.name}{item.episode}</em>
            })}
            {character.status}
            {dateFormat(character.created)}
           </div>
        }
        
    </div>
  )
}

export default Character
