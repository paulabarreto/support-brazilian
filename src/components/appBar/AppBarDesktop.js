import React from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CategoryIcon from "@material-ui/icons/Category";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import Container from "@material-ui/core/Container";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AuthNav from "../authentication/AuthNav";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(13),
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

export default function PrimarySearchAppBar({
  handleShowFavourites,
  favesSelected,
  defaultIndex,
  handleClickOpen,
  handleOpenContactDialog,
  onMenuClick,
  isSearchLocationOn,
  map,
  handleClickExpand,
  onChange,
  isAdmin,
  handleAdminRequest,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    defaultIndex ? defaultIndex : 0
  );
  const [isExpandSelected, setIsExpandSelected] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
  const [searchValue, setSearchValue] = React.useState("");

  const navigate = useNavigate();

  const handleCategoriesMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleHeartClick = () => {
    handleShowFavourites(!favesSelected);
    setAnchorEl(null);
    setSelectedIndex(4);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    onMenuClick(event, index);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setSearchValue(e.target.value);
  };

  const handleClickBack = () => {
    navigate("/");
    window.location.reload();
  };

  const handleClickExpandButton = () => {
    handleClickExpand(isExpandSelected);
    setIsExpandSelected(isExpandSelected ? false : true);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem
        selected={selectedIndex === 0}
        onClick={(event) => handleMenuItemClick(event, 0)}
      >
        <ListItemIcon>
          <AllInclusiveIcon color="primary" />
        </ListItemIcon>
        <Typography className={classes.heading}>All</Typography>
      </MenuItem>
      <MenuItem
        selected={selectedIndex === 1}
        onClick={(event) => handleMenuItemClick(event, 1)}
      >
        <ListItemIcon>
          <FastfoodIcon color="primary" />
        </ListItemIcon>
        <Typography className={classes.heading}>Food</Typography>
      </MenuItem>
      <MenuItem
        selected={selectedIndex === 2}
        onClick={(event) => handleMenuItemClick(event, 2)}
      >
        <ListItemIcon>
          <ShoppingBasketIcon color="primary" />
        </ListItemIcon>
        <Typography className={classes.heading}>Groceries</Typography>
      </MenuItem>
      <MenuItem
        selected={selectedIndex === 3}
        onClick={(event) => handleMenuItemClick(event, 3)}
      >
        <ListItemIcon>
          <WorkOutlineIcon color="primary" />
        </ListItemIcon>
        <Typography className={classes.heading}>Services</Typography>
      </MenuItem>
    </Menu>
  );
  
  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Grid item xs={11}>
            <Toolbar>
              {isSearchLocationOn || map ? (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  className={classes.menuButton}
                  onClick={handleClickBack}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              ) : (
                <div></div>
              )}
              <Link
                to={"/"}
                onClick={() => window.location.reload()}
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <Typography className={classes.title} variant="h6" noWrap>
                  Support Brazilian
                </Typography>
              </Link>
              {!map && (
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                    onChange={(e) => handleChange(e)}
                    value={searchValue}
                  />
                </div>
              )}
              <div className={classes.grow} />

              <div className={classes.sectionDesktop}>
                {map ? (
                  <IconButton
                    edge="start"
                    color={isExpandSelected ? "secondary" : "inherit"}
                    aria-label="open drawer"
                    className={classes.menuButton}
                    onClick={handleClickExpandButton}
                  >
                    <SettingsOverscanIcon />
                  </IconButton>
                ) : (
                  <div>
                    <Link
                      to={"map"}
                      style={{ color: "inherit", textDecoration: "inherit" }}
                    >
                      <IconButton aria-label="show near me" color="inherit">
                        <LocationOnIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      aria-label="show favourites"
                      color="inherit"
                      selected={selectedIndex === 4}
                      onClick={handleHeartClick}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="show categories"
                      color="inherit"
                      onClick={handleCategoriesMenuOpen}
                    >
                      <CategoryIcon />
                    </IconButton>
                    <IconButton
                      aria-label="add new business"
                      color="inherit"
                      onClick={() => handleClickOpen()}
                    >
                      <AddCircleIcon />
                    </IconButton>
                    <IconButton
                      aria-label="contact us"
                      color="inherit"
                      onClick={() => handleOpenContactDialog()}
                    >
                      <ContactMailIcon />
                    </IconButton>
                    {isAdmin && (
                    <IconButton
                      aria-label="contact us"
                      color="inherit"
                      onClick={() => handleAdminRequest()}
                    >
                      <LockIcon/>
                    </IconButton>
                  )}
                    <AuthNav />
                  </div>
                )}
              </div>
              {renderMenu}
            </Toolbar>
          </Grid>
        </Container>
      </AppBar>
    </div>
  );
}
