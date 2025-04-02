import { Button } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { CardsService } from "../../injectables/cardsservice";
import { I18n } from "../../injectables/i18n";

enum State {
  Idle = "idle",
  Uploading = "uploading",
  Success = "success",
  Error = "error",
}

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>(State.Idle);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      console.log(e.target.files);
      setFile(e.target.files[0]);
      setState(State.Idle);
    }
  }

  async function handleFileUpload() {
    if (!file) return;
    setState(State.Uploading);
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

      setState(State.Success);
      setUploadProgress(100);
    } catch {
      setState(State.Error);
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
            loading={state === State.Uploading}
          >
            Upload
          </Button>
          {state === State.Uploading && <p>{uploadProgress}% uploaded</p>}
        </>
      )}
      {state === State.Success && <p>{I18n.get("file-upload-success")}</p>}
      {state === State.Error && <p>{I18n.get("file-upload-error")}</p>}
    </div>
  );
};

export default FileUploader;
