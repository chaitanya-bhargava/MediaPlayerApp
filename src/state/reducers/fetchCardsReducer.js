const reducer =(state = {}, action) => {
  if (action.type === "fetch-cards") {
    const new_state={
      ...state,
      [action.payload.bucketid]:action.payload.data
    }
    return new_state;
  }  else return state;
};

export default reducer;
