import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Iconify from "../../../components/Iconify";
import useAuth from "../../../hooks/useAuth";
import { getPostDataByTitle } from "../../../redux/slices/blog";
import {
  deleteComment,
  editComment,
  findOneComment,
  postComment,
  setCommentState,
} from "../../../redux/slices/comment";
import { dispatch, useSelector } from "../../../redux/store";
import { fDate } from "../../../utils/time";

type Props = {
  id: number;
  person_id: number;
  post_id: number;
  image: string;
  name: string;
  message: string;
  created_at: string;
  parent_id: number | null;
  hasReply?: boolean;
  isOwnComment?: boolean
};

export default function BlogDetailCommentItem({
  id,
  person_id,
  post_id,
  image,
  name,
  message,
  created_at,
  hasReply,
  parent_id,
  isOwnComment,
}: Props) {

  

  const { isAuthenticated } = useAuth();

  const { postByTitle } = useSelector((state) => state.blog);

  const { commentState } = useSelector((state) => state.comment);

  const [openReply, setOpenReply] = useState(false);

  const { user } = useAuth();

  const { title } = useParams();

  const navigate = useNavigate();

  const handleChangeComment = (e: any) => {
    dispatch(setCommentState(e?.target?.value));
  };

  let commentValues: any = {
    id: id || commentState?.id,
    post_id: post_id || commentState?.post_id,
    person_id: user?.id || commentState?.person_id,
    comment: commentState?.comment,
    parent_id: !parent_id ? parent_id : id,
  };

  const handleOpenReply = () => {
    setOpenReply(true);
  };

  const handleCloseReply = () => {
    dispatch(setCommentState(""));
    setOpenReply(false);
  };

  const handleReplyComment = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(postComment(commentValues));
      dispatch(getPostDataByTitle(title));
      dispatch(findOneComment(postByTitle?.data?.id));
      dispatch(setCommentState(""));
      setOpenReply(false);
    }
  };

  const [anchorElReply, setAnchorElReply] = useState<null | HTMLElement>(null);
  const openAnchorReply = Boolean(anchorElReply);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElReply(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElReply(null);
  };

  const handleClickEditComment = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(editComment(commentValues));
      dispatch(getPostDataByTitle(title));
      dispatch(findOneComment(postByTitle?.data?.id));
      dispatch(setCommentState(""));
      setOpenReply(false);
    }
  };
  const handleDeleteReply = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(deleteComment(commentValues));
      dispatch(getPostDataByTitle(title));
      dispatch(findOneComment(postByTitle?.data?.id));
      setOpenReply(false);
    }
  };

  const replyAnchor = [
    {
      typography: !hasReply ? " reply" : " edit",
      icon: "material-symbols:edit-outline-rounded",
      onClick: handleOpenReply,
    },
    {
      typography: "delete",
      icon: "material-symbols:delete-outline-rounded",
      onClick: handleDeleteReply,
    },
  ];

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: "flex-start",
          py: 3,
          ...(hasReply && {
            ml: "auto",
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={image} sx={{ width: 48, height: 48 }} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: "subtitle1" }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.disabled",
                }}
              >
                {fDate(created_at)}
              </Typography>
              <Typography component="span" variant="body2">
                {message}
              </Typography>
            </>
          }
        />

        {!hasReply && isOwnComment && (
          <>
            <Iconify icon={"mdi:dots-vertical"} onClick={handleClick}></Iconify>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorElReply}
              open={openAnchorReply}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                },
              }}
            >
              {replyAnchor.map((item) => {
                return (
                  <MenuItem>
                    <Iconify
                      icon={item?.icon}
                      onClick={item?.onClick}
                    ></Iconify>
                    <Typography noWrap sx={{ ml: 1 }}>
                      {item?.typography}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </>
        )}

        {hasReply && openReply && isOwnComment && (
          <Modal
            open={openReply}
            onClose={handleCloseReply}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
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
                onChange={handleChangeComment}
              />
              <Button
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleClickEditComment}
              >
                Edit
              </Button>
            </Box>
          </Modal>
        )}

        {hasReply && isOwnComment && (
          <>
            <Iconify icon={"mdi:dots-vertical"} onClick={handleClick}></Iconify>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorElReply}
              open={openAnchorReply}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                },
              }}
            >
              {replyAnchor.map((item) => {
                return (
                  <MenuItem>
                    <Iconify
                      icon={item?.icon}
                      onClick={item?.onClick}
                    ></Iconify>
                    <Typography noWrap sx={{ ml: 1 }}>
                      {item?.typography}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </>
        )}

        {!hasReply && openReply && isOwnComment && (
          <Modal
            open={openReply}
            onClose={handleCloseReply}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
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
                onChange={handleChangeComment}
              />
              <Button
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleReplyComment}
              >
                Send
              </Button>
            </Box>
          </Modal>
        )}
      </ListItem>

      <Divider
        sx={{
          ml: "auto",
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
}
