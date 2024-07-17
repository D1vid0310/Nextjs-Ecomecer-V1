"use client";

import { fileToBase64 } from "@/actions/convertir-file-64";
import {
  Dropzone,
  ExtFile,
  FileMosaic,
  FileMosaicProps,
} from "@files-ui/react";
import * as React from "react";

export default function BasicDemoDropzone({
  handelImg,
}: {
  handelImg: (url: string) => void;
}) {
  const [files, setFiles] = React.useState<ExtFile[]>([]);

  //esta funcion obtiene el archivo lo convierte con handelImg y actualiza el formulario
  const updateFiles = async (incommingFiles: ExtFile[]) => {
    const file = incommingFiles[0].file as File;
    const base64 = await fileToBase64(file);
    handelImg(base64);
    //do something with the files
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
  };
  const removeFile = (id: FileMosaicProps["id"]) => {
    handelImg("");
    setFiles(files.filter((x) => x.id !== id));
  };
  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      header={false}
      footer={false}
      label="Agrega una Imagen"
      accept=".webp,.png,.jgp,.jpeg/*"
      maxFiles={1}
      minHeight="135px"
      //accept="image/*"
    >
      {files.map((file) => (
        <FileMosaic
          key={file.id}
          {...file}
          onDelete={removeFile}
          preview
          resultOnTooltip
          alwaysActive
        />
      ))}
    </Dropzone>
  );
}
