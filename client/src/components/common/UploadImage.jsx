import React from "react";

const UploadImage = ({ setImage }) => {
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
          className={`${
            theme === "dark" ? "dark-auth-card" : "light-auth-card"
          } rounded-sm block border ${
            theme === "dark" ? "dark-border" : "light-border"
          } w-full p-2 h-10`}
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
