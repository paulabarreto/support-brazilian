import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import * as urls from '../constants';
import * as endpoints from '../endpoints';
import LanguageIcon from '@mui/icons-material/Language';
import FaceIcon from '@mui/icons-material/Face';
import InstagramIcon from '@mui/icons-material/Instagram';
import ConfirmationDialog from './ConfirmationDialog';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import 'dotenv/config';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';


export default function AddBusinessDialog(props) {
  const open = props.open;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openConfirmation, setOpen] = React.useState(false);
  const [confirmationText, setConfirmationText] = React.useState('');
  const [confirmationTitle, setConfirmationTitle] = React.useState('');

  const handleOpenConfirmation = () => {
    setOpen(true);
  };

  const handleCloseConfirmation = () => {
    setOpen(false);
  };

  const [image, setImage] = useState(props.business ? props.business.image : '');
  const [name, setName] = useState(props.business ? props.business.name : '');
  const [description, setDescription] = useState(props.business ? props.business.description : '');
  const [location, setLocation] = useState(props.business ? props.business.location : null);
  const [website, setWebsite] = useState(props.business ? props.business.website : '');
  const [instagram, setInstagram] = useState(props.business ? props.business.instagram : '');
  const [category, setCategory] = useState(props.business ? props.business.category : 0);

  const clearFormData = () => {
    setImage('');
    setName('');
    setDescription('');
    setLocation('');
    setWebsite('');
    setInstagram('');
    setCategory('');
  }

  const GOOGLE_MAPS_API_KEY=process.env.REACT_APP_GOOGLE_API_KEY;


  let url;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = props.business ? `${urls.LOCAL_API_URL}/${endpoints.GetBusiness}`
        : `${urls.LOCAL_API_URL}/${endpoints.AddBusiness}`;
  } else {
    url = props.business ? `${urls.PRODUCTION_API_URL}/${endpoints.GetBusiness}`
    : `${urls.PRODUCTION_API_URL}/${endpoints.AddBusiness}`;
  }

  const onSubmit = () => {

    // event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location.label);
    formData.append('website', website);
    formData.append('instagram', instagram);
    formData.append('category', category);
    // formData.append('likes', props.business.likes ? props.business.likes : 0);
    formData.append('adminApproved', false);
    formData.append('createdBy', props.user.email);

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    };
    if(props.business) {
      geocodeByAddress(location.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => 
        Object.keys({ lat, lng }).forEach(key => formData.append(key, { lat, lng }[key])
      )
      .then( () =>
        axios.post(`${url}/${props.business._id}`, formData, config)
          .then((response) => {
            props.handleClose();
          }).catch((error) => {
            props.handleClose();
          })
        )
      )
    } else {
      geocodeByAddress(location.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        Object.keys({ lat, lng }).forEach(key => formData.append(key, { lat, lng }[key]))
      )
      .then(() => 
        axios.post(url, formData, config)
            .then((response) => {
                props.handleClose();
                setConfirmationText('Your Brazilian Business Addition request was sent to the Admin for approval.')
                setConfirmationTitle('Thanks!');
                handleOpenConfirmation();
                clearFormData();
            }).catch((error) => {
              setConfirmationText('Please try again soon.');
              setConfirmationTitle('Sorry, there was an error!');
              props.handleClose();
              handleOpenConfirmation();
        })
    )
      
    }
  }

  //TODO SKELETON LOADING
  if(!GOOGLE_MAPS_API_KEY) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a Brazilian Business</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To request a Brazilian business addition, please submit the info below.
            </DialogContentText>
            <Grid container justifyContent="center" spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="name">Name</InputLabel>
                      <Input
                        {...register('name', { required: true })}
                        error={errors.name ? true : false}
                        required={true}
                        onChange={e => setName(e.target.value)}
                        id="name"
                        value={name}
                        startAdornment={
                          <InputAdornment position="start">
                            <AccountCircle/>
                          </InputAdornment>
                        }
                      />
                      {errors.name && <p style={{marginTop:0, color:'red', fontSize: 'small'}}>Name is Required</p>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="description">Description</InputLabel>
                    <Input
                      {...register('description', { required: true })}
                      error={errors.description ? true : false}
                      onChange={e => setDescription(e.target.value)}
                      required={true}
                      id="description"
                      defaultValue={description}
                      startAdornment={
                        <InputAdornment position="start">
                          <DescriptionIcon/>
                        </InputAdornment>
                      }
                    />
                    {errors.description && <p style={{marginTop:0, color:'red', fontSize: 'small'}}>Description is Required</p>}

                </FormControl>
              </Grid>
              {!props.business &&
                <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="image">Image</InputLabel>
                    <Input
                      onChange={e => setImage(e.target.files[0])}
                      id="image"
                      name="image"
                      type="file"
                      startAdornment={
                        <InputAdornment position="start">
                          <FaceIcon />
                        </InputAdornment>
                      }
                    />
                </FormControl>
                </Grid>
              }
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
                      required
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <GooglePlacesAutocomplete
                    apiKey={GOOGLE_MAPS_API_KEY}
                    selectProps={{
                      location,
                      onChange: setLocation,
                      defaultInputValue: 'Location'
                    }}
                    id="location"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              Cancel
            </Button>
            <Button disabled={!name || !description || !image || !location || !category} onClick={handleSubmit(onSubmit)} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmationDialog 
          open={openConfirmation} 
          handleCloseConfirmation={handleCloseConfirmation}
          confirmation={confirmationText}
          title={confirmationTitle}
        />
    </form>
  );
}