import * as Yup from "yup";
import { useCallback, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";
import { RHFUploadAvatar } from "../../../components/hook-form/RHFUpload";
import { fData } from "../../../utils/formatNumber";

// ----------------------------------------------------------------------

type FormValuesProps = {
  fullname: string;
  password: string;
  phone_number: string;
  email: string;
  image: string | File;
  afterSubmit?: string;
};

export default function LoginForm() {
  const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullname: Yup.string().required("Fullname is required"),
    password: Yup.string().required("Password is required"),
    phone_number: Yup.string().required("Password is required"),
    email: Yup.string().required("Email is required"),
  });

  const defaultValues = {
    fullname: "",
    password: "",
    image: "",
    phone_number: "",
    email: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;


  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await register(
        data.fullname,
        data.password,
        data.phone_number,
        data.email,
        data.image
      ).then(() => {
        navigate("/login");
      });
    } catch (error: any) {
      if (isMountedRef.current) {
        setError("afterSubmit", { ...error, message: error.message });
      }
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {!!errors.afterSubmit && (
        <Alert severity="error">{errors.afterSubmit.message}</Alert>
      )}

      <RHFUploadAvatar
        name="image"
        maxSize={3145728}
        onDrop={handleDrop}
        helperText={
          <Typography
            variant="caption"
            sx={{
              mt: 2,
              mx: "auto",
              display: "block",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Allowed *.jpeg, *.jpg, *.png, *.gif
            <br /> max size of {fData(3145728)}
          </Typography>
        }
      />

      <RHFTextField
        margin="normal"
        required
        fullWidth
        id="fullname"
        label="fullname"
        name="fullname"
        autoComplete="fullname"
        autoFocus
      />

      <RHFTextField
        margin="normal"
        required
        fullWidth
        id="phone_number"
        label="phone_number"
        name="phone_number"
        autoComplete="phone_number"
        autoFocus
        type={"number"}
      />

      <RHFTextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="email"
        name="email"
        autoComplete="email"
        autoFocus
      />

      <RHFTextField
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                <Iconify
                  icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={isSubmitting}
      >
        Register
      </LoadingButton>
    </FormProvider>
  );
}
