import './App.css';
import '@fontsource/roboto';
import SearchAppBar from './components/AppBar';
import MediaCard from './components/Card';
import brazilianBusiness from './db/brazilianBusiness'
import CenteredGrid from './components/test'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
    // marginRight: 20,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SearchAppBar/>
      <Container maxWidth="md">
        <Grid container justify="center">
          {
            brazilianBusiness.map((business, index) => (
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
