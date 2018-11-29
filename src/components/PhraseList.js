import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import favourite from '../img/ic_favourite.png';
import favouriteActive from '../img/ic_favourite_active.png';
import play from '../img/ic_play1.png';
import playing from '../img/ic_playing.png';


export default function PhraseList({ classes, phrases, playingId, toggleFavourite, isFavourite, speak }) {
    return (
        <div className={classes.list}>
          <List className={classes.second} dense>
            {phrases.map(phrase => (
              <ListItem className={classes.white} button key={phrase.pid}>
                <audio id={'audio' + phrase.pid} src={process.env.PUBLIC_URL + '/audio/' + phrase.fileName + '.mp3'} preload="true"/>
                <Card className={classes.full}>
                  <CardContent>
                      <Typography component="p" >
                        {phrase.firstLanguage}
                      </Typography>
                      <Typography color="textSecondary">
                        {phrase.secondLanguage}
                      </Typography>
                      <Typography >
                        {phrase.romanisation}
                      </Typography>
                      {phrase.literalTranslation && 
                        <Typography color="textSecondary">
                          {phrase.literalTranslation}
                        </Typography>
                      }
                      {phrase.notes && 
                        <Typography className={classes.notes}>
                          {phrase.notes}
                        </Typography>
                      }
                      <Grid container  spacing={16} className={classes.topMargin}>
                        <Grid item onClick={() => speak(phrase.pid)}>
                          <img alt="play audio" src={phrase.pid === playingId ? playing : play} height="28"/>
                        </Grid>
                        <Grid item>
                          <img src={isFavourite(phrase.pid) ? favouriteActive : favourite} height="28" alt="toggle favourite" onClick={() => toggleFavourite(phrase.pid)}/>
                        </Grid>
                      </Grid>
                </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </div>
    )
}