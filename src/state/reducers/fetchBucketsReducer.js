const reducer = (state = [], action) => {
  if (action.type === "fetch-buckets") {
    return action.payload
  } else return state;
};

export default reducer;
