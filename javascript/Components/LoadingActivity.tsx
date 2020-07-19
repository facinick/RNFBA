import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

export const LoadingActivity = (props:any) => {

    const checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged((user) => {
          if(user){
            console.log(`user logged in`);
            props.navigation.navigate('MainScreen');
          }else{
            console.log(`user not logged in`);
            props.navigation.navigate('LoginScreen');
          }
        })
    }
    
    useEffect(() => {
        checkIfLoggedIn();
    }, [])

    return (<ActivityIndicator size="large"></ActivityIndicator>);
}
