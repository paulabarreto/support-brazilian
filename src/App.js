import "@fontsource/roboto";
import AppBarMobile from "./components/appBar/AppBarMobile";
import AppBarDesktop from "./components/appBar/AppBarDesktop";
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
import BusinessListInfiniteLoad from "./components/BusinessListInfiniteLoad";
import BusinessList from "./components/BusinessList";
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
  const [category, setCategory] = React.useState(0);
  const [searchField, setSearchField] = React.useState("");
  const [spacing, setSpacing] = React.useState(4);
  const [isSearchLocationOn, setSearchLocation] = React.useState(false);

  // For page count track which filter is being used
  const [filter, setFilter] = React.useState("category");

  // For skeleton loading
  const dummyArray = [1, 2, 3, 4, 5, 6];

  const url = urlService(endpoints.GetBusiness);
  const urlLocationSearch = urlService(endpoints.GetBusinessLocationSearch);
  const adminUrl = urlService(endpoints.GetBusinessAdmin);
  const usersUrl = urlService(endpoints.GetUsers);
  const favouritesUrl = urlService(endpoints.GetFavourites);

  const getBBs = async () => {

    setAPIdataLoading(true);
    let getURL =
      category === 0 ? `${url}` : `${url}/${category}`;
    if (searchField !== "") {
      getURL = `${url}/0/${searchField}`;
    }
    let list = [];

    if(searchLocation !== undefined) {
      setSearchLocation(true);
      list = await getBusiness(`${urlLocationSearch}/${searchLocation}`);
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

  const checkAdmin = () => {
    const admin = user && user.email === process.env.REACT_APP_ADMIN_EMAIL ? true : false;
    setAdmin(admin);
    return admin;
  }

  useEffect(() => {
    if (!isLoading) {
      const fetchData = setTimeout(async () => {
        const [brazilianBusinsessList, favouriteBusinessList] =
          await Promise.all([
            getBBs(),
            favouritesList(user),
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
  }, [isLoading, category, searchField]);

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
    setCategory(index);
    setFilter("category");
    if (index === 0) {
      setFilteredList(listByCategory);
    } else {
      listByCategory = await getBBs(1);
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
    }
  };

  const handleSearchField = (e) => {
    setSearchField(e);
    setFilter("name");
    setCategory(0);
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
      <AppBarDesktop
        handleShowFavourites={handleShowFavourites}
        favesSelected={favesSelected}
        handleClickOpen={handleClickOpen}
        handleOpenContactDialog={handleOpenContactDialog}
        onMenuClick={(e, index) => handleMenuItemClick(e, index)}
        isSearchLocationOn={isSearchLocationOn}
        onChange={(e) => handleSearchField(e)}
        isAdmin={isAdmin}
        handleAdminRequest={handleAdminRequest}
      />
      <div className={classes.sectionMobile}>
        <AppBarMobile
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
            {/* {favesSelected && !isAPIdataLoading &&
              filteredList.length > 0 &&
              filteredList.map((business, index) => (
                <Grid item>
                  <MediaCard
                    business={business}
                    key={index}
                    isAdmin={isAdmin}
                    openConfirmation={handleOpenConfirmation}
                  />
                </Grid>
              ))} */}
          </Grid>
        </Grid>
        {category === 0 && !favesSelected && !searchLocation && !searchField ?
          <BusinessListInfiniteLoad
            brazilianBusinessList={filteredList}
          />
          :
          <BusinessList
            brazilianBusinessList={filteredList}
          />
        }
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