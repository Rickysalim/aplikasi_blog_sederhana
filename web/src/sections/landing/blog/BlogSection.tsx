import { CircularProgress, Grid } from "@mui/material";
import * as React from "react";
import FeaturedPost from "./FeaturedPost";
import { getPostData, setOffSetState, setPageState } from "../../../redux/slices/blog";
import { useSelector,  dispatch } from "../../../redux/store";
import { useEffect } from "react";
import BlogNotFound from "./BlogNotFound";
import BlogPagination from "./BlogPagination";

export default function BlogSection() {
  const { data, count } = useSelector((state) => state.blog.post);
  const { isLoading, page } = useSelector((state) => state.blog);
  const query = useSelector((state) => state.blog.query)

  const handleChangePerRows = (e: React.ChangeEvent<unknown>, p: number) => {
    dispatch(setPageState(p));    
    dispatch(setOffSetState((p - 1) * 10));
  };

  useEffect(() => {
    dispatch(getPostData(query));
  }, [query]);

  return (
    <Grid container spacing={5}>
      {isLoading ? (
        <Grid item xs={12} sx={{ mt: 5 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {data?.map((post) => (
            <FeaturedPost key={post.id} post={post} />
          ))}
          {data?.length === 0 && <BlogNotFound />}
        </>
      )}
      <BlogPagination
        page={page}
        count={Math.ceil(count / 10)}
        onChange={handleChangePerRows}
      />
    </Grid>
  );
}
