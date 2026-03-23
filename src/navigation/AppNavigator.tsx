import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthScreen from '../screens/AuthScreen';
import MapHomeScreen from '../screens/MapHomeScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import CreateOrderScreen from '../screens/CreateOrderScreen';

export type RootStackParamList = {
  Auth: undefined;
  MapHome: undefined;
  OrderDetails: undefined;
  CreateOrder: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="MapHome" component={MapHomeScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
