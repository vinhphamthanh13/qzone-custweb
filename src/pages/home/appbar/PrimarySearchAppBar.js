import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HowToReg from '@material-ui/icons/HowToReg';
import { Book as BookIcon } from '@material-ui/icons';
import NearMe from '@material-ui/icons/NearMe';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import PersonAdd from '@material-ui/icons/PersonAdd';
import ExitToApp from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import IconMenu from 'components/IconMenu';
import logo from '../../../images/logo.png';
import { history } from '../../../containers/App';

const styles = (theme) => {
  console.log('theme', theme);
  return ({
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
    menuIcon: {
      color: theme.palette.primary.main,
      paddingRight: '10px',
    },
    menuListMobile: {
      color: theme.palette.primary.contrastText,
      display: 'flex',
      padding: `0 ${theme.spacing.unit + 2}px`,
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    menuListDesktop: {
      color: theme.palette.primary.contrastText,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
      },
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    avatar: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        background: theme.palette.common.white,
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing.unit * 2,
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit * 3,
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
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  });
};

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    serviceAnchorEl: null,
  };

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleServiceMenuOpen = (event) => {
    this.setState({ serviceAnchorEl: event.currentTarget });
  };

  handleServiceMenuClose = () => {
    this.setState({ serviceAnchorEl: null });
  };

  handleAuthenticateUser = (authenticateType) => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate(authenticateType);
    this.handleMenuClose();
  };

  handleLogout = () => {
    history.push('/access-deny');
    this.handleMenuClose();
  };

  handleChangeCategory = (event, categoryId) => {
    const { handleChangeCategory } = this.props;
    this.handleServiceMenuClose();
    handleChangeCategory(event, categoryId);
  };

  render() {
    const {
      anchorEl, mobileMoreAnchorEl, serviceAnchorEl,
    } = this.state;
    const {
      classes, loggedIn, onSearch, categories,
      activeCategoryId, userPosition,
    } = this.props;
    const searchNearByTitle = userPosition.latitude ? 'Search Services Near You' : 'Your Location Not Allowed';
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const menuCategory = categories.length ? categories.filter(
      category => !category.parentCategoryId,
    ) : [];
    const menuCategories = menuCategory.length ? menuCategory.map(
      category => (
        <MenuItem
          key={category.id}
          onClick={evt => this.handleChangeCategory(evt, category.id)}
          selected={activeCategoryId === category.id}
        >
          {category.name}
        </MenuItem>
      ),
    ) : null;
    const authorization = loggedIn ? (
      [
        <IconMenu
          key="app-bar-booking"
          iconSuite={{
            handleMethod: this.handleMenuClose,
            component: BookIcon,
            classes: classes.menuIcon,
          }}
        >
          Booking
        </IconMenu>,
        <IconMenu
          key="app-bar-profile"
          iconSuite={{
            handleMethod: this.handleMenuClose,
            component: AssignmentInd,
            classes: classes.menuIcon,
          }}
        >
          Profile
        </IconMenu>,
        <IconMenu
          key="app-bar-log-out"
          iconSuite={{
            handleMethod: this.handleLogout,
            component: ExitToApp,
            classes: classes.menuIcon,
          }}
        >
          Logout
        </IconMenu>,
      ]
    ) : (
      [
        <IconMenu
          key="app-log-in"
          iconSuite={{
            handleMethod: () => this.handleAuthenticateUser('isLoginOpen'),
            component: HowToReg,
            classes: classes.menuIcon,
          }}
        >
          Login
        </IconMenu>,
        <IconMenu
          key="app-register"
          iconSuite={{
            handleMethod: () => this.handleAuthenticateUser('isRegisterOpen'),
            component: PersonAdd,
            classes: classes.menuIcon,
          }}
        >
          Register
        </IconMenu>,
      ]
    );
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        { authorization }
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
    const customUser = loggedIn ? (
      <>
        <div className={classes.sectionDesktop}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={17} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
            <MoreIcon />
          </IconButton>
        </div>
      </>
    ) : (
      <>
        <div className={classes.sectionDesktop}>
          <IconButton
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
            <MoreIcon />
          </IconButton>
        </div>
      </>
    );
    return (
      <div className={classes.root}>
        <AppBar position="sticky">
          <Toolbar>
            <Avatar className={classes.avatar} alt="Quezone Logo" src={logo} />
            <div className={classes.menuListMobile}>
              <MenuIcon onClick={this.handleServiceMenuOpen} />
            </div>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Services, organisations …"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={onSearch}
              />
            </div>
            <Tooltip title={searchNearByTitle}>
              <div>
                <IconButton
                  className={classes.menuListDesktop}
                  disabled={!userPosition.latitude}
                >
                  <NearMe />
                </IconButton>
              </div>
            </Tooltip>
            <Button
              onClick={this.handleServiceMenuOpen}
              className={classes.menuListDesktop}
            >
              Services
            </Button>
            <Menu
              anchorEl={serviceAnchorEl}
              open={Boolean(serviceAnchorEl)}
              onClose={this.handleServiceMenuClose}
            >
              { menuCategories }
            </Menu>
            <div className={classes.grow} />
            { customUser }
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  loggedIn: PropTypes.bool.isRequired,
  handleAuthenticate: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChangeCategory: PropTypes.func.isRequired,
  activeCategoryId: PropTypes.string.isRequired,
  userPosition: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);
