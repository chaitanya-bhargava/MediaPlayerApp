import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
export const userSignOut = () => {
  return (dispatch) => {
    dispatch({
      type: "sign-out",
    });
  };
};
export const userSignIn = (user) => {
  return (dispatch) => {
    dispatch({
      type: "sign-in",
      payload: user,
    });
  };
};
export const fetchBuckets = (userID) => {
  return async (dispatch) => {
    const collectionsref = collection(db, "users", userID, "buckets");
    console.log("HELLO1");
    const querySnapshot = await getDocs(collectionsref);
    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc._document.data.value.mapValue.fields.id.stringValue,
        name: doc._document.data.value.mapValue.fields.name.stringValue,
      };
    });
    dispatch({
      type: "fetch-buckets",
      payload: data,
    });
  };
};
export const fetchCards = (props) => {
  return async (dispatch) => {
    const collectionsref = collection(
      db,
      "users",
      props.userID,
      "buckets",
      `${props.bucketid}`,
      "cards"
    );
    console.log("HELLO2");
    const querySnapshot = await getDocs(collectionsref);
    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc._document.data.value.mapValue.fields.id.stringValue,
        name: doc._document.data.value.mapValue.fields.name.stringValue,
        link: doc._document.data.value.mapValue.fields.link.stringValue,
      };
    });
    dispatch({
      type: "fetch-cards",
      payload: data,
    });
  };
};
export const fetchHistory = (userID) => {
  return async (dispatch) => {
    const collectionsref = collection(db, "users", userID, "history");
    console.log("HELLO3");
    const querySnapshot = await getDocs(collectionsref);
    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc._document.data.value.mapValue.fields.name.stringValue,
        link: doc._document.data.value.mapValue.fields.link.stringValue,
        time: doc._document.data.value.mapValue.fields.time.stringValue,
      };
    });
    dispatch({
      type: "fetch-history",
      payload: data,
    });
  };
};
