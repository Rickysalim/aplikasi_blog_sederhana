import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { fDate } from "../../utils/time";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button, Link } from "@mui/material";
import Iconify from "../../components/Iconify";
import { deleteWishList, getWishList } from "../../redux/slices/wishlist";
import { dispatch, useSelector } from "../../redux/store";
import { useEffect } from "react";

interface FeaturedPostProps {
  post: {
    id: number;
    person_id: number;
    post_id: number;
    created_at: string;
    Person: {
      fullname: string;
    };
    Post: {
      title: string | null;
      content: string | null;
      created_at: string | number | Date;
      image: string | undefined;
      description: string | null;
      Person: {
        fullname: string;
      };
    };
  };
}

export default function FeaturedPost(props: FeaturedPostProps) {
  const { post } = props;

  const query = useSelector((state) => state.wishlist.query);

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const handleDeleteWishList = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(deleteWishList(post?.id));
      dispatch(getWishList(query))
    }
  };


  return (
    <Grid item xs={12} sx={{ mt: 3 }}>
      <CardActionArea component="a">
        <Card sx={{ display: "flex" }}>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: "none", sm: "block" } }}
            image={post.Post.image}
            alt={post.Post.image}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post?.Post?.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {fDate(post?.Post?.created_at)}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post?.Post?.description}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Author: {post?.Post?.Person?.fullname}
            </Typography>
            <Link
              href={`/detail/${post?.Post?.Person?.fullname}/${post?.Post?.title}`}
            >
              <Typography variant="subtitle1" color="primary">
                Baca Artikel
              </Typography>
            </Link>
          </CardContent>
          <CardContent>
            <Button color="error" onClick={handleDeleteWishList}>
              <Iconify icon="material-symbols:delete-forever-outline" />
            </Button>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}
