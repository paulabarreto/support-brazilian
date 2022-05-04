import "@fontsource/roboto";
import SearchAppBar from "./components/AppBar";
import NavigationBar from "./components/NavigationBar";
import MediaCard from "./components/Card";
import AddBusinessDialog from "./components/AddBusinessDialog";
import { useAuth0 } from "@auth0/auth0-react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState, useEffect } from "react";
import * as endpoints from "./endpoints";
import ConfirmationDialog from "./components/ConfirmationDialog";
import ContactDialog from "./components/ContactDialog";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import urlService from "./services/urls";
import {
  getBusiness,
  getFavourites,
  getFavouritesList,
  getBusinessCount,
} from "./services/getBusiness";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  footer: {
    backgroundColor: "#3f51b5",
    height: 30,
    color: "white",
    paddingTop: 10,
  }
}));

const options = ["Services", "Food", "Groceries"];

function App() {
  let { searchLocation } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [isAdmin, setAdmin] = useState(false);
  const [businessList, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const [isAPIdataLoading, setAPIdataLoading] = useState(true);
  const [page, setPage] = React.useState(1);
  const [category, setCategory] = React.useState(0);
  const [searchField, setSearchField] = React.useState("");
  const [pageCount, setPageCount] = React.useState(0);
  const [spacing, setSpacing] = React.useState(4);
  const [isSearchLocationOn, setSearchLocation] = React.useState(false);

  // For page count track which filter is being used
  const [filter, setFilter] = React.useState("category");

  // For skeleton loading
  const dummyArray = [1, 2, 3, 4, 5, 6];

  const handleChange = (event, value) => {
    setAPIdataLoading(true);
    setPage(value);
  };

  const url = urlService(endpoints.GetBusiness);
  const urlLocationSearch = urlService(endpoints.GetBusinessLocationSearch);
  const adminUrl = urlService(endpoints.GetBusinessAdmin);
  const usersUrl = urlService(endpoints.GetUsers);
  const countUrl = urlService(endpoints.GetBusinessCount);
  const favouritesUrl = urlService(endpoints.GetFavourites);

  const getBBs = async (page) => {

    setAPIdataLoading(true);
    let getURL =
      category === 0 ? `${url}/${page}` : `${url}/${page}/${category}`;
    if (searchField !== "") {
      getURL = `${url}/${page}/0/${searchField}`;
    }
    let list = [];

    if(searchLocation !== undefined) {
      setSearchLocation(true);
      list = await getBusiness(`${urlLocationSearch}/${page}/${searchLocation}`);
      const numberOfPages = Math.round(list.length / 5);
      setPageCount(numberOfPages);
      return list
    }

    list = await getBusiness(getURL);
    const admin = await checkAdmin()
    //TODO remove this condition, handle it on the api
    if (!admin && list) {
      return list.filter((item) => item.adminApproved);
    }
    return list;
  };

  const favouritesList = async (user) => {
    const faves = await getFavouritesList(usersUrl, user);
    setFavouriteList(faves);
  };

  const businessCount = async () => {
    const count = await getBusinessCount(`${countUrl}/${filter}/${category}`);
    const numberOfPages = Math.round(count / 5);
    setPageCount(numberOfPages);
  };

  const checkAdmin = () => {
    const admin = user && user.email === process.env.REACT_APP_ADMIN_EMAIL ? true : false;
    setAdmin(admin);
    return admin;
  }

  useEffect(() => {
    if (!isLoading) {
      const fetchData = setTimeout(async () => {
        const [brazilianBusinsessList, favouriteBusinessList, pageCount] =
          await Promise.all([
            getBBs(page),
            favouritesList(user),
            businessCount(),
          ]);

        let updatedFavesList = brazilianBusinsessList ? brazilianBusinsessList.map((business) => {
          return {
            ...business,
            favourite: favouriteList.includes(business._id),
          };
        }) : [];

        setList(updatedFavesList);
        setFilteredList(updatedFavesList);
        setAPIdataLoading(false);
        return brazilianBusinsessList;
      }, 2500);

      return () => clearTimeout(fetchData);
    }
  }, [isLoading, page, category, searchField]);

  const [open, setOpen] = React.useState(false);
  const [openContactDialog, setOpenContactDialog] = React.useState(false);

  const handleOpenContactDialog = () => {
    setOpenContactDialog(true)
  }

  const closeContactDialog = () => {
    setOpenContactDialog(false)
  }

  const handleClickOpen = () => {
    if (!user && !isLoading) {
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
    setFilter("category");
    if (index === 0) {
      setFilteredList(listByCategory);
    } else {
      listByCategory = await getBBs(page);
      setFilteredList(listByCategory);
    }
  };

  const [favesSelected, setFavesSelected] = useState(false);
  const handleShowFavourites = async (selected) => {
    if (!isAuthenticated) {
      handleOpenConfirmation();
    } else {
      setFavesSelected(selected);
      // const filterFaves = !selected ? businessList : businessList.filter(business => business.favourite)
      const filterFaves = !selected
        ? businessList
        : await getFavourites(favouritesUrl, favouriteList);
      setFilteredList(filterFaves);
      const numOfPages = Math.round(favouriteList.length / 5);
      setPageCount(numOfPages);
    }
  };

  const handleSearchField = (e) => {
    setPage(1);
    setSearchField(e);
    setFilter("name");
    setCategory(e);
    const filtered = businessList.filter((business) => {
      return business.name.toLowerCase().includes(e.toLowerCase());
    });
    setFilteredList(filtered);
    if (e === "") {
      setCategory(0);
    }
  };

  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleAdminRequest = async () => {
    const list = await getBusiness(adminUrl);
    setFilteredList(list)
    setList(list)
  }

  return (
    <div className={classes.root}>
      <NavigationBar
        handleShowFavourites={handleShowFavourites}
        favesSelected={favesSelected}
        handleClickOpen={handleClickOpen}
        handleOpenContactDialog={handleOpenContactDialog}
        onMenuClick={(e, index) => handleMenuItemClick(e, index)}
        isSearchLocationOn={isSearchLocationOn}
      />
      <div className={classes.sectionMobile}>
        <SearchAppBar
          onMenuClick={(e, index) => handleMenuItemClick(e, index)}
          onChange={(e) => handleSearchField(e)}
          handleClickOpen={handleClickOpen}
          favesSelected={favesSelected}
          handleShowFavourites={handleShowFavourites}
          map={false}
          handleAdminRequest={handleAdminRequest}
          isAdmin={isAdmin}
          handleOpenContactDialog={handleOpenContactDialog}
          isSearchLocationOn={isSearchLocationOn}
        />
      </div>

      <Container maxWidth="lg" style={{marginTop: '100px'}}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={spacing}>
            {isAPIdataLoading &&
              dummyArray.map((skeleton, index) => (
                <Grid item>
                  <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={350} height={300} />
                  </Stack>
                </Grid>
              ))}
            {!isAPIdataLoading &&
              filteredList.length > 0 &&
              filteredList.map((business, index) => (
                <Grid item>
                  <MediaCard
                    business={business}
                    key={index}
                    isAdmin={isAdmin}
                    page={page}
                    openConfirmation={handleOpenConfirmation}
                  />
                </Grid>
              ))}
            {!isAPIdataLoading && filteredList.length === 0 && (
              <Grid item>
                <h3>No results to show</h3>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            style={{ marginTop: 30 + "px" }}
          >
            <Typography>Page: {page} </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            style={{ marginTop: 10 + "px" }}
          >
            <Pagination count={pageCount} page={page} onChange={handleChange} />
          </Grid>
        </Grid>
        <AddBusinessDialog open={open} handleClose={handleClose} user={user} />
        <ConfirmationDialog
          open={openConfirmation}
          handleCloseConfirmation={handleCloseConfirmation}
          title="Let's meet!"
          confirmation={
            "Please Sign Up/Login to enable Add Business and Favourite Button"
          }
        />
        <ContactDialog open={openContactDialog} handleClose={closeContactDialog} />
      </Container>
      <footer className={classes.footer}>
        <Grid container justifyContent="center">
          <Typography variant="subtitle2">
            Developed by Paula Barreto
          </Typography>
        </Grid>
      </footer>
    </div>
  );
}

export default App;
