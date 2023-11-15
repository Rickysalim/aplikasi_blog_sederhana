import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {  RHFUploadSingleFile } from "../../components/hook-form/RHFUpload";
import { fData } from "../../utils/formatNumber";
import { useCallback } from "react";
import { dispatch, useSelector} from "../../redux/store";
import useIsMountedRef from "../../hooks/useIsMountedRef";
import  { RHFEditor } from "../../components/hook-form";
import { createBlog, getPostData } from "../../redux/slices/blog";
import { useNavigate } from "react-router-dom";
import { postState } from "../../@types/blog";

export default function CreateArticleForm() {

  const query = useSelector((state) => state.blog.query)

  const defaultValues = {
    title: "",
    description: "",
    content: ""
  };

  const isMountedRef = useIsMountedRef();

  const navigate = useNavigate()

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    content: Yup.string().required("Content is required"),
  });

  const methods = useForm<postState>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting },
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

  const onSubmit = async (data: postState) => {
    try {
      dispatch(createBlog(data))
      dispatch(getPostData(query))
      navigate('/')
      reset();
    } catch (error: any) {
      console.log(error);
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
              <RHFTextField name="title" label="title"  />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="description" label="description"  />
            </Grid>
            <Grid item xs={12}>
              <RHFEditor simple name="content"  />
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
                  <RHFUploadSingleFile
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
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save
              </LoadingButton>
            </Grid>
          </Box>
        </Card>
      </Grid>
    </FormProvider>
  );
}
