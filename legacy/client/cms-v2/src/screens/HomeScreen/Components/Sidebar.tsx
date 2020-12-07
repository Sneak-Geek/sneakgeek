import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import {
  List,
  ListItem,
  colors,
  Theme,
  Drawer,
  Button,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import { NavLink as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: colors.blueGrey[800],
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
}));

type Props = {
  pages: Array<{ title: string; icon: any; href: string }>;
  isDrawerOpen: boolean;
};

export const Sidebar = (props: Props) => {
  const { pages } = props;
  const classes = useStyles();

  return (
    <Drawer
      variant={'permanent'}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.isDrawerOpen,
        [classes.drawerClose]: !props.isDrawerOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.isDrawerOpen,
          [classes.drawerClose]: !props.isDrawerOpen,
        }),
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {pages.map((page, i) => (
          <ListItem key={i}>
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={RouterLink}
              to={page.href}
            >
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.title} />
            </Button>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
