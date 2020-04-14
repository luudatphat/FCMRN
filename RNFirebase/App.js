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
import { Text, View, Button, AsyncStorage, fetch } from 'react-native'
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
      // const FIREBASE_API_KEY = "AIzaSyARI1HpBEucWiwgi1QB6IVtxHnSnrox3RQ";
      // const message = {
      //   registration_ids: ["dJ1my11FDHg:APA91bGjjJhHjCvmMYNln2tc0FNVDfMngnvAvJwH49XPlySLXH-nt1kCvDI4wXgghAT3Z0xOQD2A_ICu4fZN6K3yZBYYRdddr7omEyKxy9FFQExEgK-lb48U-nZ6UgWOscs6yNTlMQgW"],
      //   notification: {
      //     title: "Developers",
      //     body: "Plz Subscribe to my channel",
      //     "vibrate": 1,
      //     "sound": 1,
      //     "show_in_foreground": true,
      //     "priority": "high",
      //     "content_available": true,
      //   }
      // }

      // let headers = new Headers({
      //   "Content-Type": "application/json",
      //   "Authorization": "key=" + FIREBASE_API_KEY
      // });

      // let response = await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
      // response = await response.json();
      // console.log(response);

    const FIREBASE_API_KEY = "AAAAqgYphBg:APA91bEV29uNbFJR2kF4Ldiz0Rvn8emaX1-BV1s14TYjdI8Yh3wnCNvoj71_DsS-d9JxBB6Uz9nBkOi62GT3kQyFgdcB1MKD51qE-i-E0cyLH6-6pQZ-pwKHKgEbxH0m3xEDC2Ra5RXL";
    const message = {
      // registration_ids: ["dJ1my11FDHg:APA91bGjjJhHjCvmMYNln2tc0FNVDfMngnvAvJwH49XPlySLXH-nt1kCvDI4wXgghAT3Z0xOQD2A_ICu4fZN6K3yZBYYRdddr7omEyKxy9FFQExEgK-lb48U-nZ6UgWOscs6yNTlMQgW"], 
      // notification: {
      //   title: "india vs south africa test",
      //   body: "IND chose to bat",
      //   "vibrate": 1,
      //   "sound": 1,
      //   "show_in_foreground": true,
      //   "priority": "high",
      //   "content_available": true,
      //   },
      // data: {
      //   title: "india vs south africa test",
      //   body: "IND chose to bat",
      //   score: 50,
      //   wicket: 1
      // }
      "to" : "dJ1my11FDHg:APA91bGjjJhHjCvmMYNln2tc0FNVDfMngnvAvJwH49XPlySLXH-nt1kCvDI4wXgghAT3Z0xOQD2A_ICu4fZN6K3yZBYYRdddr7omEyKxy9FFQExEgK-lb48U-nZ6UgWOscs6yNTlMQgW",
      "notification" : {
          "body" : "Fuck you",
          "title" : "React Native Firebase",
          "content_available" : true,
          "priority" : "high"
      }
    }

    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "key=" + FIREBASE_API_KEY
    });

    let response = await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
    response = await response.json();
    console.log(response);

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
