import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton, Theme, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
  image: {
    width: 50,
    height: 50,
  },
}));

type Props = {
  onMenuButtonClicked: () => void;
  className?: string;
};

export const Topbar = (props: Props) => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.onMenuButtonClicked}
        >
          <MenuIcon />
        </IconButton>
        <RouterLink to="/">
          <img className={classes.image} alt={'Logo'} src={'/logo.png'} />
        </RouterLink>
        <Typography variant="h4" noWrap color={'textSecondary'}>
          Trang quản lý SneakGeek
        </Typography>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton className={classes.signOutButton} color={'inherit'}>
            <InputIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
