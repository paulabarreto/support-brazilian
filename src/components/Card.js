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
import LanguageIcon from '@material-ui/icons/Language';
import InstagramIcon from '@material-ui/icons/Instagram';

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
  console.log("🚀 ~ file: Card.js ~ line 32 ~ MediaCard ~ business", business)
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
            </CardActions>
        </Card>
    </Grid>
  );
}
