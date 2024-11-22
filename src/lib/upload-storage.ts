import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const uploadStorage = async (file: File) => {
  const date = new Date();
  const storageRef = ref(storage, `images/${date + file.name}`);

  const uploadTask = uploadBytes(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask
      .then((res) => {
        getDownloadURL(res.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      })
      .catch((error) => {
        reject("Something went wrong!" + error.code);
      });
  });
};

export default uploadStorage;
