import React from 'react';	
 
const initialState = {
    user: undefined,
    loggedIn: false,
    loginProgressing: false,
    email: undefined,
    name: undefined,
    uid: undefined,
};

export function reducer(state = initialState, action:any){
switch (action.type) {
    case "LOGIN_BEGIN":
    return {
        ...state,
        loginProgressing: true,
        loggedIn: false,
    };
    case "LOGIN_SUCCESS":
    return {
        ...state,
        loginProgressing: false,
        loggedIn: true,
        email: action.payload.email,
        name: action.payload.name,
        uid: action.payload.uid,
    };
    case "LOGIN_FAILURE":
    return {
        ...state,
        loginProgressing: false,
    };
    default:
        return {
            ...state,
    };
  }
}
 
