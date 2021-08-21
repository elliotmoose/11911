import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MemoryListScreen from './src/screens/memory-list-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemoryScreen from './src/screens/memory-screen';


const RootStack = createNativeStackNavigator();
// const Bible = require('')
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
          <RootStack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: 'white'}}}>
            <RootStack.Group>
              <RootStack.Screen name="Memory" component={MemoryScreen}/>
            </RootStack.Group>
            <RootStack.Group screenOptions={{ presentation: 'modal' }}>
              <RootStack.Screen name="MemoryList" component={MemoryListScreen}/>
            </RootStack.Group>
          </RootStack.Navigator>      
      </NavigationContainer>      
    </SafeAreaProvider>
  );
};

export default App;
