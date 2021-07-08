import './App.css';
import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
import AddBusinessDialog from './components/AddBusinessDialog';
import { useAuth0 } from "@auth0/auth0-react";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import React, { useState, useEffect } from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
  },
  margin: theme.spacing(1),
}));

function App() {

  const { user, isAuthenticated, isLoading } = useAuth0();

  const [businessList, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const [isAPIdataLoading, setAPIdataLoading] = useState(true);

  const url = 'http://localhost:8080/api/brazilianBusiness'
  const usersUrl = 'http://localhost:8080/api/users';

  const getBBs = async () => {
    try {
      const resp = await axios.get(`${url}`,
      {headers: {
         authorization: ' xxxxxxxxxx' ,
         'Content-Type': 'application/json'
      }})

      const base64Flag = 'data:image/jpeg;base64,';
      const list = resp.data.data.map(res => {
        const imageStr = arrayBufferToBase64(res.image.data.data);
        return {
          ...res,
          image: base64Flag + imageStr
        }
      })
      return list
    } catch(error) {
      console.error(`Error: ${error}`)
    }
  }

  const getFavouritesList = async (user) => {
      try{
        const faves = await axios.get(`${usersUrl}/${user.email}`)
        setFavouriteList(faves.data)
        console.log("🚀 ~ file: App.js ~ line 69 ~ getFavouritesList ~ faves.data", faves.data)
        return faves.data
      } catch (error) {
        return `Error: ${error}`;
      }
  }

  useEffect(async () => {
    if(!isLoading) {
      const [brazilianBusinsessList, favouriteBusinessList] = await Promise.all([
        getBBs(),
        getFavouritesList(user),
      ]);
      
      const updatedFavesList = brazilianBusinsessList.map(business => {
        return {
          ...business,
          favourite: favouriteList.includes(business._id)
        }
      })
      setList(updatedFavesList);
      setFilteredList(updatedFavesList);
      setAPIdataLoading(false);
    }
  }, [isLoading, isAPIdataLoading]);

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  const [value, setValue] = React.useState(0);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  const updateInput = async (input) => {
    const filtered = businessList.filter(business => {
     return business.name.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredList(filtered);
 }

  const handleMenuItemClick = (event, index) => {
    const filtered = index === 0 ? businessList : businessList.filter(business => {
      return business.category === index
     })
     setFilteredList(filtered);
  };

  if (isLoading  || isAPIdataLoading) {
    return <div>Loading ...</div>;
  }
  
  return (
    <div className={classes.root}>
      <SearchAppBar onMenuClick={(e, index) => handleMenuItemClick(e, index)} onChange={(e) => updateInput(e.target.value)}/>
      <Container maxWidth="md">
        <Grid container justify="center">
          {
            filteredList.map((business, index) => (
              <MediaCard
                business={business}
                key={index}
                getBBs={getBBs}
              />
            ))
          }
        </Grid>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            className={classes.root}
          >
          <BottomNavigationAction label="Add Business" icon={<AddCircleIcon />} onClick={handleClickOpen} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
        <AddBusinessDialog open={open} handleClose={handleClose}/>
      </Container>
    </div>
  );
}

export default App;
