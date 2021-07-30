import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AuthNav from "./authentication/AuthNav";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingLeft: '5px'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContentContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar({handleShowFavourites, favesSelected, handleClickOpen, onMenuClick, onChange}) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSearchValue('')
    onChange('')
    setSelectedIndex(index);
    setAnchorEl(null);
    onMenuClick(event, index)
  };

  const handleChange = (e) => {
    onChange(e.target.value)
    setSearchValue(e.target.value)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon 
              aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickListItem}
            />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="categories-content"
                  id="categories-header"
                >
                  <AccountTreeIcon color="primary"/>
                  <Typography className={classes.heading}>Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                      <MenuItem
                        selected={selectedIndex === 0}
                        onClick={(event) => handleMenuItemClick(event, 0)}
                      >
                        <AllInclusiveIcon color="primary"/>
                        <Typography className={classes.heading}>
                          All
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        selected={selectedIndex === 1}
                        onClick={(event) => handleMenuItemClick(event, 1)}
                      >
                        <FastfoodIcon color="primary"/>
                        <Typography className={classes.heading}>
                          Food
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        selected={selectedIndex === 2}
                        onClick={(event) => handleMenuItemClick(event, 2)}
                      >
                        <ShoppingBasketIcon color="primary"/>
                        <Typography className={classes.heading}>
                          Groceries
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        selected={selectedIndex === 3}
                        onClick={(event) => handleMenuItemClick(event, 3)}
                      >
                        <WorkOutlineIcon color="primary"/>
                        <Typography className={classes.heading}>
                          Services
                        </Typography>
                      </MenuItem>
                    </Typography>
                </AccordionDetails>
              </Accordion>
              <MenuItem onClick={() => handleShowFavourites(!favesSelected)}>
                <FavoriteIcon color="primary"/>
                <Typography className={classes.heading}>
                  Favourites
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => handleClickOpen()}>
                <AddCircleIcon color="primary"/>
                <Typography className={classes.heading}>
                  Add New Business
                </Typography>
              </MenuItem>
            </Menu>
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Support Brazilian
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              value={searchValue}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <AuthNav/>
        </Toolbar>
      </AppBar>
    </div>
  );
}
