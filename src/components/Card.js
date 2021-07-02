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
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    width: 345,
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
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();
  const business = props.business;

  const [open, setOpen] = React.useState(false);
  const [count, setCount] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const url = 'http://localhost:8080/api/brazilianBusiness';

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

  function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
  }

  return (
    <Grid item sm={6} xs={12}>
        <Card className={classes.root}>
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
                {business.text}
                </Typography>
            </CardContent>
            </CardActionArea>
            <CardActions>
            {business.website ?
              <a target="_blank" rel="noreferrer" href={business.website}>
                <Button size="small" color="primary">
                    <LanguageIcon/>
                </Button>
              </a> : ''
            }
            <a target="_blank" rel="noreferrer" href={business.instagram}>
              <Button size="small" color="primary">
                  <InstagramIcon/>
              </Button>
            </a>
            <Button size="small" color="primary" onClick={handleClickOpen}>
              <EditIcon/>
            </Button>
            <Button size="small" color="primary">
              <DeleteIcon onClick={handleDeleteBusiness}/>
            </Button>
            <AddBusinessDialog 
              open={open}
              handleClose={handleClose}
              business={business}
            />
          </CardActions>
        </Card>
    </Grid>
  );
}
