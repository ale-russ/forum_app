import React, { useState } from "react";
import Dropzone from "react-dropzone";

const UploadImage = () => {
  const [image, setImage] = useState();
  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setImage(acceptedFiles[0]);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className={` dark-search rounded-lg block w-full p-2 h-10`}
        >
          <input {...getInputProps()} />
          {acceptedFiles && acceptedFiles[0] ? (
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
              {acceptedFiles[0].name}
            </p>
          ) : (
            <div className={`text-neutral-400`}>Image</div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default UploadImage;
