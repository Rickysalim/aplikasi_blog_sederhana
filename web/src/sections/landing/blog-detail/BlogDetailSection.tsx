import * as React from "react";
import Grid from "@mui/material/Grid";
import Main from "./Main";
import { getPostDataByTitle } from "../../../redux/slices/blog";
import { findOneComment } from "../../../redux/slices/comment";
import { useSelector, dispatch } from "../../../redux/store";
import { postComment } from "../../../redux/slices/comment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import BlogNotFound from "./BlogDetailNotFound";
import BlogDetailCommentItem from "./BlogDetailCommentItem";
import BlogDetailCommentList from "./BlogDetailCommentList";
import useAuth from "../../../hooks/useAuth";
import { setCommentState } from "../../../redux/slices/comment";
import { fDate } from "../../../utils/time";
import Iconify from "../../../components/Iconify";
import { checkLike, countLike, createLike } from "../../../redux/slices/like";

export default function BlogDetailSection() {
  const [likeBtn, setBtnLike] = useState(false);

  const isLoadingLike = useSelector((state) => state.like.isLoading);
  const isLoadingPost = useSelector((state) => state.blog.isLoading);
  const isLoadingComment = useSelector((state) => state.comment.isLoading);

  const { is_like, like } = useSelector((state) => state.like);

  const { isAuthenticated, user } = useAuth();

  const { postByTitle } = useSelector((state) => state.blog);

  const { comment } = useSelector((state) => state.comment);

  const { commentState } = useSelector((state) => state.comment);

  const navigate = useNavigate();

  const commentValues: any = {
    post_id: postByTitle?.data?.id || commentState?.post_id,
    person_id: user?.id || commentState?.person_id,
    comment: commentState?.comment,
    parent_id: null,
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    dispatch(createLike(postByTitle?.data?.id));
    dispatch(checkLike(postByTitle?.data?.id));
    dispatch(countLike(postByTitle?.data?.id));
    dispatch(getPostDataByTitle(title));
  };

  const handleChangeComment = (e: any) => {
    dispatch(setCommentState(e?.target?.value));
  };

  const handleSendComment = (e: any) => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    dispatch(findOneComment(postByTitle?.data?.id));
    dispatch(postComment(commentValues));
    dispatch(setCommentState(""));
  };

  const { title } = useParams();

  useEffect(() => {
    dispatch(getPostDataByTitle(title));
  }, [title]);

  useEffect(() => {
    if (is_like) {
      setBtnLike(true);
    } else {
      setBtnLike(false);
    }
  });

  useEffect(() => {
    dispatch(findOneComment(postByTitle?.data?.id));
  }, [dispatch, postByTitle?.data?.id])

  useEffect(() => {
    dispatch(checkLike(postByTitle?.data?.id));
    dispatch(countLike(postByTitle?.data?.id));
  }, [postByTitle?.data?.id]);

  return (
    <>
      {isLoadingPost ? (
        <Grid item xs={12} sx={{ mt: 5 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {postByTitle?.data === null ? (
            <>
              <BlogNotFound />
            </>
          ) : (
            <>
              {postByTitle?.data && (
                <>
                  <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Paper
                      sx={{
                        position: "relative",
                        backgroundColor: "grey.800",
                        color: "#fff",
                        mb: 4,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundImage: `url(${postByTitle?.data?.image})`,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          right: 0,
                          left: 0,
                          backgroundColor: "rgba(0,0,0,.3)",
                        }}
                      />
                      <Grid container>
                        <Grid item md={6}>
                          <Box
                            sx={{
                              position: "relative",
                              p: { xs: 3, md: 6 },
                              pr: { md: 0 },
                            }}
                          >
                            <Typography
                              component="h1"
                              variant="h3"
                              color="inherit"
                              gutterBottom
                            >
                              {postByTitle?.data?.title}
                            </Typography>
                            <Typography
                              component="p"
                              variant="body1"
                              color="inherit"
                              gutterBottom
                            >
                              Author: {postByTitle?.data?.Person?.fullname}
                            </Typography>
                            <Typography
                              component="p"
                              variant="body1"
                              color="inherit"
                              gutterBottom
                            >
                              Publish:{" "}
                              {!isLoadingPost &&
                                fDate(
                                  postByTitle?.data?.created_at || new Date()
                                )}
                            </Typography>
                            <Typography
                              component="p"
                              variant="body1"
                              color="inherit"
                              gutterBottom
                            >
                              Description: {postByTitle?.data?.description}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                    <Grid container spacing={5} sx={{ mt: 3 }}>
                      <Main posts={postByTitle?.data?.content} />
                    </Grid>
                    <Grid container spacing={5} sx={{ mt: 3 }}>
                      <Container>
                        <Box sx={{ mb: 10, mt: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Write comment"
                            InputProps={{
                              sx: {
                                border: (theme) =>
                                  `solid 1px ${theme.palette.grey[500]} !important`,
                              },
                            }}
                            value={commentState?.comment}
                            onChange={handleChangeComment}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleSendComment}
                          >
                            Send
                          </Button>
                        </Box>
                        <Box sx={{ display: "flex", mb: 2, mt: 2 }}>
                          <Button onClick={handleLike}>
                            {!likeBtn ? (
                              <Iconify icon="fluent:thumb-like-28-regular" sx={{ width: '100px', height: '100px'}} />
                            ) : (
                              <Iconify icon="fluent:thumb-like-28-filled" sx={{ width: '100px', height: '100px'}}/>
                            )}
                          </Button>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: "text.disabled" }}
                          >
                            {!isLoadingLike && like}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 2, mt: 2 }}>
                          <Typography variant="h4">Comments</Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "text.disabled" }}
                          >
                            {!isLoadingComment && comment?.count}
                          </Typography>
                        </Box>
                        <BlogDetailCommentList>
                          {!isLoadingComment &&
                            comment?.data &&
                            comment?.data?.map((item) => {
                              const hasReply = item?.replies?.length > 0;
                              const isOwnComment = item?.person_id == user?.id;
                              return (
                                <Box key={item.id} sx={{}}>
                                    <BlogDetailCommentItem
                                      key={item?.id}
                                      id={item?.id}
                                      name={item?.fullname}
                                      message={item?.comment}
                                      created_at={item?.created_at}
                                      person_id={item?.person_id}
                                      post_id={item?.post_id}
                                      parent_id={item?.parent_id}
                                      image={item?.image}
                                      isOwnComment={isOwnComment}
                                    />
                                  {hasReply &&
                                    item?.replies?.map((reply) => {
                                      return (
                                        <BlogDetailCommentItem
                                          key={reply?.id}
                                          id={reply?.id}
                                          name={reply?.fullname}
                                          message={reply?.comment}
                                          created_at={reply?.created_at}
                                          hasReply
                                          person_id={reply?.person_id}
                                          post_id={reply?.post_id}
                                          parent_id={reply?.parent_id}
                                          image={reply?.image}
                                          isOwnComment={isOwnComment}
                                        />
                                      );
                                    })}
                                </Box>
                              );
                            })}
                        </BlogDetailCommentList>
                      </Container>
                    </Grid>
                  </Container>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
