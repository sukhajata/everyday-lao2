import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import 'typeface-roboto';
import logo from './img/icon-promo.jpg';
import './App.css';
import { dbSetup, getSubCategory, searchDb, getFavourites } from './services/dbAccess';
import SideNav from './components/SideNav';
import PhraseList from './components/PhraseList';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      categoriesOpen: [],
      phrases: [],
      favourites: [],
      sideOpen: false,
      playingId: 0,
      isLoading: false,
      error: null
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.search = this.search.bind(this);

    
    /*let output = "";
    for (let i = 1; i < 502; i++) {
      output += "import a" + i.toString() + " from './audio/" + i.toString() + ".mp3';\n";
    }
    console.log(output);*/
  }

  toggleDrawer = (open) => () => {
    this.setState({
      sideOpen: open,
    });
  };

  toggleExpand = (categoryId) =>  {
    var categoriesOpen = {...this.state.categoriesOpen};
    categoriesOpen[categoryId] = !categoriesOpen[categoryId];
    this.setState({ categoriesOpen });
  }

  selectSubcategory = async (subCatId) => {
    this.setState({ isLoading: true });

    const data = getSubCategory(subCatId);//await this.fetchJSON('https://sukhajata.com/el/lesson-api.php?lanId=3&id=' + subCatId)
    if (data != null) {
      this.setState({
        phrases: data,
        isLoading: false,
        sideOpen: false,
      });
    }
  }

  speak = (id) => {
    //const filePath = "https://sukhajata.com/audio/lao/" + fileName + ".mp3";
    const audio = document.getElementById("audio" + id);
    var playPromise = audio.play();
    this.setState({ playingId: id });

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
        this.setState({ playingId: 0 });
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        this.setState({ playingId: 0 });
        console.log(error);
      });
    }
    
  }

  handleKeyUp(event) {
    if (event.key === 'Enter') {
      this.search(event);
    }
  }

  async search(event) {
    this.setState({ isLoading: true });

    //const url = "https://sukhajata.com/el/search.php?lanId=3&search=" + encodeURIComponent(event.target.value);
    const json = searchDb(event.target.value);//await this.fetchJSON(url);
    if (json != null) {
      this.setState({
        phrases: json,
        isLoading: false
      });
    }
  }


  async fetchJSON(url) {
    try {
      const response  = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        return json;
      } else {
        throw Error(response.statusText);
      }
    } catch(error) {
      console.log(error);
      this.setState({ 
        error, 
        isLoading: false 
      });
      return null;
    }
  }

  showFavourites = () => {
    const favouritePhrases = getFavourites(this.state.favourites);
    this.setState({ 
      phrases: favouritePhrases,
      sideOpen: false 
    });
    
  }

  toggleFavourite = (id) => {
    var favourites = this.state.favourites;
    var index = favourites.indexOf(id);
    if (index !== -1) {
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    this.setState({ favourites });
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }

  isFavourite = (id) => {
    var index = this.state.favourites.indexOf(id);
    if (index !== -1) {
     return true;
    } 
    return false;
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    
    if (localStorage.getItem('favourites') !== null) {
      const favourites = JSON.parse(localStorage.getItem('favourites'));
      this.setState({ favourites});
    }

    let categories;
    if (localStorage.getItem('categories') !== null) {
      categories = JSON.parse(localStorage.getItem('categories'));
    } else {
      const url = 'https://sukhajata.com/el/catsub.php?lanId=3';
      categories = await this.fetchJSON(url);
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  
    if (categories != null) {
      const catExpanded = [];
      categories.forEach((category) => {
        catExpanded[category.id] = false
      });
      this.setState({
        categories,
        categoriesOpen: catExpanded,
        isLoading: false,
        sideOpen: true,
      });
      
      this.toggleDrawer(true);
    }

    await dbSetup();
      
  }

  render() {
    const { classes } = this.props;
    const { categories, categoriesOpen, phrases, playingId, error, isLoading } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
                <MenuIcon onClick={this.toggleDrawer(true)}/>
              </IconButton>
              <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                Everyday Lao
              </Typography>
              <div className={classes.grow} />
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  onKeyUp={this.handleKeyUp}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                />
              </div>
            </Toolbar>
          </AppBar>
          <SwipeableDrawer
              open={this.state.sideOpen}
              onClose={this.toggleDrawer(false)}
              onOpen={this.toggleDrawer(true)}
            > 
              <div
                tabIndex={0}
                role="button"
              >
                <Card>
                  <CardContent>
                    <Grid container>
                      <Grid item >
                        <img alt="logo" src={logo} height="30" />
                      </Grid>
                      <Grid item>
                        <Typography  component="h1" variant="h6" className={classes.header}>
                          Everyday Lao
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <SideNav 
                  styles={styles} 
                  toggleExpand={this.toggleExpand} 
                  categories={categories}
                  categoriesOpen={categoriesOpen}
                  selectSubcategory={this.selectSubcategory}
                  showFavourites={this.showFavourites}
                />
              </div>
            </SwipeableDrawer>
            <div className={classes.content}>
              <PhraseList 
                classes={classes} 
                phrases={phrases} 
                playingId={playingId}
                toggleFavourite={this.toggleFavourite}
                isFavourite={this.isFavourite}
                speak={this.speak}
              />
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#6746c3',
      main: '#311b92',
      dark: '#000063',
      contrastText: '#fff',
    },
    secondary: {
      light: '#d3d3d3',
      main: '#ce93d8',
      dark: '#9c64a6',
      contrastText: '#000',
    },
  },
});

const styles = {
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  content: {
    marginTop: 50,
  },
  pos: {
    marginBottom: 12,
  },
  full: {
    flex: 1,
  },
  upper: {
    background: theme.palette.secondary.dark,
    color: theme.palette.primary.contrastText,
  },
  second: {
    background: theme.palette.secondary.light,
  },
  white: {
    background: theme.palette.primary.contrastText,
  },
  header: {
    paddingTop: 0,
    paddingLeft: 8,
  },
  topMargin: {
    marginTop: 0,
  },
  notes: {
    background: theme.palette.secondary.light,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
};


App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
