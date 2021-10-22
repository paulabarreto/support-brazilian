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
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import axios from 'axios';
var qs = require('qs');


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  footer: {
    backgroundColor: '#3f51b5',
    height: 30,
    color: 'white',
    paddingTop: 10
  },
  margin: theme.spacing(1),
  mtop: 10,
}));

function App() {

  const { user, isAuthenticated, isLoading } = useAuth0();
  
  const [isAdmin, setAdmin] = useState(false);
  const [businessList, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const [isAPIdataLoading, setAPIdataLoading] = useState(true);
  const [page, setPage] = React.useState(1);
  const [category, setCategory] = React.useState(0);
  const [searchField, setSearchField] = React.useState('');
  const [pageCount, setPageCount] = React.useState(0);
  const [isFirstLoad, setFirstLoad] = React.useState(true);

  const handleChange = (event, value) => {
    setFirstLoad(false);
    setPage(value);
  };

  let url;
  let usersUrl;
  let countUrl;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = `${urls.LOCAL_API_URL}/${endpoints.GetBusiness}`;
    usersUrl = `${urls.LOCAL_API_URL}/${endpoints.GetUsers}`;    
    countUrl = `${urls.LOCAL_API_URL}/${endpoints.GetBusinessCount}`
  } else {
    url = `${urls.PRODUCTION_API_URL}/${endpoints.GetBusiness}`;
    usersUrl = `${urls.PRODUCTION_API_URL}/${endpoints.GetUsers}`; 
    countUrl = `${urls.LOCAL_API_URL}/${endpoints.GetBusinessCount}`;
  }

  const getFavourites = async (ids) => {
    try {
      const resp =  await axios.get('http://localhost:8080/api/brazilianBusinessFavourites', {
        params: {
          ids: ids
        },
        headers: {
          authorization: ' xxxxxxxxxx' ,
          'Content-Type': 'application/json'
        },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
        
      })
      const base64Flag = 'data:image/jpeg;base64,';

      const list = resp.data.data.map(res => {
        const imageStr = arrayBufferToBase64(res.image.data.data);
        return {
          ...res,
          image: base64Flag + imageStr,
          favourite: true
        }
      })
      return list;
    } catch(error) {
      console.log(error)
    }
  }

  const getBBs = async (isAdmin, page) => {
    let getURL = category === 0 ? `${url}/${page}` :
                    `${url}/${page}/${category}`;
    if(searchField !== '') {
      getURL = `${url}/${page}/0/${searchField}`
    }
    
    try {
      const resp = await axios.get(getURL,
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

  const getFavouritesList = async (user) => {
      try{
        const faves = await axios.get(`${usersUrl}/${user.email}`)
        setFavouriteList(faves.data)
        return faves.data
      } catch (error) {
        return `Error: ${error}`;
      }
  }

  const getBusinessCount = async (user) => {
      try{
        const count = await axios.get(`${countUrl}`)
        const businessCount = count.data.data;
        const numberOfPages = Math.round(businessCount / 5)
        setPageCount(numberOfPages);
        return count.data.data
      } catch (error) {
        return `Error: ${error}`;
      }
  }

  useEffect(() => {
    if(!isLoading) {
      const checkAdmin = user && user.email === 'paulavilaca@gmail.com' ? true : false
      setAdmin(checkAdmin);

      const fetchData = setTimeout(async () => {
        const [brazilianBusinsessList, favouriteBusinessList, pageCount] = await Promise.all([
          getBBs(isAdmin, page),
          getFavouritesList(user),
          getBusinessCount()
        ]);
        
        let updatedFavesList = brazilianBusinsessList.map(business => {
          return {
            ...business,
            favourite: favouriteList.includes(business._id)
          }
        })

        if(isFirstLoad) {
          updatedFavesList = updatedFavesList.map((item, index) => {
            return {
              ...item,
              position: index
            }
          })
        }
  
        setList(updatedFavesList);
        setFilteredList(updatedFavesList);
        setAPIdataLoading(false);
        return brazilianBusinsessList;
      }, 2500)
  
      return () => clearTimeout(fetchData)
    }
  }, [isLoading, isAPIdataLoading, page, category, searchField]);

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

  const handleMenuItemClick = async (event, index) => {
    let listByCategory = businessList;
    setPage(1);
    setCategory(index);
    if (index === 0) {
      setFirstLoad(true);
      setFilteredList(listByCategory)
      return listByCategory;
    }
    setFirstLoad(false);
    listByCategory = await getBBs(isAdmin, page);
    setFilteredList(listByCategory);

  };

  const [favesSelected, setFavesSelected] = useState(false);
  const handleShowFavourites = async (selected) => {
    if(!isAuthenticated) {
      handleOpenConfirmation();
    } else {
      if(selected) {
        setFirstLoad(false)
      } else {
        setFirstLoad(true)
      }
      setFavesSelected(selected)
      // const filterFaves = !selected ? businessList : businessList.filter(business => business.favourite)
      const filterFaves = !selected ? businessList : 
      await getFavourites(favouriteList);
      setFilteredList(filterFaves);
    }
  }

  const handleSearchField = (e) => {
    setPage(1);
    setSearchField(e);
    if(e !== '') {
      setFirstLoad(false)
    }
  }

  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };
  
  return (
    <div className={classes.root}>
      <SearchAppBar
        onMenuClick={(e, index) => handleMenuItemClick(e, index)} 
        onChange={(e) => handleSearchField(e)}
        handleClickOpen={handleClickOpen}
        favesSelected={favesSelected}
        handleShowFavourites={handleShowFavourites}
      />
      <Container maxWidth="md">
        <Grid container justifyContent="center" style={{marginTop: 70 + 'px'}}>
          {isAPIdataLoading &&
            <Grid item xs={12} md={6} style={{marginTop: 20 + 'px'}}>
              <Stack spacing={1}>
                <Skeleton variant="rectangular" width={350} height={300} />
              </Stack>
            </Grid>
          }
          { !isAPIdataLoading && filteredList.length > 0 &&
            filteredList.map((business, index) => (
              <MediaCard
                business={business}
                key={index}
                isAdmin={isAdmin}
                page={page}
                openConfirmation={handleOpenConfirmation}
              />
            ))
          }
          { !isAPIdataLoading &&
            filteredList.length === 0 &&
            <h3>No results to show</h3>
          }

          <Grid item xs={12}>
            <Grid container justifyContent="center" style={{marginTop: 30 + 'px'}}>
              <Typography>Page: {page}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center" style={{marginTop: 10 + 'px'}}>
                <Pagination count={pageCount} page={page} onChange={handleChange} />
            </Grid>
          </Grid>
          
        </Grid>
        <AddBusinessDialog open={open} handleClose={handleClose} user={user}/>
        <ConfirmationDialog 
          open={openConfirmation}
          handleCloseConfirmation={handleCloseConfirmation}
          title="Let's meet!"
          confirmation={'Please Sign Up/Login to enable Add Business and Favourite Button'}
        />
      </Container>
      <footer className={classes.footer}>
        <Grid container justifyContent="center">
          <Typography variant="subtitle2">
            Created by Paula Barreto | <a style={{color: 'inherit', textDecoration:"none"}} 
                  target="_blank" href="https://www.paulabarreto.ca">www.paulabarreto.ca</a>
          </Typography>
        
        </Grid>
      </footer>

    </div>
  );
}

export default App;
