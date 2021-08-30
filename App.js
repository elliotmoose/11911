import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MemoryListScreen from './src/screens/memory-list-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemoryScreen from './src/screens/memory-screen';
import AddVerseChunkScreen from './src/screens/add-verse-chunk-screen';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import MemoryPacksScreen from './src/screens/memory-packs-screen';
import AddMemoryPackScreen from './src/screens/add-memory-pack-screen';

const RootStack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }}>
            <RootStack.Group>
              <RootStack.Screen name="Memory" component={MemoryScreen} />
            </RootStack.Group>
            <RootStack.Group screenOptions={{ presentation: 'modal' }}>
              <RootStack.Screen name="MemoryList" component={MemoryListScreen} />
              <RootStack.Screen name="AddVerseChunk" component={AddVerseChunkScreen} />
              <RootStack.Screen name="MemoryPacks" component={MemoryPacksScreen} />
              <RootStack.Screen name="AddMemoryPack" component={AddMemoryPackScreen} />
            </RootStack.Group>
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
