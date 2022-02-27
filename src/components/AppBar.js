import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import { styled, alpha } from "@mui/material/styles";

import Menu from '@mui/material/Menu';
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";

import AuthNav from "./authentication/AuthNav";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchAppBar({
  handleShowFavourites,
  favesSelected,
  handleClickOpen,
  onMenuClick,
  onChange,
}) {

  //Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");

  const handleMenuItemClick = (event, index) => {
    setSearchValue("");
    onChange("");
    setSelectedIndex(index);
    setAnchorEl(null);
    onMenuClick(event, index);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setSearchValue(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            id="basic-button"
          >
            <MenuIcon aria-controls="simple-menu" aria-haspopup="true" />
          </IconButton>

          <Paper sx={{ width: 320, maxWidth: "100%" }}>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="categories-content"
                  id="categories-header"
                >
                  <AccountTreeIcon color="primary" />
                  <Typography>
                    Categories
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: "block" }}>
                  <MenuItem
                    selected={selectedIndex === 0}
                    onClick={(event) => handleMenuItemClick(event, 0)}
                  >
                    <AllInclusiveIcon color="primary" />
                    <Typography>All</Typography>
                  </MenuItem>
                  <MenuItem
                    selected={selectedIndex === 1}
                    onClick={(event) => handleMenuItemClick(event, 1)}
                  >
                    <FastfoodIcon color="primary" />
                    <Typography>Food</Typography>
                  </MenuItem>
                  <MenuItem
                    selected={selectedIndex === 2}
                    onClick={(event) => handleMenuItemClick(event, 2)}
                  >
                    <ShoppingBasketIcon color="primary" />
                    <Typography>
                      Groceries
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    selected={selectedIndex === 3}
                    onClick={(event) => handleMenuItemClick(event, 3)}
                  >
                    <WorkOutlineIcon color="primary" />
                    <Typography>
                      Services
                    </Typography>
                  </MenuItem>
                </AccordionDetails>
              </Accordion>
              <MenuItem onClick={() => handleShowFavourites(!favesSelected)}>
                <FavoriteIcon color="primary" />
                <Typography >Favourites</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleClickOpen()}>
                <AddCircleIcon color="primary" />
                <Typography >
                  Add New Business
                </Typography>
              </MenuItem>
            </Menu>
          </Paper>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Support Brazilian
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchValue}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => handleChange(e)}
            />
          </Search>
          <AuthNav />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
