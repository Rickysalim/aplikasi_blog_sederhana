import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { fDate } from "../../../utils/time";
import Iconify from "../../../components/Iconify";
import { Button, Link } from "@mui/material";
import { dispatch } from "../../../redux/store";
import { createWishList } from "../../../redux/slices/wishlist";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface FeaturedPostProps {
  post: {
    id: number | null;
    person_id: number | null;
    title: string | null;
    content: string | null;
    created_at: string | number | Date;
    image: string | undefined;
    description: string | null;
    Person: {
      fullname: string;
    };
  };
}

export default function FeaturedPost(props: FeaturedPostProps) {

  const { post } = props;

  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const data = {
    post_id: post?.id,
    person_id: user?.id,
  };

  const handleAddWishList = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(createWishList(data));
    }
  };



  return (
    <Grid item xs={12} sx={{ mt: 3 }}>
      <CardActionArea component="a">
        <Card sx={{ display: "flex" }}>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: "none", sm: "block" } }}
            image={post.image}
            alt={post.image}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {fDate(post.created_at)}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.description}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Author: {post?.Person.fullname}
            </Typography>
            <Link href={`/detail/${post?.Person?.fullname}/${post.title}`}>
              <Typography variant="subtitle1" color="primary">
                Baca Artikel
              </Typography>
            </Link>
          </CardContent>
          <CardContent>
            <Button color="inherit" onClick={handleAddWishList}>
              <Iconify icon="icon-park-twotone:love-and-help" />
            </Button>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}
