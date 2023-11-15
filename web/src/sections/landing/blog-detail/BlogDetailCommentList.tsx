import {
  Box,
  Card,
  List,
} from "@mui/material";

type Props = {
  children: React.ReactNode
};

export default function BlogDetailCommentList({ children }: Props) {

  return (
      <List disablePadding>
        <Box sx={{ ml: 3, mt: 1 }}>
          {children}
        </Box>
      </List>
  );
}
