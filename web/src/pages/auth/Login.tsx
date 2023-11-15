import {
  Box,
  Container,
  Typography,
  Avatar,
  CssBaseline,
  Grid,
  Link,
} from "@mui/material";
import Page from "../../components/Page";
import { LoginForm } from "../../sections/auth/login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Iconify from "../../components/Iconify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import useGoogleAuth from "../../hooks/useGoogleAuth";
import { useNavigate } from "react-router-dom";


function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">Ricky Salim Blog</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {

  const { login }= useGoogleAuth()

  const onSuccess = async (response: any) => {
    await login(response)
  };

  const onError = () => {
    console.log("Failed");
      ;
  };

  return (
    <Page title="Login">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <Iconify icon="material-symbols:lock" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              <LoginForm />
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 1 }}>
              <GoogleOAuthProvider
                clientId={
                  "712187352614-in6oi36u6rfaruhdio50fp2hk21f738e.apps.googleusercontent.com"
                }
              >
                <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </GoogleOAuthProvider>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Page>
  );
}
