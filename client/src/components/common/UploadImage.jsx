import React, { useState } from "react";
import Dropzone from "react-dropzone";

const UploadImage = () => {
  const [image, setImage] = useState();
  return (
    <div className="w-full">
      Upload Image
      <Dropzone
        multiple={false}
        onDrop={async (acceptedFiles) => {
          setImage(acceptedFiles[0]);
        }}
      >
        {({ getRootProps, getInputProps, acceptedFiles }) => (
          <div
            {...getRootProps()}
            className={` light-search rounded block w-full p-2 h-10`}
          >
            <input {...getInputProps()} />
            {acceptedFiles && acceptedFiles[0] ? (
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                {acceptedFiles[0].name}
              </p>
            ) : (
              <div className={`text-neutral-600`}>Image</div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default UploadImage;
