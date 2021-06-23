import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginTop: '30px',
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
  return (
    <div className={classes.gridRoot}>
        <Grid container spacing={3}>
            <Grid item xs={6} >

                <Card className={classes.root}>
                    <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={business.image}
                        title={business.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        {business.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {business.text}
                        </Typography>
                    </CardContent>
                    </CardActionArea>
                    <CardActions>
                    <Button size="small" color="primary">
                        Share
                    </Button>
                    <Button size="small" color="primary">
                        Learn More
                    </Button>
                    </CardActions>
                </Card>
                </Grid>
            </Grid>
        </div>
  );
}
