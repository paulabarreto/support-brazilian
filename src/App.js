import './App.css';
import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
import brazilianBusiness from './db/brazilianBusiness'
import CenteredGrid from './components/test'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import React, { useState, useEffect } from 'react';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
    // marginRight: 20,
  },
}));

function App() {
  const [list, setList] = useState(brazilianBusiness);
  const classes = useStyles();

  const updateInput = async (input) => {
    const filtered = brazilianBusiness.filter(business => {
     return business.title.toLowerCase().includes(input.toLowerCase())
    })
    setList(filtered);
 }

  return (
    <div className={classes.root}>
      <SearchAppBar onChange={(e) => updateInput(e.target.value)}/>
      <Container maxWidth="md">
        <Grid container justify="center">
          {
            list.map((business, index) => (
              <MediaCard
                business={business}
                key={index}
              />
            ))
          }
        </Grid>
      </Container>
    </div>
  );
}

export default App;
