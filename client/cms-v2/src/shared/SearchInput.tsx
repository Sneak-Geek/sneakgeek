import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Input, Theme } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420,
    maxWidth: '50%',
    marginTop: 25,
    marginBottom: 25,
    marginLeft: 20,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px',
  },
}));

type Props = {
  className?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  style?: React.CSSProperties;
};

export const SearchInput = (props: Props) => {
  const { className, onChange, style, ...rest } = props;

  const classes = useStyles();

  return (
    <Paper {...rest} className={clsx(classes.root, className)} style={style}>
      <SearchIcon className={classes.icon} />
      <Input
        {...rest}
        className={classes.input}
        disableUnderline
        onChange={onChange}
        placeholder={'Tìm kiếm'}
      />
    </Paper>
  );
};
