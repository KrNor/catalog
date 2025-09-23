import { Alert, Spinner } from "react-bootstrap";
import { AdvancedImage } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";

import { useCloudinary } from "../../hooks/useCloudinary";
import { UploadWidget } from "./imageComponents";

const UploadImage = () => {
  const {
    cloudinaryInstance,
    //cloudinaryUploadInfo,
    cloudinaryInfoLoading,
    cloudinaryInfoError,
    cloudinaryInstanceAndInfoLoaded,
  } = useCloudinary();

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

  let tstImage: CloudinaryImage | null = null;
  if (cloudinaryInstance) {
    tstImage = cloudinaryInstance.image("sample");
  }

  return (
    <div>
      <div>
        {cloudinaryInstanceAndInfoLoaded ? (
          <UploadWidget />
        ) : (
          <div>wait...</div>
        )}
      </div>
      {tstImage ? (
        <AdvancedImage cldImg={tstImage} />
      ) : (
        <div>image not loaded</div>
      )}
    </div>
  );
};

export default UploadImage;
