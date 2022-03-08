import "@fontsource/roboto";
import SearchAppBar from "./components/AppBar";
import MediaCard from "./components/Card";
import AddBusinessDialog from "./components/AddBusinessDialog";
import { useAuth0 } from "@auth0/auth0-react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState, useEffect } from "react";
import * as endpoints from "./endpoints";
import ConfirmationDialog from "./components/ConfirmationDialog";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
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
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FastfoodIcon from '@material-ui/icons/Fastfood';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  footer: {
    backgroundColor: "#3f51b5",
    height: 30,
    color: "white",
    paddingTop: 10,
  },
  margin: theme.spacing(1),
  mtop: 10,
  image: {
    position: "relative",
    height: 200,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 6
    }px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

const options = ['Services', 'Food', 'Groceries'];


function App() {
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
  const [isFirstLoad, setFirstLoad] = React.useState(true);
  const [spacing, setSpacing] = React.useState(2);

  // For page count track which filter is being used
  const [filter, setFilter] = React.useState("category");

  // Button group
  const [openButton, setOpenButton] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClickButtonGroup = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClickButtonGroup = (event, index) => {
    setSelectedIndex(index);
    setOpenButton(false);
  };

  const handleToggleButtonGroup = () => {
    setOpenButton((prevOpen) => !prevOpen);
  };

  const handleCloseButton = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

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
    let getURL =
      category === 0 ? `${url}/${page}` : `${url}/${page}/${category}`;
    if (searchField !== "") {
      getURL = `${url}/${page}/0/${searchField}`;
    }
    let list = [];

    list = await getBusiness(getURL);
    if (!isAdmin) {
      return list.filter((item) => item.adminApproved);
    }
    list.sort(showPendingApprovalFirst(list));
    return list;
  };

  const showPendingApprovalFirst = (list) => {
    list.sort(function (a, b) {
      const statusA = a.adminApproved;
      const statusB = b.adminApproved;
      if (statusA === true && statusB === false) {
        return 1;
      }
      if (statusA === false && statusB === true) {
        return -1;
      }
      return 0;
    });
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

  useEffect(() => {
    if (!isLoading) {
      const checkAdmin =
        user && user.email === process.env.REACT_APP_ADMIN_EMAIL ? true : false;
      setAdmin(checkAdmin);

      const fetchData = setTimeout(async () => {
        const [brazilianBusinsessList, favouriteBusinessList, pageCount] =
          await Promise.all([
            getBBs(isAdmin, page),
            favouritesList(user),
            businessCount(),
          ]);

        let updatedFavesList = brazilianBusinsessList.map((business) => {
          return {
            ...business,
            favourite: favouriteList.includes(business._id),
          };
        });

        if (isFirstLoad) {
          updatedFavesList = updatedFavesList.map((item, index) => {
            return {
              ...item,
              position: index,
            };
          });
        }

        setList(updatedFavesList);
        setFilteredList(updatedFavesList);
        setAPIdataLoading(false);
        return brazilianBusinsessList;
      }, 2500);

      return () => clearTimeout(fetchData);
    }
  }, [isLoading, page, category, searchField]);

  const [open, setOpen] = React.useState(false);

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
      setFirstLoad(true);
      setFilteredList(listByCategory);
      return listByCategory;
    }
    setFirstLoad(false);
    listByCategory = await getBBs(isAdmin, page);
    setFilteredList(listByCategory);
  };

  const [favesSelected, setFavesSelected] = useState(false);
  const handleShowFavourites = async (selected) => {
    if (!isAuthenticated) {
      handleOpenConfirmation();
    } else {
      if (selected) {
        setFirstLoad(false);
      } else {
        setFirstLoad(true);
      }
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
    if (e !== "") {
      setFirstLoad(false);
    }
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

  return (
    <div className={classes.root}>
      <SearchAppBar
        onMenuClick={(e, index) => handleMenuItemClick(e, index)}
        onChange={(e) => handleSearchField(e)}
        handleClickOpen={handleClickOpen}
        favesSelected={favesSelected}
        handleShowFavourites={handleShowFavourites}
      />
      <Grid style={{ marginTop: 80 + "px" }} container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={spacing}>
        <ButtonGroup
              variant="contained"
              color="primary"
              ref={anchorRef}
              aria-label="split button"
            >
                <Button startIcon={<LocationOnIcon/>}>
                  <Link to={'map'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Search Near Me
                  </Link>
                </Button>
              <Button onClick={handleClickButtonGroup}>{options[selectedIndex]}</Button>
              <Button
                color="primary"
                size="small"
                aria-controls={openButton ? "split-button-menu" : undefined}
                aria-expanded={openButton ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggleButtonGroup}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={openButton}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleCloseButton}>
                      <MenuList id="split-button-menu">
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClickButtonGroup(event, index)
                            }
                          >
                        
                            {option === 'Food' && <FastfoodIcon color="primary"/>}
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
        </Grid>
      </Grid>
      </Grid>
      <Container maxWidth="md">
      <Grid
          container
          justifyContent="center"
        >
          <Grid item xs={12} >
            
          </Grid>
          {isAPIdataLoading &&
            dummyArray.map((skeleton, index) => (
              <Grid
                key={index}
                item
                xs={12}
                md={6}
                style={{ marginTop: 20 + "px" }}
              >
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" width={350} height={300} />
                </Stack>
              </Grid>
            ))}
          {!isAPIdataLoading &&
            filteredList.length > 0 &&
            filteredList.map((business, index) => (
              <MediaCard
                business={business}
                key={index}
                isAdmin={isAdmin}
                page={page}
                openConfirmation={handleOpenConfirmation}
              />
            ))}
          {!isAPIdataLoading && filteredList.length === 0 && (
            <h3>No results to show</h3>
          )}

          <Grid item xs={12}>
            <Grid
              container
              justifyContent="center"
              style={{ marginTop: 30 + "px" }}
            >
              <Typography>Page: {page}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="center"
              style={{ marginTop: 10 + "px" }}
            >
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChange}
              />
            </Grid>
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
      </Container>
      <footer className={classes.footer}>
        <Grid container justifyContent="center">
          <Typography variant="subtitle2">
            Created by Paula Barreto |{" "}
            <a
              style={{ color: "inherit", textDecoration: "none" }}
              target="_blank"
              href="https://www.paulabarreto.ca"
            >
              www.paulabarreto.ca
            </a>
          </Typography>
        </Grid>
      </footer>
    </div>
  );
}

export default App;
