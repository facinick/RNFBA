import React from 'react';
import auth from '@react-native-firebase/auth';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from "react-redux";
import { GoogleSignin } from '@react-native-community/google-signin';
import { BeginLogin } from "../Redux/Actions"
import MainActivity from "../Components/MainActivity";

GoogleSignin.configure({
    webClientId: '291149692404-ebrmufanvjg2ed2ni7n0k1qqpc69vsog.apps.googleusercontent.com',
    // androidClientId: ''
    offlineAccess: true
});

export function LoginActivity(props:any) {

    function GoogleSignIn() {
        return (
            <Button
                title="Google Sign-In"
                onPress={() => props.dispatch(BeginLogin())}
            />
        );
    }

    const getName = () => props.name ;

    console.log(props);

    return (
        <View>
            {props.loggedIn ? <MainActivity></MainActivity> : <GoogleSignIn></GoogleSignIn>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


const mapStateToProps = (state: any) => ({
    loggedIn: state.loggedIn,
    loginProgressing: state.loginProgressing,
    name: state.name, 
    email: state.email, 
    uid: state.uid
});

export default connect(mapStateToProps)(LoginActivity);