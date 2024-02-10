import { z } from "zod";
import { toast } from "sonner";
import { ProductImage } from "@/types";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/uploadthing";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileWithPath } from "@uploadthing/react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { useDropzone } from "@uploadthing/react/hooks";
import { ProductCreateValidation } from "@/lib/validation";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { cn, convertFileToUrl, formatPrice } from "@/lib/utils";
import { useCreateProduct } from "@/lib/react-query/queries";
import { categories } from "@/components/tables/products-table/filters";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductCreateForm = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [discount, setDiscount] = useState<number | undefined>(undefined);

  const navigate = useNavigate();
  const { user } = useUserContext();

  const { mutateAsync: createProduct, isPending: isLoadingCreate } = useCreateProduct();

  const form = useForm<z.infer<typeof ProductCreateValidation>>({
    resolver: zodResolver(ProductCreateValidation),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: 0,
      countInStock: 0,
      isDiscounted: false,
      discountedPrice: undefined
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

  const handleSubmit = async (value: z.infer<typeof ProductCreateValidation>) => {
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

      const discountedPrice = discount && form.getValues("price") - (form.getValues("price") * discount) / 100
      if (value.isDiscounted && discountedPrice === undefined) {
        form.setError("discountedPrice", {
          type: "manual",
          message: "If you set the discount, you must provide the discout value",
        })
        return
      }
      const newProduct = await createProduct({
        // const newProduct: INewProduct = ({
        ...value,
        discountedPrice: value.isDiscounted ? discountedPrice : undefined,
        image: productImages,
        userId: user._id,
      });


      if (newProduct && newProduct.message === 'Created Product') {
        toast.success('Product created successfully', {
          action: {
            label: 'View Product',
            onClick: () => navigate(`/products/${newProduct.data.slug}`)
          },
          duration: 5000,
        })
        setDiscount(undefined)
        form.reset()
        setFiles([]);
        setFileUrls([]);
      } else {
        toast.error('An Error occured while creating product! Please try again.')
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
      <div className="flex justify-center items-center flex-col border rounded-xl">
        <div
          {...getRootProps()}
          className="cursor-pointer max-h-[300px] w-full"
        >
          <input {...getInputProps()} className="cursor-pointer" />
          <div className="flex justify-center items-center flex-col p-7 h-80 lg:h-[200px]">
            <h3 className="base-medium text-dark-4 dark:text-light-2/90 text-lg mb-2 mt-6">Drag or Drop photos here</h3>
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
        {fileUrls.length !== 0 &&
          <div className="w-full p-4 grid grid-cols-3 lg:grid-cols-4 gap-4 border-t">
            {fileUrls.map((fileUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={fileUrl}
                  alt={`image-${index}`}
                  className="h-48 lg:h-[200px] w-full rounded-lg object-scale-down bg-white border-4 border-dashed p-5"
                />
                <X className="absolute top-2 right-2 cursor-pointer text-dark-4" onClick={() => handleRemoveFile(index)} />
              </div>
            ))}
          </div>
        }
      </div>
    )
  }

  const StatBox = ({ label, value }: { label: string; value: string }) => (
    <Button
      type="button"
      onClick={() => setDiscount(Number(value))}
      className={cn(
        `border h-16 hover:bg-neutral-200 border-gray-200 p-4 rounded-lg min-w-[100px] w-full text-center text-dark-4 dark:text-light-2/90
        ${discount === +value ? 'bg-gray-300 dark:bg-light-3/80' : 'bg-white dark:bg-dark-3'}`
      )}
    >
      <div className="flex gap-1">
        <h4 className="font-extrabold text-2xl">{value}</h4>
        <p>{label}</p>
      </div>
    </Button>
  );

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
            name="isDiscounted"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {(discount && form.getValues("isDiscounted")) ? `Discout of ${discount}% will be applied` : "Set Product Discount"}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="shad-form_message" />
              </>
            )}
          />

          {form.getValues("isDiscounted") === true && (
            <FormField
              control={form.control}
              name="discountedPrice"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start bg-neutral-100 dark:bg-dark-4 rounded-lg border p-4">
                  <FormControl>
                    <div className="flex flex-col w-full  mx-auto gap-5 my-5">
                      <div className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                        <AlertCircle className="w-6 h-6 mr-2" />
                        <span className="sr-only">Info</span>
                        <div className="text-base">
                          <span className="font-medium">Info alert!</span> You will be able to modify the discount at the admin dashboard later!
                        </div>
                      </div>
                      <Label>Choose one of:</Label>
                      <div>
                        <ul className="grid grid-cols-4 gap-5">
                          <StatBox label="%" value="10" />
                          <StatBox label="%" value="20" />
                          <StatBox label="%" value="30" />
                          <StatBox label="%" value="50" />
                        </ul>
                      </div>

                      <Label htmlFor="inputs">Or enter manually:</Label>
                      <Input
                        id="input"
                        placeholder="Discount %"
                        type="number"
                        className="h-12"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value.slice(0, 2)))}
                      />
                      <div className="flex flex-row justify-around items-start gap-3 text-lg p-4 text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-dark-3/50 dark:text-gray-300 dark:border-gray-600" role="alert">
                        <span className="sr-only">Info</span>
                        <h1>Current Price: <span className="font-semibold">{formatPrice(form.getValues("price"), { currency: "GBP" })}</span></h1>
                        {!!discount && <h1>Discount of: <span className="text-red-600 font-semibold">{formatPrice(form.getValues("price") * discount / 100, { currency: "GBP" })}</span></h1>}
                        {!!discount && <h1>Discounted Price:  <span className="text-blue-500 font-semibold">{formatPrice(form.getValues("price") - form.getValues("price") * discount / 100, { currency: "GBP" })}</span></h1>}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          )}

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
