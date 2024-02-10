import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { convertFileToUrl } from "@/lib/utils";
import { useUploadThing } from "@/uploadthing";
import { Button } from "@/components/ui/button";
import { FileWithPath } from "@uploadthing/react";
import { Progress } from "@/components/ui/progress"
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/context/AuthContext";
import { useDropzone } from "@uploadthing/react/hooks";
import { ProfileUpdateValidation } from "@/lib/validation";
import { deleteMediaFilesByKey } from "@/lib/backend-api";
import { useUpdateMyAccount } from "@/lib/react-query/queries";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const UpdateProfile = () => {
  const { user, checkAuthUser } = useUserContext();

  const [file, setFile] = useState<FileWithPath[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(user.photo && user.photo.url);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { mutateAsync: updateMyAccount, isPending: isLoadingUpdate } = useUpdateMyAccount()

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFile = [...acceptedFiles];
    const newFileUrls = newFile.map(convertFileToUrl);

    setFile(newFile);
    setFileUrl(newFileUrls[0]);
  }, [file]);

  const { startUpload, isUploading, permittedFileInfo, } = useUploadThing("videoAndImage", {
    onClientUploadComplete: (data) => { console.log(data) },
    onUploadError: (error: Error) => { console.log(error) },
    onUploadBegin: (fileName: string) => { console.log("upload started for ", fileName) },
    onUploadProgress: (progress: number) => setUploadProgress(progress),
  });

  const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 1
  });

  const form = useForm<z.infer<typeof ProfileUpdateValidation>>({
    resolver: zodResolver(ProfileUpdateValidation),
    defaultValues: {
      firstName: user.firstName,
      lastname: user.lastName,
      email: user.email,
      photo: user.photo,
    },
  });

  const handleUpdate = async (value: z.infer<typeof ProfileUpdateValidation>) => {
    try {
      let userDetails = ({
        firstName: value.firstName,
        lastName: value.lastname,
        photo: user.photo ? user.photo : undefined
      })

      if (file.length > 0) {
        // delete the existent user photo from UploadThing ONLY, then upload new one
        (user.photo && user.photo.url) && toast.promise(() => deleteMediaFilesByKey([user.photo.key]),
          {
            loading: 'Removing your old file...',
            success: () => { return 'Removed old file' },
            error: () => { return 'Error deleting files.' },
          }
        );
        // (user.photo && user.photo.url) && await deleteMediaFilesByKey([user.photo.key])
        //Upload new photo and save the response
        const UploadFileResponse = await startUpload(file)
        //extrach the file values from the uplaod resposne
        const { key, name, url } = UploadFileResponse![0]
        console.log(key, name, url)
        //create a new userDetails object with the user photo
        userDetails = ({
          firstName: value.firstName,
          lastName: value.lastname,
          photo: { key, name, url }
        })
      }

      console.log(userDetails)
      const res = await updateMyAccount(userDetails)
      if (res && res.status === 200) {
        checkAuthUser()
        toast.success('Your Profile was successfully updated')
      } else {
        toast.error('Unknown Error at Profile Update')
      }
    } catch (error) {
      toast.error('Unknown Error', {
        description: `${error}`,
      })
    }
  };

  return (
    <Card className="px-10 max-w-[800px]">
      <CardHeader className="font-semibold text-3xl text-dark-4 dark:text-white/80 mb-4">
        Profile Update
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-5 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} className="cursor-pointer" />
                      <div className="cursor-pointer flex-center gap-4 flex flex-row items-center">
                        <Avatar className="h-28 w-28 border-4">
                          <AvatarImage
                            src={fileUrl}
                            alt={user.email}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-3xl font-semibold">{user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <p className="small-regular md:base-semibold text-dark-4 dark:text-muted-foreground">Change profile photo</p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">First Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="h-12" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUploading && <Progress value={uploadProgress} />}
            <Button type="submit" disabled={isUploading || isLoadingUpdate}>
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  Uploading...
                </>
              ) : isLoadingUpdate ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  Uploading...
                </>
              ) : (
                <>Update Product</>
              )}
            </Button>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfile;
