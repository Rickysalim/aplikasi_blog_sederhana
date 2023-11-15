import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUpload";
import { fData } from "../../utils/formatNumber";
import { useCallback, useEffect, useState } from "react";
import { dispatch, useSelector } from "../../redux/store";
import { setStateProfile, updateProfile } from "../../redux/slices/profile";
import useAuth from "../../hooks/useAuth";
import { Profile } from "../../@types/profile";
import useIsMountedRef from "../../hooks/useIsMountedRef";


export default function ProfileForm() {
  const [isEdit, setEdit] = useState<boolean>(false);

  const { user } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { id, fullname, phone_number, email, image } = useSelector(
    (state) => state.profile.profileState
  );

  const defaultValues = {
    id: user?.id || id,
    image: user?.image || image,
    fullname: user?.fullname || fullname,
    phone_number: user?.phone_number || phone_number,
    email: user?.email || email,
  };

  const NewUserSchema = Yup.object().shape({
    fullname: Yup.string().required("Fullname is required"),
    phone_number: Yup.string().required("Phone number is required"),
    email: Yup.string().required("Email is required").email(),
  });

  const methods = useForm<Profile>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    dispatch(setStateProfile(values));
  }, [dispatch]);

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

  const handleEdit = () => {
    setEdit(!isEdit);
  };


  const onSubmit = async (data: Profile) => {
    try {
      dispatch(updateProfile(data));
    } catch (error: any) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError("afterSubmit", { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={6}>
        <Card sx={{ p: 3, mt: 4 }}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
            }}
          >
            <Grid item xs={12}>
              {isEdit ? (
                <RHFTextField name="fullname" label="Full Name" />
              ) : (
                <RHFTextField name="fullname" label="Full Name" disabled />
              )}
            </Grid>
            <Grid item xs={12}>
                <RHFTextField name="email" label="Email Address" disabled />
            </Grid>
            <Grid item xs={12}>
                <RHFTextField
                  name="phone_number"
                  label="Phone Number"
                  disabled
                />
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "grid",
                    columnGap: 2,
                    rowGap: 3,
                  }}
                >
                  {isEdit ? (
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
                  ) : (
                    <RHFUploadAvatar
                      name="image"
                      maxSize={3145728}
                      disabled
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
                  )}
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" sx={{ mr: 3 }} href="/">
                Back
              </Button>
              <Button variant="contained" sx={{ mr: 3 }} onClick={handleEdit}>
                Edit
              </Button>
              {isEdit ? (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save
                </LoadingButton>
              ) : (
                <Button variant="contained">Save</Button>
              )}
            </Grid>
          </Box>
        </Card>
      </Grid>
    </FormProvider>
  );
}
