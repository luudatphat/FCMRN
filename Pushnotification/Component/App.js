import React, {Componet, Component} from "react";
import { TextInput, View, Text,Button, TouchableOpacity, Alert } from "react-native";
window.navigator.userAgent = 'react-native';

export default class App extends Component{
    state = {
        name: 'Dat phat',
        text: 'Nhập nhiệu'
    }


    render(){
        return(
            <View>
                <Text>{this.state.name}</Text>
                 <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) =>this.setState({text})}
                    value={this.state.text}
                    />
                <TouchableOpacity>
                    <Text>Chane color</Text>
                </TouchableOpacity>
                <Button
                    title="Press me"
                    // onPress={() => Alert.alert('Simple Button pressed')}
                    // onPress={() => {this.clickme()}}
                    />
            </View>
        );
    }
}

