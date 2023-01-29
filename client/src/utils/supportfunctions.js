import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

export const filters = [
  { id: 2, name: "Lyric", value: "lyric" },
  { id: 3, name: "Guitar", value: "guitar" },
  { id: 4, name: "Melody", value: "melody" },
  { id: 5, name: "Lo-Fi", value: "lofi" },
];

export const filterByLanguage = [
  { id: 1, name: "Tamil", value: "tamil" },
  { id: 2, name: "English", value: "english" },
  { id: 3, name: "Kazakh", value: "malayalam" },
  { id: 4, name: "Russian", value: "Telungu" },
  { id: 5, name: "Hindi", value: "hindi" },
];

export const deleteAnObject = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};
