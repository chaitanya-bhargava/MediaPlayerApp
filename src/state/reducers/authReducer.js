const reducer = (state=null,action)=>{
    if(action.type==='sign-out'){
        return null;
    }
    else if(action.type==='sign-in'){
        return action.payload;
    }
    else return state; 
}

export default reducer;