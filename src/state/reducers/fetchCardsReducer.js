const reducer =(state = [], action) => {
  if (action.type === "fetch-cards") {
    return action.payload;
  }  else return state;
};

export default reducer;
