import './App.css';
import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
import AddBusinessDialog from './components/AddBusinessDialog';
import brazilianBusiness from './db/brazilianBusiness'
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

  const [businessList, setList] = useState([]);

  const url = 'http://localhost:8080/api/brazilianBusiness'

  useEffect(() => {
    getBrazilianBusiness();
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };


  const getBrazilianBusiness = () => {
    axios.get(`${url}`,
      {headers: {
         authorization: ' xxxxxxxxxx' ,
         'Content-Type': 'application/json'
      }}
    )
    .then((response) => {
      const base64Flag = 'data:image/jpeg;base64,';
      const list = response.data.data.map(res => {
        const imageStr = arrayBufferToBase64(res.image.data.data);
        return {
          ...res,
          image: base64Flag + imageStr
        }
      })
      setList(list);
    })
    .catch((error) => console.error(`Error: ${error}`))
  }

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
    setList(filtered);
 }

  const handleMenuItemClick = (event, index) => {
    const filtered = index === 0 ? businessList : businessList.filter(business => {
        return business.category === index
     })
     setList(filtered);
  };

  return (
    <div className={classes.root}>
      <SearchAppBar onMenuClick={(e, index) => handleMenuItemClick(e, index)} onChange={(e) => updateInput(e.target.value)}/>
      <Container maxWidth="md">
        <Grid container justify="center">
          {
            businessList.map((business, index) => (
              <MediaCard
                business={business}
                key={index}
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
