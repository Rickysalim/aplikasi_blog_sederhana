import * as React from "react";
import { CircularProgress, Grid } from "@mui/material";
import FeaturedWishList from "./FeaturedWishList";
import { getWishList, setOffSetState, setPageState} from "../../redux/slices/wishlist";
import { useSelector, dispatch } from "../../redux/store";
import { useEffect } from "react";
import WishListNotFound from "./WishListNotFound";
import WishListPagination from "./WishListPagination";

export default function BlogSection() {
  const { data, count } = useSelector((state) => state.wishlist.wishlist);
  const { isLoading, page } = useSelector((state) => state.wishlist);
  const query = useSelector((state) => state.wishlist.query);

  const handleChangePerRows = (e: React.ChangeEvent<unknown>, p: number) => {
    dispatch(setPageState(p));    
    dispatch(setOffSetState((p - 1) * 10));
  };

  useEffect(() => {
    dispatch(getWishList(query));
  }, [dispatch, query]);

  return (
    <Grid container spacing={5}>
      {isLoading ? (
        <Grid item xs={12} sx={{ mt: 5 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {data?.map((post) => (
            <FeaturedWishList key={post.id} post={post} />
          ))}
          {data?.length === 0 && <WishListNotFound />}
        </>
      )}
      <WishListPagination
        page={page}
        count={Math.ceil(count / 10)}
        onChange={handleChangePerRows}
      />
    </Grid>
  );
}
