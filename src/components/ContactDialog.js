import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog";
import urlService from "../services/urls";
import * as endpoints from "../endpoints";

export default function FormDialog(props) {

  const [name, setName] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [text, setText] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [openConfirmation, setOpen] = React.useState(false);
  const [confirmationText, setConfirmationText] = React.useState("");
  const [confirmationTitle, setConfirmationTitle] = React.useState("");
  
  const handleOpenConfirmation = (success) => {
    setOpen(true)
    setConfirmationTitle(success ? 'Message sent' : 'There was an error')
    setConfirmationText(success ? 'Thank you for your message' : 'Message not delivered, please try again soon')
  }

  const handleCloseConfirmation = () => {
    setOpen(false)
  }
  const onSubmit = () => {
    const url = urlService(endpoints.SendEmail);
    props.handleClose();
    const message = `From: ${name}
    Email: ${email}
    Phone: ${phone} 
    Message: ${text}`
    
    const data = {
      message,
      subject
    }

    axios
        .post(url, data)
        .then((response) => {
          handleOpenConfirmation(true);
        })
        .catch((error) => {
          props.handleClose();
          handleOpenConfirmation(false);

        });
  }

  return (
    <form onSubmit={() => onSubmit()}>
      <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Contact Us
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please use the form below to contact us
          </DialogContentText>
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              id="phone"
              label="Phone number"
              type="tel"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <TextField
            multiline
            autoFocus
            fullWidth
            margin="dense"
            id="Subject"
            label="Subject"
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            multiline
            autoFocus
            fullWidth
            margin="dense"
            id="text"
            label="Your message"
            rows={4}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => onSubmit()} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={openConfirmation}
        confirmation={confirmationText}
        handleCloseConfirmation={handleCloseConfirmation}
        title={confirmationTitle}
      />
    </form>
  );
}
