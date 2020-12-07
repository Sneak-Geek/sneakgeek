import React from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Typography,
  makeStyles,
  ListItemText,
  DialogContent,
  DialogProps,
} from '@material-ui/core';
import { Shoe } from 'business';

type Props = {
  shoe?: Shoe;
  onCloseProductDetail: () => void;
  isDialogOpen: boolean;
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
}));

const ProductDetailDialog = (props: Props): JSX.Element => {
  const classes = useStyles();
  const [scroll] = React.useState<DialogProps['scroll']>('paper');

  const fieldMappings: { [key: string]: string | undefined } = {
    Tên: props.shoe?.title,
    'Mã sản phẩm': props.shoe?._id,
    Hãng: props.shoe?.brand,
    'Miêu tả': props.shoe?.description,
    Màu: props.shoe?.colorway?.join(' '),
    'Phân loại': props.shoe?.category,
    'Giá gốc': props.shoe?.retailPrice?.toString(),
  };

  return (
    <Dialog scroll={scroll} onClose={props.onCloseProductDetail} open={props.isDialogOpen}>
      <DialogTitle>Thông tin giày</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <img src={props.shoe?.imageUrl} className={classes.image} />
        <List>
          {Object.keys(fieldMappings).map((k) => (
            <ListItem key={k} divider={true} className={classes.container}>
              <ListItemText primary={k} />
              <Typography variant={'subtitle1'}>{fieldMappings[k] || '-'}</Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
