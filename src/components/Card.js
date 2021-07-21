import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LanguageIcon from '@material-ui/icons/Language';
import InstagramIcon from '@material-ui/icons/Instagram';
import EditIcon from '@material-ui/icons/Edit';
import AddBusinessDialog from './AddBusinessDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import { useAuth0 } from "@auth0/auth0-react";
import * as urls from '../constants';
import * as endpoints from '../endpoints';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    // width: 345,
    marginTop: '20px',
  },
  gridRoot: {
    flexGrow: 1,
  },
  media: {
    height: 140,
    backgroundSize: 'contain'
  },
});

export default function MediaCard(props) {

  const classes = useStyles();
  const business = props.business;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let url;
  let usersUrl;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = `${urls.LOCAL_API_URL}/${endpoints.GetBusiness}`;
    usersUrl = `${urls.LOCAL_API_URL}/${endpoints.GetUsers}`;    
  } else {
    url = `${urls.PRODUCTION_API_URL}/${endpoints.GetBusiness}`;
    usersUrl = `${urls.PRODUCTION_API_URL}/${endpoints.GetUsers}`;    
  }

  const handleDeleteBusiness = () => {
    axios.delete(`${url}/${props.business._id}`)
        .then((response) => {
          console.log(response)
          props.getBrazilianBusiness();
        }).catch((error) => {
          console.log(error)
          // props.handleClose();
    });
  }

  // Favourites Feature Section

  const { user, isAuthenticated, isLoading } = useAuth0();

  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    setFavourite(business.favourite)
  }, [business.favourite]);

  const handleFavourites = (favourite) => {
    if(!user && !isLoading) {
      props.openConfirmation();
      return
    }
    setFavourite(favourite)
    if (favourite && user) {
      const body = {
        name: user.name,
        email: user.email,
        favourite: props.business._id
      }
      axios.post(`${usersUrl}/${user.email}`, body)
          .then((response) => {
            console.log(response)
          }).catch((error) => {
            console.log(error)
      });
    } else {
      axios.put(`${usersUrl}/${user.email}`, {unfavourite_id: props.business._id})
    }
  }

  const handleApproveBusiness = () => {
    axios.post(`${url}/${props.business._id}`, {adminApproved: true})
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);

    });
  }


  return (
    <Grid item xs={12}>
        <Card className={classes.root}>
          <CardHeader
            action={
              <IconButton onClick={() => handleFavourites(!favourite)} aria-label="settings">
                <FavoriteIcon color={favourite ? 'primary' : 'inherit'}/>
              </IconButton>
            }
          />
            <CardActionArea>
            <CardMedia
                className={classes.media}
                image={business.image ? business.image : null}
                title={business.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                {business.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                {business.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {business.location}
                </Typography>
            </CardContent>
            </CardActionArea>
            <CardActions>
            {business.website &&
              <a target="_blank" rel="noreferrer" href={business.website}>
                <Button size="small" color="primary">
                    <LanguageIcon/>
                </Button>
              </a>
            }
            {business.instagram && 
              <a target="_blank" rel="noreferrer" href={business.instagram}>
                <Button size="small" color="primary">
                    <InstagramIcon/>
                </Button>
              </a>
            }
            {props.isAdmin && 
              <div>
                <Button size="small" color="primary" onClick={handleClickOpen}>
                  <EditIcon/>
                </Button>
                <Button size="small" color="primary">
                  <DeleteIcon onClick={handleDeleteBusiness}/>
                </Button>
                {!business.adminApproved && 
                  <Button size="small" color="primary" onClick={handleApproveBusiness}>
                    <CheckIcon />
                  </Button>
                }
              </div>
            }
            <AddBusinessDialog 
              open={open}
              handleClose={handleClose}
              business={business}
              user={user}
            />
          </CardActions>
        </Card>
    </Grid>
  );
}
