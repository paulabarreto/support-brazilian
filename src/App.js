import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
import AddBusinessDialog from './components/AddBusinessDialog';
import { useAuth0 } from "@auth0/auth0-react";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import React, { useState, useEffect } from 'react';
import * as endpoints from './endpoints';
import ConfirmationDialog from './components/ConfirmationDialog';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import urlService from './urls';
import { getBusiness, getFavourites, getFavouritesList, getBusinessCount } from './services/getBusiness';

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

  // For page count track which filter is being used
  const [filter, setFilter] = React.useState('category');

  // For skeleton loading
  const dummyArray = [1, 2, 3];

  const handleChange = (event, value) => {
    setAPIdataLoading(true);
    setFirstLoad(false);
    setPage(value);
  };

  const url = urlService(endpoints.GetBusiness);
  const usersUrl = urlService(endpoints.GetUsers);
  const countUrl = urlService(endpoints.GetBusinessCount);
  const favouritesUrl = urlService(endpoints.GetFavourites);

  const getBBs = async (isAdmin, page) => {
    setAPIdataLoading(true);
    let getURL = category === 0 ? `${url}/${page}` :
                    `${url}/${page}/${category}`;
    if(searchField !== '') {
      getURL = `${url}/${page}/0/${searchField}`
    }
    let list = [];
    
    list = await getBusiness(getURL);
    if(!isAdmin){
      return list.filter(item => item.adminApproved)
    }
    list.sort(showPendingApprovalFirst(list));
    return list;
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

  const favouritesList = async (user) => {
    const faves = await getFavouritesList(usersUrl, user)
    setFavouriteList(faves)
  }

  const businessCount = async () => {
    const count = await getBusinessCount(`${countUrl}/${filter}/${category}`)
    const numberOfPages = Math.round(count / 5)
    setPageCount(numberOfPages);
  }

  useEffect(() => {
    if(!isLoading) {
      const checkAdmin = user && user.email === 'paulavilaca@gmail.com' ? true : false
      setAdmin(checkAdmin);

      const fetchData = setTimeout(async () => {
        const [brazilianBusinsessList, favouriteBusinessList, pageCount] = await Promise.all([
          getBBs(isAdmin, page),
          favouritesList(user),
          businessCount()
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
  }, [isLoading, page, category, searchField]);

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
    setAPIdataLoading(true);
    let listByCategory = businessList;
    setPage(1);
    setCategory(index);
    setFilter('category');
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
      await getFavourites(favouritesUrl, favouriteList);
      setFilteredList(filterFaves);
      const numOfPages = Math.round(favouriteList.length / 5)
      setPageCount(numOfPages)
    }
  }

  const handleSearchField = (e) => {
    setPage(1);
    setSearchField(e);
    setFilter('name');
    setCategory(e);
    const filtered = businessList.filter(business => {
      return business.name.toLowerCase().includes(e.toLowerCase())
     })
    setFilteredList(filtered);
    if(e !== '') {
      setFirstLoad(false)
    }
    if (e === '') { 
      setCategory(0);
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
          {isAPIdataLoading && dummyArray.map(skeleton => (
            <Grid item xs={12} md={6} style={{marginTop: 20 + 'px'}}>
              <Stack spacing={1}>
                <Skeleton variant="rectangular" width={350} height={300} />
              </Stack>
            </Grid>
            ))
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
