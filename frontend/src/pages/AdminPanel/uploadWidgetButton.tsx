import { Button, Spinner } from "react-bootstrap";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export const UploadWidgetButton = () => {
  const { widgetRef } = useCloudinaryUpload();

  if (!widgetRef) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <Button onClick={() => widgetRef.current?.open()}>upload image</Button>
    </div>
  );
};
