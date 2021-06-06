import React, { useState } from 'react';
import { Catalog } from 'business';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogProps,
  makeStyles,
  Avatar,
  Collapse,
  ListItemAvatar,
} from '@material-ui/core';
import theme from 'theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    minWidth: '20vw',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
}));

const CatalogDetailDialog = (props: {
  catalog?: Catalog;
  isVisible: boolean;
  onClose: () => void;
}): JSX.Element => {
  const classes = useStyles();
  const [scroll] = useState<DialogProps['scroll']>('paper');
  const [nestedOpen, setNestedOpen] = useState(false);

  const fieldMappings: { [key: string]: string | undefined } = {
    Tên: props.catalog?.title,
    'Miêu tả': props.catalog?.description,
  };

  return (
    <Dialog scroll={scroll} onClose={props.onClose} open={props.isVisible}>
      <DialogTitle>Thông tin catalog</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        {props.catalog?.coverImage && (
          <img src={props.catalog?.coverImage} className={classes.image} />
        )}
        <List>
          {Object.keys(fieldMappings).map((k) => (
            <ListItem key={k} divider={true}>
              <ListItemText
                primary={k}
                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                secondary={fieldMappings[k] || '-'}
                secondaryTypographyProps={{ style: { color: theme.palette.text.primary } }}
              />
            </ListItem>
          ))}
          <ListItem button onClick={() => setNestedOpen(!nestedOpen)}>
            <ListItemText
              primary={`Danh sách sản phẩm (số lượng: ${props.catalog?.products.length})`}
              primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
            />
          </ListItem>
          <Collapse in={nestedOpen} timeout={'auto'} unmountOnExit={true}>
            <List>
              {props.catalog?.products.map((shoe) => (
                <ListItem key={shoe._id}>
                  <ListItemAvatar>
                    <Avatar src={shoe.imageUrl} sizes={'large'} variant={'rounded'} />
                  </ListItemAvatar>
                  <ListItemText primary={shoe.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogDetailDialog;
