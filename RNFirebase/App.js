// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';

// // import {
// //   Header,
// //   LearnMoreLinks,
// //   Colors,
// //   DebugInstructions,
// //   ReloadInstructions,
// // } from 'react-native/Libraries/NewAppScreen';

// import AppSedolist from "./Components/App.js";

// const App: () => React$Node = () => {
//   return (
//     <AppSedolist />
//   );
// };


// export default App;

import React, { Component } from 'react'
// import { Text, View, Button, AsyncStorage, fetch } from 'react-native'
import { 
  View, 
  Text,
  Button,
  NativeModules,
  NativeEventEmitter ,
  AsyncStorage
} from "react-native";
import {fcmService} from './src/FCMService'
import firebase from 'react-native-firebase';

export default class App extends Component {

    async getToken () {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if(!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if(fcmToken) {
                await AsyncStorage.setItem("fcmTocken",fcmToken)
            }
        }
    }

    async checkPermission () {
        const enabled = await firebase.messaging().hasPermission();
        if(enabled) {    
            this.getToken();
        }else {
              this.requestPermission()
        }
    }

    async requestPermission () {
        try{
              await firebase.messaging().requestPermission();
               this.getToken();
          }catch(error) {
            console.log("Permisson token error", error)
        }
    }
    
    async createNotificationListeners () {
        firebase.notifications().onNotification(notification => {
        notification.android.setChannelId('insider').setSound('default')
         firebase.notifications().displayNotification(notification)
       });
    }

    async componentDidMount () {
        const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
        firebase.notifications().android.createChannel(channel);
        this.checkPermission();
        this.createNotificationListeners()

        //
        firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                //User has permissions
                // this.getToken(onRegister)
                 console.log("Permisson has")
            } else {
                //User doesn't have permission
                 console.log("Permisson No")
                 this.NotiPermission();
            }
        }).catch(error => {
            console.log("Permisson rejected", error)
        })
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log("fcmToken from Asy", fcmToken);
        if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          if(fcmToken) {
            console.log("Fcm", fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
          }
        }
    }

    async SendNotification(){

      const FIREBASE_API_KEY = "AAAAqgYphBg:APA91bEV29uNbFJR2kF4Ldiz0Rvn8emaX1-BV1s14TYjdI8Yh3wnCNvoj71_DsS-d9JxBB6Uz9nBkOi62GT3kQyFgdcB1MKD51qE-i-E0cyLH6-6pQZ-pwKHKgEbxH0m3xEDC2Ra5RXL";
      const message = {
          registration_ids: ["cHV_BKnBrIr3-KYvQaSsyL:APA91bH6atO6wZI2X3ZwSCi5fwnkygiue0KpLo7Jy6BPZ3gHAK9MIo3rD2QW04PBthoskMzqPa1Ch0Wv1zYENJSZq3tM0poF55__nZyXrW9YeRkGyeGiq2wGc8Fd7krO1eVn1v2P5nFc"],
          notification: {
              title: "Hello Anh AN",
              body: "React Native Firebase",
              "vibrate": 1,
              "sound": 1,
              "show_in_foreground": true,
              "priority": "high",
              "content_available": true,
          }
      };

      let headers = new Headers({
          "Content-Type": "application/json",
          "Authorization": "key=" + FIREBASE_API_KEY
      });

      let response = await fetch("https://fcm.googleapis.com/fcm/send", {method: "POST", headers, body: JSON.stringify(message)});

      response = await response.json();

      console.log(response);

    }

    async Send(){
      console.log('Hello');
    }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
            <Button title="Press me"
                onPress={() => {this.SendNotification()}}
               />
      </View>
    )
  }
}
