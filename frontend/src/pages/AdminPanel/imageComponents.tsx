import { Button, Spinner, Alert } from "react-bootstrap";
import qs from "qs";
import { useRef, useEffect } from "react";
import { useCloudinary } from "../../hooks/useCloudinary";
import { getSignatureForImage } from "../../lib/cloudinary";

export const UploadWidget = () => {
  const widgetRef = useRef<CloudinaryUploadWidget | null>(null);
  // console.log(widgetRef);

  const { cloudinaryUploadInfo, cloudinaryInfoLoading, cloudinaryInfoError } =
    useCloudinary();

  useEffect(() => {
    if (window.cloudinary && cloudinaryUploadInfo) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudinaryUploadInfo.cloudName,
          prepareUploadParams: async (cb, params) => {
            const initSignatureInfo = qs.stringify(params);
            const imageUploadInfo = await getSignatureForImage(
              initSignatureInfo
            );
            cb({
              apiKey: imageUploadInfo.apiKey,
              folder: imageUploadInfo.folder,
              signature: imageUploadInfo.signature,
              uploadSignatureTimestamp: imageUploadInfo.timestamp,
            });
          },
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Uploaded image:", result.info.secure_url);
          }
        }
      );
    }
  }, [cloudinaryUploadInfo]);

  if (cloudinaryInfoLoading) {
    return <Spinner animation="border" />;
  }

  if (cloudinaryInfoError) {
    return (
      <Alert variant="danger">
        error occured related to image upload, try again later.
      </Alert>
    );
  }

  return (
    <div>
      <Button onClick={() => widgetRef.current?.open()}>upload image</Button>
    </div>
  );
};
