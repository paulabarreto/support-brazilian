import React from 'react';
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

import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';
import InstagramIcon from '@material-ui/icons/Instagram';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  margin: theme.spacing(1),
}));

export default function AddBusinessDialog(props) {
  const open = props.open;
  const classes = useStyles();

  return (
    <div>
      <Dialog open={open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a Brazilian Business</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To request a Brazilian business addition, please submit the info below.
            </DialogContentText>
            <Grid container justify="center">
              <Grid item xs={12}>
                <FormControl className={classes.margin}>
                  <InputLabel htmlFor="name">Name</InputLabel>
                    <Input
                      id="name"
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <FormControl className={classes.margin}>
                <InputLabel htmlFor="image">Image</InputLabel>
                  <Input
                    id="image"
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
                <FormControl className={classes.margin}>
                  <InputLabel htmlFor="website">Website</InputLabel>
                    <Input
                      id="website"
                      startAdornment={
                        <InputAdornment position="start">
                          <LanguageIcon />
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.margin}>
                  <InputLabel htmlFor="Instagram">Instagram</InputLabel>
                    <Input
                      id="Instagram"
                      startAdornment={
                        <InputAdornment position="start">
                          <InstagramIcon />
                        </InputAdornment>
                      }
                    />
                </FormControl>
              </Grid>
            </Grid>  
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={props.handleClose} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}