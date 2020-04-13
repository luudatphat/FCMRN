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
import { Text, View, Button, AsyncStorage } from 'react-native'
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

    componentDidMount () {
        const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
        firebase.notifications().android.createChannel(channel);
        this.checkPermission();
        this.createNotificationListeners()
    }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
            <Button title="Press me"
               />
      </View>
    )
  }
}
