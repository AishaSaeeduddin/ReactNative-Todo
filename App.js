import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';
import { Container, Content, Form, Input, Button, Header, Item, Icon, ListItem , List} from 'native-base';
import * as Firebase from 'firebase';
const config = {
  apiKey: "AIzaSyAKJgGCb9XBl51zwUI-hWvw9CqQXMgxYDE",
  authDomain: "todowithfb.firebaseapp.com",
  databaseURL: "https://todowithfb.firebaseio.com",
  projectId: "todowithfb",
  storageBucket: "todowithfb.appspot.com",
  messagingSenderId: "703398801177"
};

Firebase.initializeApp(config);  

var data=[];
export default class App extends React.Component {
constructor(props){
  super(props);
   this.ds= new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 !== r2})

   this.state={
     listViewData: data,
     newContact: ''
   }
}



componentDidMount(){
  var that= this;
  Firebase.database().ref('/todo').on('child_added', function (data){
    var newData = [...that.state.listViewData];
    newData.push(data);
    that.setState({listViewData : newData, newContact:''})
  })

}
  async componentWillMount() {


    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
  }

  addRow(data) {
    Firebase.database().ref('/todo').push({name: data})
  }

  async deleteRow(secId, rowId , rowMap ,data){
    await Firebase.database().ref('todo/'+ data.key).set(null);
    rowMap[`${secId}${rowId}`].props.closeRow();

    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({listViewData:newData})
  }

  showInformation(){}
  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header} >
        <Text style={styles.head}>ToDo With Firebase</Text>
          
        </Header>
        <Content>
          <Item success>
          <Input style={styles.input}
            placeholder="Enter Todo"
            onChangeText={ (newContact) => this.setState({ newContact })}
          />
          <Icon name='checkmark-circle' />
          </Item>
          <Button info large full onPress={() => this.addRow(this.state.newContact)}>
            <Icon name='add' />
          </Button>
        </Content>

        <Content>
          <List
          enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem >
                <Text style={styles.input}>{data.val().name}</Text>
              </ListItem>
            }

            
            renderRightHiddenRow={(data , secId, rowId , rowMap) => 
              <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap , data)}>
                <Icon name='trash'/>
              </Button>
            }

            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5
  },
  input: {
    fontSize: 20,
  },
  header: {
    marginTop: StatusBar.currentHeight,
    marginBottom: 2
  },
  head:{
    color: '#fff',
    fontSize: 22,
  }
});
