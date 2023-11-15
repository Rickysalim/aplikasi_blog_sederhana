import * as React from "react";
import Pagination from "@mui/material/Pagination";
import { Grid } from "@mui/material";

interface BlogPaginationProps {
    page: number;
    count: number;
    onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export default function BlogPagination(props: BlogPaginationProps) {
  return (
    <Grid item xs={12}>
        <Pagination 
          sx={{
            marginTop: '50px',
            justifyContent:"center",
            display:'flex'
          }}
          count={props.count} 
          page={props.page}
          onChange={props.onChange}
          />
    </Grid>
  );
}
