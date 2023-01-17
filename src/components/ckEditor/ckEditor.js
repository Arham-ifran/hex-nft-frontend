import { ENV } from '../../config/config';
export const uploadAdapter = (loader) => {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const body = new FormData();
        loader.file.then((file) => {
          body.append("files", file);
          fetch(ENV.url + 'reports/upload', {
            method: "POST",
            headers: {
              'Authorization': ENV.Authorization,
              'x-auth-token': ENV.x_auth_token,
              'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
            },
            body: body,
            // mode: "no-cors"
          })
            .then((res) => res.json())
            .then((res) => {
              resolve({
                default: ENV.uploadedImgPath + res.imageData.filename
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    }
  };
}

export const uploadPlugin = (editor) => {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}