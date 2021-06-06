import React from 'react';
import { Shoe } from 'business/src';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Icon,
} from '@material-ui/core';

const ProductTableContent = (props: {
  shoes: Shoe[];
  classes: any;
  onShoeView: (shoe: Shoe, isEditMode: boolean) => void;
}): JSX.Element => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>Title</TableCell>
        <TableCell>Brand</TableCell>
        <TableCell>Colorway</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
    {props.shoes.map((shoe, index) => (
      <TableRow hover key={`${index}${shoe._id}`}>
        <TableCell>
          <Avatar src={shoe.imageUrl} variant={'rounded'} sizes={'large'} />
        </TableCell>
        <TableCell>
          <Typography variant="body1">{shoe.title}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{shoe.brand}</Typography>
        </TableCell>
        <TableCell>
          {shoe.colorway.map((c) => (
            <Chip
              clickable
              label={c}
              key={c}
              className={props.classes.chip}
              color={'inherit'}
            />
          ))}
        </TableCell>
        <TableCell>
          <Chip clickable label={shoe.category} />
        </TableCell>
        <TableCell className={props.classes.action}>
          <IconButton onClick={() => props.onShoeView(shoe, true)}>
            <Icon>edit</Icon>
          </IconButton>
          <IconButton onClick={() => props.onShoeView(shoe, false)}>
            <Icon>preview</Icon>
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  </Table>
);

export default ProductTableContent;
