import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Icon,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Shoe } from 'business';

const useStyles = makeStyles((theme: Theme) => ({
  searchResultText: {
    marginLeft: theme.spacing(3),
  },
  cardTitle: {
    marginBottom: theme.spacing(5),
  },
}));

const CatalogEditProductList = (props: {
  products: Shoe[];
  productSearchList: Shoe[];
  onSearch: (text: string) => void;
  onAddProduct: (shoe: Shoe) => void;
  onRemoveProduct: (shoe: Shoe) => void;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography variant={'h4'} className={classes.cardTitle}>
          Danh sách sản phẩm
        </Typography>
        <Autocomplete
          id={'virtualize-demo'}
          fullWidth
          autoHighlight
          autoComplete={true}
          options={props.productSearchList}
          getOptionLabel={(option) => option.title}
          onInputChange={async (_, value, reason) => {
            if (reason === 'input' && value.length >= 2) {
              // const { shoes } = await shoeService.searchShoes(getToken(), value, 0);
              // setSearchProductResults(shoes);
              props.onSearch(value);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Tìm kiếm sản phẩm" />
          )}
          renderOption={(shoe: Shoe) => (
            <React.Fragment>
              <Avatar src={shoe.imageUrl} variant={'rounded'} sizes={'large'} />
              <Typography noWrap className={classes.searchResultText}>
                {shoe.title}
              </Typography>
            </React.Fragment>
          )}
          getOptionSelected={(option, value) => {
            props.onAddProduct(value);
            return option._id === value._id;
          }}
        />
        <List>
          {props.products.map((shoe: Shoe) => (
            <ListItem key={shoe._id}>
              <ListItemAvatar>
                <Avatar src={shoe.imageUrl} variant={'rounded'} sizes={'large'} />
              </ListItemAvatar>
              <ListItemText primary={shoe.title} />
              <ListItemSecondaryAction>
                <IconButton edge={'end'} onClick={() => props.onRemoveProduct(shoe)}>
                  <Icon>delete</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CatalogEditProductList;
