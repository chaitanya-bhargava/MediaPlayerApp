export const userSignOut = () => {
    return (dispatch)=>{
        dispatch({
            type: 'sign-out'
        })
    }
}
export const userSignIn = (user) => {
    return (dispatch)=>{
        dispatch({
            type: 'sign-in',
            payload: user
        })
    }
}