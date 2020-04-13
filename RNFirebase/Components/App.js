import React, {Componet, Component} from "react";
import { TextInput, View, Text,Button, TouchableOpacity, Alert,StyleSheet, AsyncStorage } from "react-native";

// import {fcmService} from '../src/FCMService'
import firebase from 'react-native-firebase';
// import type { Notification, NotificationOpen } from 'react-native-firebase';

// export default class App extends Component{
class App extends Component{
   
    // constructor(props){
    //     super(props);
    //     this.fcmNotification=null
    // }

    // ComponentDidMount() { 
          
    //     this.fcmNotification = fcmService
    //     this.fcmNotification.register(this.onRegister, this.onNotification,
    //     this.onOpenNotification)
    // }

    // onRegister(token) {
    //     console.log("[Notification] onRegister: ", token)
    // }

    // onNotification(notify) {
    //      console.log("[Notification] onNotification: ", notify)
    // }

    // onOpenNotification(notify) {
    //      console.log("[Notification] onOpenNotification: ", notify)
    // }
    // clickme(){
    //      console.log("[Notification] onOpenNotification: ")
    //     // onRegister(token) {
    //     //     console.log("[Notification] onRegister: ", token)
    //     // }
    // }
/////////////////////////////////////////////////////////////////////
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

    render(){
        let {container} = styles
      return(
            <View style={container}>
               <Text>Sampl REact Natissssvfffe Firebase</Text>
               <Button title="Press me"
                 onPress={() => {this.componentDidMount()}}
               />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default App;