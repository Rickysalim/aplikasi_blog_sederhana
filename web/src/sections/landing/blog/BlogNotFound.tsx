import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

export default function BlogNotFound() {

  return (
    <Grid item xs={12} sx={{ mt: 3 }}>
      <CardActionArea component="a">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1, height: '50vh' }}>
            <Typography component="h2" variant="h5" align="center" sx={{ mt: '19vh'}}>
              Blog Not Found
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}