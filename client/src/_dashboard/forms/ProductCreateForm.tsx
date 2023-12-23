import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProductValidation } from "@/lib/validation";
import { ProductImage } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categories } from "@/components/tables/products-table/filters";
import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { FileWithPath } from "@uploadthing/react";
import { useUploadThing } from "@/uploadthing";
import { cn, convertFileToUrl } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCreateProduct } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { ToastAction } from "@/components/ui/toast";

const ProductCreateForm = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { mutateAsync: createProduct, isPending: isLoadingCreate } = useCreateProduct();

  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: 0,
      countInStock: 0,
    },
  });

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFiles = [...files, ...acceptedFiles];
    const newFileUrls = newFiles.map(convertFileToUrl);
    setFiles(newFiles);
    setFileUrls(newFileUrls);
  },
    [files]
  );

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
  });

  const handleSubmit = async (value: z.infer<typeof ProductValidation>) => {

    if (files.length === 0) {
      form.setError("image", {
        type: "manual",
        message: "Product must have at least 1 media file.",
      })
    } else {
      const UploadFileResponse = await startUpload(files)

      const productImages: ProductImage[] = UploadFileResponse!.map((imageData) => ({
        key: imageData.key as string,
        name: imageData.name as string,
        url: imageData.url as string,
      }));

      const newProduct = await createProduct({
        // const newProduct: INewProduct = ({
        ...value,
        image: productImages,
        userId: user._id,
      });
      console.log(newProduct)

      if (newProduct && newProduct.message === 'Created Product') {
        toast({
          title: "Success",
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-semibold bg-green-300 border-none"
          ),
          description: "Product created successfully",
          action: <ToastAction
            className={cn(
              buttonVariants({
                size: "sm",
                className: " bg-dark-1 rounded-md text-white p-5 border-none"
              })
            )}
            altText="View Product"
            onClick={() => navigate(`/products/${newProduct.data.slug}`)}
          >
            View Product
          </ToastAction>,
          duration: 5000,
        });
      } else {
        toast({
          title: "An Error occured while creating product! Please try again.",
          variant: "destructive",
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-bold"
          ),
          duration: 5000,
        });
      }

    }
  };

  function handleRemoveFile(index: number) {
    const updatedFiles = [...files];
    const removedFile = updatedFiles.splice(index, 1);
    const updatedFileUrls = updatedFiles.map(convertFileToUrl);
    setFiles(updatedFiles);
    setFileUrls(updatedFileUrls);
  }

  function FileUploader() {
    return (
      <>
        <div
          {...getRootProps()}
          className="flex justify-center items-center flex-col border rounded-xl cursor-pointer max-h-[300px]"
        >
          <input {...getInputProps()} className="cursor-pointer" />
          <div className="flex justify-center items-center flex-col p-7 h-80 lg:h-[200px]">
            <h3 className="base-medium text-dark-4 text-lg mb-2 mt-6">Drag or Drop photos here</h3>
            <p className="text-light-4 small-regular mb-6">PNG, JPEG, JPG</p>

            <Button
              type="button"
              variant={"secondary"}
              disabled={isUploading}
              className="h-12 border-4"
            >
              {files.length === 0 ? "Select from computer" : "Add More"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {fileUrls.map((fileUrl, index) => (
            <div key={index} className="relative">
              <img
                src={fileUrl}
                alt={`image-${index}`}
                className="h-48 lg:h-[200px] w-full rounded-lg object-scale-down border-4 border-dashed p-5"
              />
              <X className="absolute top-2 right-2 cursor-pointer" onClick={() => handleRemoveFile(index)} />
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 w-full max-w-4xl"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Product Name</FormLabel>
                <FormControl>
                  <Input type="text" className="h-12" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Product Brand
                  </FormLabel>
                  <FormControl>
                    <Input type="text" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Product Category
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((status, index) => (
                          <SelectItem key={index} value={status.value}>
                            <span className="flex items-center">
                              <status.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Product Price
                  </FormLabel>
                  <FormControl>
                    <Input type="number" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="countInStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Product Stock
                  </FormLabel>
                  <FormControl>
                    <Input type="number" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Product Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[100px] max-h-[200px] rounded-xl focus-visible:ring-1 focus-visible:ring-offset-1"
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Product Images
                </FormLabel>
                <FormControl>{FileUploader()}</FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          {isUploading && <Progress value={uploadProgress} />}
          <div className="flex gap-4 items-center justify-end">
            <Button type="submit" disabled={isUploading || isLoadingCreate}>
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  Uploading...
                </>
              ) : isLoadingCreate ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  Creating...
                </>
              ) : (
                <>Create Product</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductCreateForm;
