import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';

import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';
import InstagramIcon from '@material-ui/icons/Instagram';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmationDialog from './ConfirmationDialog';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  margin: theme.spacing(1),
}));

export default function AddBusinessDialog(props) {
  const open = props.open;
  const classes = useStyles();

  const [openConfirmation, setOpen] = React.useState(false);

  const handleOpenConfirmation = () => {
    setOpen(true);
  };

  const handleCloseConfirmation = () => {
    setOpen(false);
  };

  const [image, setImage] = useState(props.business ? props.business.image : '');
  const [name, setName] = useState(props.business ? props.business.name : '');
  const [website, setWebsite] = useState(props.business ? props.business.website : '');
  const [instagram, setInstagram] = useState(props.business ? props.business.instagram : '');
  const [category, setCategory] = useState(props.business ? props.business.category : 0);

  const url = props.business ? 'http://localhost:8080/api/brazilianBusiness' : 'http://localhost:8080/api/newBusiness';

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('website', website);
    formData.append('instagram', instagram);
    formData.append('category', category);
    formData.append('adminApproved', true);

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    };
    
    if(props.business) {
      axios.post(`${url}/${props.business._id}`,formData,config)
        .then((response) => {
          props.handleClose();
        }).catch((error) => {
          props.handleClose();
      });
    } else {
      axios.post(url,formData,config)
          .then((response) => {
              props.handleClose();
              handleOpenConfirmation();
          }).catch((error) => {
            props.handleClose();
      });
    }
  }


  return (
    <form onSubmit={e => {handleSubmit(e)}}>
      <Dialog open={open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a Brazilian Business</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To request a Brazilian business addition, please submit the info below.
            </DialogContentText>
            <Grid container justify="center">
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="name">Name</InputLabel>
                    <Input
                      onChange={e => setName(e.target.value)}
                      id="name"
                      defaultValue={name}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountCircle/>
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="image">Image</InputLabel>
                  <Input
                    onChange={e => setImage(e.target.files[0])}
                    id="image"
                    name="image"
                    type='file'
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                  />
              </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="website">Website</InputLabel>
                    <Input
                      id="website"
                      defaultValue={website}
                      onChange={e => setWebsite(e.target.value)}
                      fullWidth
                      startAdornment={
                        <InputAdornment position="start">
                          <LanguageIcon />
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="Instagram">Instagram</InputLabel>
                    <Input
                      id="Instagram"
                      defaultValue={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      fullWidth
                      startAdornment={
                        <InputAdornment position="start">
                          <InstagramIcon />
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                      
                  <Select fullWidth native defaultValue={category} id="grouped-native-select" onChange={e => setCategory(e.target.value)}>
                    <option aria-label="None" value="" />
                    <option value={1}>Food</option>
                    <option value={2}>Groceries</option>
                    <option value={3}>Services</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmationDialog open={openConfirmation} handleCloseConfirmation={handleCloseConfirmation}/>
    </form>
  );
}