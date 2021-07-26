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
import * as urls from './constants';
import * as endpoints from './endpoints';
import ConfirmationDialog from './components/ConfirmationDialog';

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
  
  const [isAdmin, setAdmin] = useState(false);
  const [businessList, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const [mostLikedBusiness, setMostLiked] = useState([]);
  const [isAPIdataLoading, setAPIdataLoading] = useState(true);

  let url;
  let usersUrl;
  let mostLikedUrl;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = `${urls.LOCAL_API_URL}/${endpoints.GetBusiness}`;
    usersUrl = `${urls.LOCAL_API_URL}/${endpoints.GetUsers}`;    
    mostLikedUrl = `${urls.LOCAL_API_URL}/${endpoints.getMostLikedBusiness}`;    
  } else {
    url = `${urls.PRODUCTION_API_URL}/${endpoints.GetBusiness}`;
    usersUrl = `${urls.PRODUCTION_API_URL}/${endpoints.GetUsers}`;
    mostLikedUrl = `${urls.PRODUCTION_API_URL}/${endpoints.getMostLikedBusiness}`;    
  }

  const getBBs = async (isAdmin) => {
    try {
      const resp = await axios.get(`${url}`,
      {headers: {
         authorization: ' xxxxxxxxxx' ,
         'Content-Type': 'application/json'
      }})

      const base64Flag = 'data:image/jpeg;base64,';
      let list = [];
      if (!isAdmin) {
        list = resp.data.data.filter(res => res.adminApproved)
        .map(res => {
          const imageStr = arrayBufferToBase64(res.image.data.data);
          return {
            ...res,
            image: base64Flag + imageStr
          }
        });
      } else {
        list = resp.data.data.map(res => {
          const imageStr = arrayBufferToBase64(res.image.data.data);
          return {
            ...res,
            image: base64Flag + imageStr
          }
        })
      }
      list.join(sortByName(list));
      list.sort(sortByName(list));
      if(isAdmin) {
        list.sort(showPendingApprovalFirst(list));
      }
      return list;
    } catch(error) {
      console.error(`Error: ${error}`)
    }
  }

  const showPendingApprovalFirst = (list) => {
    list.sort(function(a, b) {
      const statusA = a.adminApproved
      const statusB = b.adminApproved
      if(statusA === true && statusB === false) {
        return 1
      }
      if(statusA === false && statusB === true) {
        return -1
      }
      return 0
    })
  }

  const sortByName = (list) => {
    list.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
  
      // names must be equal
      return 0;
    });
  }

  const getFavouritesList = async (user) => {
      try{
        const faves = await axios.get(`${usersUrl}/${user.email}`)
        setFavouriteList(faves.data)
        return faves.data
      } catch (error) {
        return `Error: ${error}`;
      }
  }

  const getMostLikedBusiness = async () => {
      try{
        const mostLiked = await axios.get(`${mostLikedUrl}`)
        setMostLiked(mostLiked.data)
        return mostLiked.data
      } catch (error) {
        return `Error: ${error}`;
      }
  }


  useEffect(async () => {
    if(!isLoading) {

      const checkAdmin = user && user.email === 'paulavilaca@gmail.com' ? true : false
      setAdmin(checkAdmin);

      const [brazilianBusinsessList, favouriteBusinessList, mostLiked] = await Promise.all([
        getBBs(isAdmin),
        getFavouritesList(user),
        getMostLikedBusiness()
      ]);
      
      let updatedFavesList = brazilianBusinsessList.map(business => {
        return {
          ...business,
          favourite: favouriteList.includes(business._id)
        }
      })

      /**
       * List 1 consists of most liked business
       * List 2 with all the others
       */
      // const list1 = updatedFavesList.filter(business => {
      //   return mostLiked.includes(business._id)
      // })

      const list1 = mostLiked.map(likedId => {
        return updatedFavesList.find(business => business._id === likedId)
      })

      const list2 = updatedFavesList.filter(business => {
        return !mostLiked.includes(business._id)
      })

      const finalList = [
        ...list1,
        ...list2
      ];

      setList(finalList);
      setFilteredList(finalList);
      setAPIdataLoading(false);
    }
  }, [isLoading, isAPIdataLoading]);

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if(!user && !isLoading) {
      handleOpenConfirmation();
    } else {
      setOpen(true);
    }
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

  const [favesSelected, setFavesSelected] = useState(false);
  const handleShowFavourites = (selected) => {
    if(!isAuthenticated) {
      handleOpenConfirmation();
    } else {
      setFavesSelected(selected)
      const filterFaves = !selected ? businessList : businessList.filter(business => business.favourite)
      setFilteredList(filterFaves);
    }
  }

  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  if (isLoading  || isAPIdataLoading) {
    return <div>Loading ...</div>;
  }
  
  return (
    <div className={classes.root}>
      <SearchAppBar
        onMenuClick={(e, index) => handleMenuItemClick(e, index)} 
        onChange={(e) => updateInput(e.target.value)}
        handleClickOpen={handleClickOpen}
        favesSelected={favesSelected}
        handleShowFavourites={handleShowFavourites}
      />
      <Container maxWidth="md">
        <Grid container justify="center" style={{marginTop: 70 + 'px'}}>
          { filteredList.length > 0 &&
            filteredList.map((business, index) => (
              <MediaCard
                business={business}
                key={index}
                index={index}
                isAdmin={isAdmin}
                openConfirmation={handleOpenConfirmation}
              />
            ))
          }
          {
            filteredList.length === 0 &&
            <h3>No results to show</h3>
          }
        </Grid>
        <AddBusinessDialog open={open} handleClose={handleClose} user={user}/>
        <ConfirmationDialog 
          open={openConfirmation}
          handleCloseConfirmation={handleCloseConfirmation}
          title="Let's meet!"
          confirmation={'Please Sign Up/Login to enable Add Business and Favourite Button'}
        />
      </Container>
    </div>
  );
}

export default App;
