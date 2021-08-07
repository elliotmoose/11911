import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MemoryScreen from './screens/memory-screen';

// const Bible = require('')
const App = () => {
  return (
    <SafeAreaProvider>
      <MemoryScreen/>
    </SafeAreaProvider>
  );
};

export default App;
