import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import Grid from '@mui/material/Grid';

import AddBusinessDialog from './AddBusinessDialog';
import { useAuth0 } from "@auth0/auth0-react";
import * as urls from '../constants';
import * as endpoints from '../endpoints';
import axios from 'axios';

export default function MediaCard(props) {

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

  const { user, isLoading } = useAuth0();

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
    axios.put(`${url}/${props.business._id}`, {like: favourite})
      .then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
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
    <Grid item xs={12} md={6}>    
        <Card sx={{ margin: '20px' }}>
            <CardHeader
            action={
              <IconButton onClick={() => handleFavourites(!favourite)} aria-label="settings">
                <FavoriteIcon color={favourite ? 'primary' : 'inherit'}/>
              </IconButton>
            }
          />
            
              <CardMedia
                  sx={{ objectFit: 'contain' }}
                  image={business.image ? business.image : null}
                  title={business.name}
                  height="194"
                  component="img"
                  alt="Business Logo"
              />
              <CardContent sx={{height: '100px'}}>
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
