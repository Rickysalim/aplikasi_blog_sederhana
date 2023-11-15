import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';

interface MainProps {
  posts: string | null;
}

export default function Main(props: MainProps) {
  const { posts } = props;

  return (
    <Grid
      item
      xs={12}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Divider />
        <Markdown className="markdown" key={posts?.substring(0, 40)}>
          {posts}
        </Markdown>
    </Grid>
  );
}