import './App.css';
import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
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

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';
import InstagramIcon from '@material-ui/icons/Instagram';

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
      console.log("🚀 ~ file: App.js ~ line 67 ~ .then ~ response", response)
      var base64Flag = 'data:image/jpeg;base64,';
      if(response.data.data[2].image.data.data){
        var imageStr = arrayBufferToBase64(response.data.data[2].image.data.data);
        response.data.data[2].image = base64Flag + imageStr;
      }
      setList(response.data.data);
      console.log("🚀 ~ file: App.js ~ line 55 ~ .then ~ businessList", businessList)
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
      return business.category.includes(index)
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a Brazilian Business</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To request a Brazilian business addition, please submit the info below.
            </DialogContentText>
            <FormControl className={classes.margin}>
            <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="website">Website</InputLabel>
                <Input
                  id="website"
                  startAdornment={
                    <InputAdornment position="start">
                      <LanguageIcon />
                    </InputAdornment>
                  }
                />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="Instagram">Instagram</InputLabel>
                <Input
                  id="Instagram"
                  startAdornment={
                    <InputAdornment position="start">
                      <InstagramIcon />
                    </InputAdornment>
                  }
                />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default App;
