import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { Input, Button } from 'react-native-elements';
import { ListItem } from'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglistdb.db');
/*const db = SQLite.openDatabase('coursedb.db');*/

export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists products (id integer primary key not null, amount text, product text);');
    }, null, updateList); 
  }, []);

// Save product
const saveItem = () => {
  db.transaction(tx => {
      tx.executeSql('insert into products (amount, product) values (?, ?);', [amount, product]);    
    }, null, updateList
    
  )
  setAmount('');
  setProduct('');
}
// Update shoppinglist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from products;', [], (_, { rows }) =>
        setProducts(rows._array)
      ); 
    });
  }

  // Delete 
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from products where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <Icon type="material" color="red" name="delete" onPress={() => deleteItem(item.id)} />
    </ListItem>
    )

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  

  return (
    <View style={styles.container}>
      <Header  
        leftComponent={{ icon: 'menu'}} 
        centerComponent={{ text: 'SHOPPING LIST' }}  
        rightComponent={{ icon: 'home' }}
      />
      
      <Input   
        placeholder='Product' 
        label='PRODUCT'  
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <Input   
        placeholder='Amount' 
        label='AMOUNT'  
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button raised icon={{name: 'save'}} 
        onPress={saveItem}
        title="SAVE" 
      />
      <FlatList  
        data={products}  
        renderItem={renderItem}  
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={listSeparator} 
      /> 
      <StatusBar style="auto" />
    </View>
      
        
    );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
});
