import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import * as urls from "../constants";
import * as endpoints from "../endpoints";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LanguageIcon from "@material-ui/icons/Language";
import FaceIcon from "@material-ui/icons/Face";
import InstagramIcon from "@material-ui/icons/Instagram";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmationDialog from "./ConfirmationDialog";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DescriptionIcon from "@material-ui/icons/Description";
import axios from "axios";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

const libraries = ["places"];

export default function AddBusinessDialog(props) {
  const open = props.open;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openConfirmation, setOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isLocationEditionEnabled, setEnableLocationEdition] = React.useState(true);
  const [confirmationText, setConfirmationText] = React.useState("");
  const [confirmationTitle, setConfirmationTitle] = React.useState("");
  const [autoComplete, setAutoComplete] = React.useState(null);
  const [lat, setLat] = React.useState(props.business ? props.business.lat : 0);
  const [lng, setLng] = React.useState(props.business ? props.business.lng : 0);

  const handleOpenConfirmation = () => {
    setOpen(true);
  };

  const handleCloseConfirmation = () => {
    setOpen(false);
  };

  const [image, setImage] = useState(
    props.business ? props.business.image : ""
  );
  const [name, setName] = useState(props.business ? props.business.name : "");
  const [description, setDescription] = useState(
    props.business ? props.business.description : ""
  );
  const [location, setLocation] = useState(
    props.business ? props.business.location : ""
  );
  const [website, setWebsite] = useState(
    props.business ? props.business.website : ""
  );
  const [instagram, setInstagram] = useState(
    props.business ? props.business.instagram : ""
  );
  const [category, setCategory] = useState(
    props.business ? props.business.category : 0
  );

  const clearFormData = () => {
    setImage("");
    setName("");
    setDescription("");
    setLocation("");
    setWebsite("");
    setInstagram("");
    setCategory("");
  };

  let url;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    url = props.business
      ? `${urls.LOCAL_API_URL}/${endpoints.GetBusiness}`
      : `${urls.LOCAL_API_URL}/${endpoints.AddBusiness}`;
  } else {
    url = props.business
      ? `${urls.PRODUCTION_API_URL}/${endpoints.GetBusiness}`
      : `${urls.PRODUCTION_API_URL}/${endpoints.AddBusiness}`;
  }

  const onSubmit = () => {
    // event.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("lat", lat);
    formData.append("lng", lng);
    formData.append("website", website);
    formData.append("instagram", instagram);
    formData.append("category", category);
    // formData.append('likes', props.business.likes ? props.business.likes : 0);
    formData.append("adminApproved", false);
    formData.append("createdBy", props.user.email);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    if (props.business) {
      axios
        .post(`${url}/${props.business._id}`, formData, config)
        .then((response) => {
          props.handleClose();
        })
        .catch((error) => {
          props.handleClose();
        });
    } else {
      axios
        .post(url, formData, config)
        .then((response) => {
          props.handleClose();
          setConfirmationText(
            "Your Brazilian Business Addition request was sent to the Admin for approval."
          );
          setConfirmationTitle("Thanks!");
          handleOpenConfirmation();
          clearFormData();
        })
        .catch((error) => {
          setConfirmationText("Please try again soon.");
          setConfirmationTitle("Sorry, there was an error!");
          props.handleClose();
          handleOpenConfirmation();
        });
    }
  };

  const GOOGLE_MAPS_API = process.env.REACT_APP_GOOGLE_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API,
    libraries: libraries,
  });

  const onLoad = (autocomplete) => {
    setAutoComplete(autocomplete)
    // autocomplete.setFields(['address_component', 'geometry']);
  }

  const onPlacesChanged = () => {
    const place = autoComplete.getPlaces();
    const lat = place[0].geometry.location.lat();
    const lng = place[0].geometry.location.lng();
    const address = place[0].formatted_address;
    setLocation(address);
    setLat(lat);
    setLng(lng);
  };

  const enableEdition = () => {
    if(isLocationEditionEnabled) {
      setEnableLocationEdition(false)
    } else {
      setEnableLocationEdition(true)
    }
  }

  const requestDeletion = () => {
    setConfirmationText(
      `Request Admin to remove ${props.business.name}?`
    );
    setConfirmDelete(true)
    props.handleClose();
    handleOpenConfirmation();
  }

  useEffect(() => {
    // Taking into consideration that location is mandatory
    if (props.business) {
      setEnableLocationEdition(false)
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog
        open={open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Add a Brazilian Business
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To request a Brazilian business addition, please submit the info
            below.
          </DialogContentText>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <FormControl>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            {!props.business && (
              <Grid item xs={6}>
                <FormControl>
                  <InputLabel htmlFor="image">Image</InputLabel>
                  <Input
                    onChange={(e) => setImage(e.target.files[0])}
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
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="description">Description</InputLabel>
                <Input
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  defaultValue={description}
                  startAdornment={
                    <InputAdornment position="start">
                      <DescriptionIcon />
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
                  type="url"
                  defaultValue={website}
                  onChange={(e) => setWebsite(e.target.value)}
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
                  onChange={(e) => setInstagram(e.target.value)}
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
                <InputLabel htmlFor="grouped-native-select">
                  Category
                </InputLabel>

                <Select
                  fullWidth
                  native
                  defaultValue={category}
                  id="grouped-native-select"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option aria-label="None" value="" />
                  <option value={1}>Food</option>
                  <option value={2}>Groceries</option>
                  <option value={3}>Services</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={11} style={{ display: !isLocationEditionEnabled ? 'block' : 'none' }}>
            <FormControl fullWidth>
                <InputLabel htmlFor="location">Location</InputLabel>
                <Input
                  id="location"
                  value={location}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            {!props.business &&
              <Grid item xs={1} style={{alignSelf: "end"}} >
                <LocationOnIcon />
              </Grid>
            }
            <Grid item xs={11} style={{ display: isLocationEditionEnabled ? 'block' : 'none' }}>
              <StandaloneSearchBox
                onLoad={onLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Location"
                  style={{
                    paddingRight: "24px",
                    cursor: "pointer",
                    minWidth: "16px",
                    userSelect: "none",
                    borderRadius: 0,
                    MozAppearance: "none",
                    WebkitAppearance: "none",
                    font: "inherit",
                    color: "currentColor",
                    width: "100%",
                    border: 0,
                    height: "1.1876em",
                    marginLeft: 0,
                    marginTop: 15,
                    display: "block",
                    padding: "6px 0 7px",
                    minWidth: 0,
                    background: "none",
                    boxSizing: "content-box",
                    animationName: "mui-auto-fill-cancel",
                    letterSpacing: "inherit",
                    animationSuration: "10ms",
                  }}
                />
              </StandaloneSearchBox>
            </Grid>
            {props.business &&
              <Grid item xs={1}>
                <Button 
                  style={{marginTop: '13px'}}
                  onClick={ () => enableEdition() }>
                  {isLocationEditionEnabled ?
                    <ClearIcon color="primary" />
                    :
                    <EditIcon color="primary" />
                  }
                </Button>
              </Grid>
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          {props.business && 
              <Button 
                color="secondary"
                style={{position: 'absolute', left: '18px'}}
                onClick={requestDeletion}
              >
                Remove
              </Button>
          }
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={!name || !description || !image || !location || !category}
            onClick={handleSubmit(onSubmit)}
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={openConfirmation}
        confirmation={confirmationText}
        handleCloseConfirmation={handleCloseConfirmation}
        title={confirmationTitle}
        confirmDelete={confirmDelete}
      />
    </form>
  );
}