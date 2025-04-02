import { Button } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { CardsService } from "../../injectables/cardsservice";

enum Status {
  Idle = "idle",
  Uploading = "uploading",
  Success = "success",
  Error = "error",
}

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      console.log(e.target.files);
      setFile(e.target.files[0]);
    }
  }

  async function handleFileUpload() {
    if (!file) return;
    setStatus(Status.Uploading);
    try {
      setUploadProgress(0);
      await CardsService.create(
        file.name /* TODO: user-defined card title */,
        file,
        (progressEvent) => {
          const progressPercent = progressEvent.total
            ? Math.round((100 * progressEvent.loaded) / progressEvent.total)
            : 0;
          setUploadProgress(progressPercent);
        }
      );

      setStatus(Status.Success);
      setUploadProgress(100);
    } catch {
      setStatus(Status.Error);
    }
    setUploadProgress(0);
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      {file && (
        <div>
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )}
      {file && (
        <>
          <Button
            onClick={handleFileUpload}
            loading={status === Status.Uploading}
          >
            Upload
          </Button>
          {status === Status.Uploading && <p>{uploadProgress}% uploaded</p>}
        </>
      )}
      {status === Status.Success && <p>File uploaded successfully!</p>}
      {status === Status.Error && (
        <p>There was an error while uploading the file.</p>
      )}
    </div>
  );
};

export default FileUploader;
