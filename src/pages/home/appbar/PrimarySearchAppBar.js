import React from 'react';
import {
  objectOf, any, string, func, arrayOf, object, number,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, IconButton, InputBase, Badge, MenuItem, Menu, Button, Avatar, Tooltip,
} from '@material-ui/core';
import {
  Menu as MenuIcon, Search as SearchIcon, AccountCircle, InsertEmoticon, HowToReg, Book as BookIcon,
  NearMe, AssignmentInd, PersonAdd, ExitToApp, Mail as MailIcon, Notifications as NotificationsIcon,
  MoreVert as MoreIcon, Details,
} from '@material-ui/icons';
import { logout } from 'auth/actions/login';
import IconMenu from 'components/IconMenu';
import logo from '../../../images/quezone-logo.png';
import styles from './PrimarySearchAppBarStyle';

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    serviceAnchorEl: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.closeAllMenu);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.closeAllMenu);
  }

  closeAllMenu = () => {
    this.handleMenuClose();
    this.handleMobileMenuClose();
    this.handleServiceMenuClose();
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
    const { logoutAction } = this.props;
    logoutAction();
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
      classes, loginSession, onSearch, categories,
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
          <Details className={classes.menuIcon} /> {category.name}
        </MenuItem>
      ),
    ) : null;
    const isAuthenticated = loginSession ? loginSession.isAuthenticated : false;
    const authorization = isAuthenticated ? (
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
        { isAuthenticated
          && (
            [
              <MenuItem key="app-bar-mail-icon-notification">
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <p>Messages</p>
              </MenuItem>,
              <MenuItem key="app-bar-notification-icon">
                <IconButton color="inherit">
                  <Badge badgeContent={11} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <p>Notifications</p>
              </MenuItem>,
            ]
          )
        }
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            { isAuthenticated ? <InsertEmoticon /> : <AccountCircle /> }
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
    const customUser = isAuthenticated ? (
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
            <InsertEmoticon />
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
        <AppBar position="fixed">
          <Toolbar className={`${classes.mainLinear}`}>
            <Avatar
              className={classes.avatar}
              imgProps={{
                className: classes.img,
              }}
              alt="Quezone Logo"
              src={logo}
            />
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
  classes: objectOf(any).isRequired,
  handleAuthenticate: func.isRequired,
  onSearch: func.isRequired,
  categories: arrayOf(object).isRequired,
  handleChangeCategory: func.isRequired,
  activeCategoryId: string.isRequired,
  userPosition: objectOf(number).isRequired,
  logoutAction: func.isRequired,
  loginSession: objectOf(any).isRequired,
};

const mapStateToProps = state => ({
  loginSession: state.auth.loginSession,
});

export default compose(
  connect(mapStateToProps, {
    logoutAction: logout,
  }),
  withStyles(styles),
)(PrimarySearchAppBar);
