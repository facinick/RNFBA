import * as firebase from 'firebase';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
const provider = new firebase.auth.GoogleAuthProvider();

export const LOGIN_BEGIN   = 'LOGIN_BEGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const loginBegin = () => ({
    type: LOGIN_BEGIN
  });
  
  export const loginSuccess = (data:any) => ({
    type: LOGIN_SUCCESS,
    payload: { name: data.user.displayName, email: data.user.email, uid: data.user.uid }
  });
  
  export const loginFailure = (error:any) => ({
    type: LOGIN_FAILURE,
    payload: { error }
  });


export async function Login() {

   // Get the users ID token
   const { idToken } = await GoogleSignin.signIn();
   // Create a Google credential with the token
   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
   // Sign-in the user with the credential
   return auth().signInWithCredential(googleCredential);
  
}

export function BeginLogin() {

  return async (dispatch: any) => {
    dispatch(loginBegin());
    try {
      const data = await Login();
      dispatch(loginSuccess(data));
    }
    catch (error) {
      console.log(error)
      dispatch(loginFailure(error));
    } 
  }
}