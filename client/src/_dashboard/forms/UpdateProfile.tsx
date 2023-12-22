import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ProfileUpdateValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { FileWithPath } from "@uploadthing/react";
import { useUploadThing } from "@/uploadthing";
import { cn, convertFileToUrl } from "@/lib/utils";
import { useUpdateMyAccount } from "@/lib/react-query/queries";
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteMediaFilesByKey } from "@/lib/backend-api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, checkAuthUser } = useUserContext();

  const [file, setFile] = useState<FileWithPath[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(user.photo && user.photo.url);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { mutateAsync: updateMyAccount } = useUpdateMyAccount()

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
        photo: user.photo
      })

      if (file.length > 0) {
        // delete the existent user photo from UploadThing ONLY, then upload new one
        await deleteMediaFilesByKey([user.photo.key])
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
        toast({
          title: "Success",
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-semibold bg-green-300 border-none"
          ),
          description: `Your Profile was successfully updated`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unknown Error",
          variant: "destructive",
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-bold"
          ),
          description: `Unknown Error at Profile Update`,
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Unknown Error",
        variant: "destructive",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-bold"
        ),
        description: `Unknown Error at SignIn: ${error}`,
        duration: 5000,
      });
    }
  };

  return (
    <Card className="px-10 max-w-[800px]">
      <CardHeader className="font-semibold text-3xl text-dark-4 mb-4">
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
                          <AvatarFallback className="text-3xl font-semibold">{user.firstName.slice(0,1)}{user.lastName.slice(0,1)}</AvatarFallback>
                        </Avatar>
                        <p className="small-regular md:bbase-semibold">Change profile photo</p>
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
            <Button type="submit" disabled={isUploading}>
              {isUploading ? <><Loader2 className="animate-spin h-5 w-5 mr-3" />Uploading...</> : <>Update Profile</>}
            </Button>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfile;
