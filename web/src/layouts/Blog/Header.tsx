import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { dispatch, useSelector } from "../../redux/store";
import { getPostDataSearch } from "../../redux/slices/blog";
import Autocomplete from "@mui/lab/Autocomplete";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import Iconify from "../../components/Iconify";


export default function Header() {

  const { isAuthenticated, logout, user } = useAuth();

  const navigate = useNavigate();

  const { data } = useSelector((state) => state.blog.postSearch);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const blogSearch = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: any
  ) => {
    if (isAuthenticated) {
      navigate(`/detail/${newValue?.Person?.fullname || ""}/${newValue?.title || ""}`);
    } else {
      navigate("/login");
    }
  };

  React.useEffect(() => {
    dispatch(getPostDataSearch());
  }, [dispatch]);

  const logoutClick = () => {
    logout();
    navigate("/login");
  };

  const loginClick = () => {
    navigate("/login");
  };

  const profileClick = () => {
    navigate("/profile");
  };

  const wishlistClick = () => {
    navigate("/wishlist");
  };

  const createPostClick = () => {
    navigate("/create/article");
  };

  const toNewsClick = () => {
    navigate("/")
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ mr: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={user?.image}>
              {user?.fullname?.substring(0, 1)?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {isAuthenticated && (
            <>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Iconify icon="healthicons:ui-user-profile" 
                  onClick={profileClick}
                  />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                    <Iconify
                      icon="material-symbols:logout"
                      onClick={logoutClick}
                    />
                </ListItemIcon>
                Logout
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Iconify icon="material-symbols:bookmark" 
                  onClick={wishlistClick}/>
                </ListItemIcon>
                Wishlist
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Iconify icon="ic:sharp-post-add" 
                  onClick={createPostClick}/>
                </ListItemIcon>
                Create Post
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Iconify icon="fluent:news-20-regular" 
                  onClick={toNewsClick}/>
                </ListItemIcon>
                News
              </MenuItem>
            </>
          )}
          {!isAuthenticated && (
            <>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                  <Iconify
                    icon="mdi:login-variant"
                    onClick={loginClick}
                  />
              </ListItemIcon>
              Login
            </MenuItem>
          </>
          )}
        </Menu>
        <Autocomplete
          id="country-select-demo"
          sx={{ width: 300 }}
          options={data}
          onChange={blogSearch}
          autoHighlight
          getOptionLabel={(option) => option.title}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                src={option.image}
                srcSet={option.image}
                alt=""
              />
              <Typography variant="caption">{option.title}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              variant="standard"
              {...params}
              placeholder="Search…"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
       
      </Toolbar>
    </React.Fragment>
  );
}
