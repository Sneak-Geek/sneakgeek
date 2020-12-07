import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import CatalogIcon from '@material-ui/icons/ReceiptOutlined';
import { Sidebar, Topbar } from './Components';
import { makeStyles, Theme, createStyles, Container } from '@material-ui/core';
import { ProductScreen } from '../ProductScreen';
// import { SecuredScreen } from '../SecuredScreen';
import { CatalogScreen } from '../CatalogScreen';
import { WithdrawalScreen } from 'screens/WithdrawalScreen';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      paddingTop: 56,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

export const HomeScreen = (): JSX.Element => {
  const appPages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Sản phẩm',
      href: '/products',
      icon: <ListIcon />,
    },
    {
      title: 'Catalog',
      href: '/catalogs',
      icon: <CatalogIcon />,
    },
    {
      title: 'Withdrawals',
      href: '/withdrawals',
      icon: <MonetizationOnIcon />,
    },
  ];
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={classes.root}>
      <Topbar onMenuButtonClicked={() => setDrawerOpen(!drawerOpen)} />
      <Sidebar pages={appPages} isDrawerOpen={drawerOpen} />
      <Container>
        <Switch>
          <Route path={'/'} exact render={() => <Redirect to={'/dashboard'} />} />
          <Route path={'/dashboard'} render={() => <h3>Tổng quan</h3>} />
          <Route path={'/products'} component={ProductScreen} />
          <Route path={'/catalogs'} component={CatalogScreen} />
          <Route path="/withdrawals" component={WithdrawalScreen} />
        </Switch>
      </Container>
    </div>
  );
};
