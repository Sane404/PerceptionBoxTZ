import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import "./Character.css";
import { Button } from "@mui/material";

function Character() {
  let { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(undefined);
  const getCharData = () => {
    fetch(`https://rickandmortyapi.com/api/character/${id}`) //character id fetch
      .then((data) => data.json())
      .then((char) => {
        setCharacter(char);
        const episodeNumbers = char.episode.map((episode) => {
          return episode.split("/")[5];
        });
        fetch(`https://rickandmortyapi.com/api/episode/${episodeNumbers}`) // character episodes fetch
          .then((data) => data.json())
          .then((epi) => {
            let episodes = [];
            if (!Array.isArray(epi)) {
              // checking if episode propery is an array of objects or a single object
              const { name, episode, id } = epi;
              episodes = [{ name, episode, id }];
            } else {
              episodes = epi.map((e) => {
                //destructuring episodes
                const { name, episode, id } = e;
                return { name, episode, id };
              });
            }
            setCharacter({ ...char, episode: [...episodes] }); // finally changing episode property on original character fetch
            let storageData = JSON.parse(localStorage.getItem("Liked"));
            if (storageData) {
              const index = storageData.findIndex((element) => {
                if (element.id === +id) {
                  return true;
                }
                return false;
              });
              if (index !== -1) {
                setIsLiked(storageData[index].liked);
              }
            }
            setIsLoading(false);
          });
      });
  };
  const dateFormat = (date) => {
    let d = new Date(date).toString();
    let formattedDate = d.split(" ");
    let result = formattedDate.splice(1, 4).join(" ");
    return result;
  };
  const setCharLike = (val) => {
    // Like/Dislike local storage logic
    let storageData = JSON.parse(localStorage.getItem("Liked"));
    let item = {
      id: +id,
      liked: val,
    };
    if (storageData) {
      const index = storageData.findIndex((element) => {
        if (element.id === +id) {
          return true;
        }
        return false;
      });
      if (index !== -1) {
        storageData[index] = item;
      } else {
        storageData.push(item);
      }
    } else {
      storageData = [];
      storageData.push(item);
    }
    setIsLiked(val);
    localStorage.setItem("Liked", JSON.stringify(storageData));
  };
  useEffect(() => {
    getCharData();
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "90vh",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Card
            sx={{ width: 350, ml: "auto", mr: "auto", textAlign: "left" }}
            style={{
              background:
                isLiked === undefined
                  ? "#222"
                  : isLiked
                  ? `#008700`
                  : "#ed3c3c",
            }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 20 }} gutterBottom>
                Name: {character.name}
              </Typography>
              <Typography color="text.secondary">
                Species: {character.species}
              </Typography>
              <Typography variant="body1">
                Gender: {character.gender}
              </Typography>
              <Typography variant="body1">
                Location: {character.location.name}
              </Typography>
              <Typography variant="body1">
                Status: {character.status}
              </Typography>

              <Typography variant="body1">
                Created in: {dateFormat(character.created)}
              </Typography>
              <Button
                sx={{ mr: "5px" }}
                variant="contained"
                onClick={() => setCharLike(true)}
                disabled={isLiked}
              >
                Like
              </Button>
              <Button
                variant="contained"
                onClick={() => setCharLike(false)}
                disabled={isLiked === false}
              >
                DisLike
              </Button>
            </CardContent>
          </Card>
          <Typography
            variant="body1"
            sx={{ mb: 1.5, mt: 1.5, textAlign: "center" }}
          >
            Episodes:
          </Typography>
          <List className="episode-list">
            {character.episode.map((item) => {
              return (
                <ListItem key={item.id} sx={{ padding: "3px", width: "50%" }}>
                  <ListItemText>
                    {item.episode} - {item.name}
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
    </div>
  );
}

export default Character;
