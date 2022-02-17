import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import * as urls from '../constants';
import * as endpoints from '../endpoints';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';
import FaceIcon from '@material-ui/icons/Face';
import InstagramIcon from '@material-ui/icons/Instagram';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmationDialog from './ConfirmationDialog';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import axios from 'axios';

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
  const [location, setLocation] = useState(props.business ? props.business.location : '');
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
    formData.append('location', location);
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
      axios.post(`${url}/${props.business._id}`, formData, config)
        .then((response) => {
          props.handleClose();
        }).catch((error) => {
          props.handleClose();
      });
    } else {
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
      });
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a Brazilian Business</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To request a Brazilian business addition, please submit the info below.
            </DialogContentText>
            <Grid container justifyContent="center">
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="location">Location</InputLabel>
                    <Input
                      required={true}
                      onChange={e => setLocation(e.target.value)}
                      id="location"
                      defaultValue={location}
                      startAdornment={
                        <InputAdornment position="start">
                          <LocationOnIcon/>
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
              {!props.business &&
                <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="image">Image</InputLabel>
                    <Input
                      {...register('image', { required: true })}
                      error={errors.image}
                      required={true}
                      onChange={e => setImage(e.target.files[0])}
                      id="image"
                      name="image"
                      type='file'
                      startAdornment={
                        <InputAdornment position="start">
                          <FaceIcon />
                        </InputAdornment>
                      }
                    />
                    {errors.image && <p style={{marginTop:0, color:'red', fontSize: 'small'}}>Image is Required</p>}

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