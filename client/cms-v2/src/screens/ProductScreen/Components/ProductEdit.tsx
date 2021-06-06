import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  TextField,
  Grid,
  Button,
} from '@material-ui/core';
import { History } from 'history';
import { Shoe, ObjectFactory, IShoeService, FactoryKeys } from 'business';
import { getToken } from '../../../utilities';

type Props = {
  history: History<{ shoe: Shoe }>;
  isEditMode: boolean;
};

const useStyles = makeStyles(() => ({
  root: {},
  screenName: {
    marginBottom: 15,
  },
  shoeImg: {
    maxWidth: 300,
    height: 'auto',
    margin: '0 auto',
  },
  buttonContainer: {
    marginTop: 15,
    '& .MuiButton-root': {
      marginLeft: 10,
    },
    '& .cancelButton': {
      backgroundColor: 'rgb(220, 0, 78)', // material-ui original color for secondary button
      color: 'white',
    },
    '& .confirmButton': {
      backgroundColor: '#1976d2', // material-ui original color for primary button
      color: 'white',
    },
  },
}));

const ProductEdit = (props: Props): JSX.Element => {
  const classes = useStyles();
  const shoe: Shoe = props.history.location.state.shoe;

  const [title, setTitle] = useState(shoe?.title ?? '');
  const [brand, setBrand] = useState(shoe?.brand ?? '');
  const [category, setCategory] = useState(shoe?.category ?? '');
  const [retailPrice, setRetailPrice] = useState(shoe?.retailPrice ?? '');
  const [releaseDate, setReleaseDate] = useState(shoe?.releaseDate ?? '');
  const [description, setDescription] = useState(shoe?.description ?? '');

  return (
    <div className={classes.root}>
      <Typography variant={'h2'} className={classes.screenName}>
        Thay đổi thông tin sản phẩm
      </Typography>
      <Card>
        <CardContent>
          <CardMedia
            component={'img'}
            alt={'Shoe image'}
            image={shoe.imageUrl}
            className={classes.shoeImg}
          />
          <Grid container spacing={3}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                required
                label="Title"
                defaultValue={title}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                rowsMax={2}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                variant="outlined"
                required
                label="Brand"
                defaultValue={brand}
                fullWidth
                onChange={(event) => setBrand(event.target.value)}
              />
            </Grid>
            <Grid item xs>
              <TextField
                variant="outlined"
                required
                label="Category"
                defaultValue={category}
                fullWidth
                onChange={(event) => setCategory(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <TextField
                variant="outlined"
                label="Retail price"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={retailPrice}
                onChange={(event) => setRetailPrice(event.target.value)}
              />
            </Grid>
            <Grid item xs>
              <TextField
                variant="outlined"
                label="Release date"
                defaultValue={releaseDate}
                fullWidth
                onChange={(event) => setReleaseDate(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Description"
                fullWidth
                multiline
                rows={6}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Button
          variant="contained"
          className="cancelButton"
          onClick={() => props.history.goBack()}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          className="confirmButton"
          onClick={async () => {
            const shoeService = ObjectFactory.getObjectInstance<IShoeService>(
              FactoryKeys.IShoeService,
            );
            try {
              const updateParam = {
                shoeId: shoe._id,
                shoeEsId: shoe.esId,
                title,
                brand,
                category,
                retailPrice,
                releaseDate,
                description,
              };
              if (!retailPrice) {
                delete updateParam.retailPrice;
              }
              await shoeService.updateShoe(getToken(), updateParam);
              props.history.goBack();
            } catch (error) {
              alert(error);
            }
          }}
        >
          Xác nhận
        </Button>
      </Grid>
    </div>
  );
};

export default ProductEdit;
