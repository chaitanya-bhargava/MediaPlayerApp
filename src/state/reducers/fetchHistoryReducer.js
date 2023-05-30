const reducer = (state = [], action) => {
  if (action.type === "fetch-history") {
    return action.payload
  } else return state;
};

export default reducer;
