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
  AsyncStorage, 
  TextInput
} from "react-native";
import {fcmService} from './src/FCMService'
import firebase from 'react-native-firebase';
import io from 'socket.io-client';

export default class App extends Component {
    state = {
        name: 'Dat phat',
        text: 'Nhập nhiệu'
    }

    constructor(props){
        super(props);
        this.socket = io('http://192.168.100.11:3000', {jsonp:true});
    }

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
      var array = [this.state.name, this.state.text, '1', '0']

        this.socket.emit("client-send-android" , array);
      const FIREBASE_API_KEY = "AAAAqgYphBg:APA91bEV29uNbFJR2kF4Ldiz0Rvn8emaX1-BV1s14TYjdI8Yh3wnCNvoj71_DsS-d9JxBB6Uz9nBkOi62GT3kQyFgdcB1MKD51qE-i-E0cyLH6-6pQZ-pwKHKgEbxH0m3xEDC2Ra5RXL";
      const message = {
          registration_ids: ["dz6u456WvV0yBpmMk20FAu:APA91bEQrPiz5jW-50St6v3khTqaiIcQY0upL9xf0ivCVZAUS1JxRkGjEyRT56__U6jZQ726_6VlCIWCl-0pzh3om8vjTFLRIeMREUBWGPICzkpPKZX4OqU05SI4RyBSEIEgMGYfRnrK"],
          notification: {
              title: "Hello Anh AN",
              body: "React Native Firebase"
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
         <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(name) =>this.setState({name})}
                    value={this.state.name}
                    />
                     <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) =>this.setState({text})}
                    value={this.state.text}
                    />
            <Button title="Press me"
                onPress={() => {this.SendNotification()}}
               />
      </View>
    )
  }
}
