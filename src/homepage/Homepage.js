import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Homepage.css";
function Homepage() {
  const [characters, setCharacters] = useState([]);
  const [nextLink, setNextLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const optRef = useRef(null);
  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((data) => data.json())
      .then((c) => {
        let optimized = c.results.map((results) => {
          const { name, id, status } = results;
          return { name, id, status };
        });

        console.log(optimized);
        setCharacters(optimized);
        setNextLink(c.info.next);
      });
  }, []);
  const loadMore = () => {
    fetch(nextLink)
      .then((data) => data.json())
      .then((c) => {
        setCharacters([...characters, ...c.results]);
        setNextLink(c.info.next);
      });
  };
  const onInputChange = (val) => {
    setSearchQuery(val);
    if (val === "") {
      optRef.current.style.display = "none";
    }
    optRef.current.style.display = "flex";
  };
  const onFocusEvent = () => {
    if (searchQuery) optRef.current.style.display = "flex";
  };
  const onBlurEvent = (e) => {
    if (
      !e.currentTarget.parentNode.parentNode.parentNode.contains(
        e.relatedTarget // Material UI fix
      )
    ) {
      optRef.current.style.display = "none";
    }
  };
  return (
    <div>
      <div className="autocomplete">
        <TextField
          sx={{ width: 300 }}
          label="Standard"
          variant="standard"
          type="text"
          id="search"
          placeholder="Find character"
          value={searchQuery}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={(e) => onBlurEvent(e)}
          onFocus={onFocusEvent}
        />
        <div className="options" ref={optRef}>
          {characters
            .filter((c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((el) => {
              return (
                <Link to={`/character/${el.id}`} className="option" key={el.id}>
                  {el.name}
                </Link>
              );
            })}
        </div>
      </div>

      <Box className="char-list-wrap">
        <List className="char-list">
          {characters.map((el) => {
            return (
              <Box
                sx={{ border: 1, borderColor: "primary.main" }}
                key={el.id}
                style={{
                  background:
                    el.liked === undefined
                      ? "#111"
                      : el.liked
                      ? "#008700"
                      : "#ed3c3c",
                }}
              >
                <Link to={`/character/${el.id}`} className="char-link">
                  <ListItem className="char-text">
                    <ListItemText>
                      <Typography sx={{ fontSize: 16 }} variant="body1">
                        {el.name}
                      </Typography>
                    </ListItemText>
                    <ListItemText>
                      <Typography sx={{ fontSize: 14 }} variant="body2">
                        {el.status}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                </Link>
              </Box>
            );
          })}
        </List>
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        onClick={loadMore}
        className="btn-load"
      >
        Load more
      </Button>
    </div>
  );
}

export default Homepage;
