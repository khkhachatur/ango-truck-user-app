import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Load } from '../lib/supabase';
import TrackingScreen from '../screens/TrackingScreen';
import ChatScreen from '../screens/ChatScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthScreen from '../screens/AuthScreen';
import MapHomeScreen from '../screens/MapHomeScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import CreateOrderScreen from '../screens/CreateOrderScreen';
import ShippingHistoryScreen from '../screens/ShippingHistoryScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import DiscountedRoutesScreen from '../screens/DiscountedRoutesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MyCompanyScreen from '../screens/MyCompanyScreen';
import AddressesScreen from '../screens/AddressesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import SupportScreen from '../screens/SupportScreen';
import InformationScreen from '../screens/InformationScreen';

export type RootStackParamList = {
  Auth: undefined;
  MapHome: undefined;
  OrderDetails: undefined;
  CreateOrder: undefined;
  ShippingHistory: undefined;
  LiveTracking: { load?: Load };
  Tracking: { load: Load };
  Chat: { load_id: string; receiver_id: string };
  DiscountedRoutes: undefined;
  Settings: undefined;
  MyCompany: undefined;
  Addresses: undefined;
  History: undefined;
  Favorites: undefined;
  PaymentMethods: undefined;
  Support: undefined;
  Information: undefined;
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
          <Stack.Screen name="Auth"              component={AuthScreen} />
          <Stack.Screen name="MapHome"           component={MapHomeScreen} />
          <Stack.Screen name="OrderDetails"      component={OrderDetailsScreen} />
          <Stack.Screen name="CreateOrder"       component={CreateOrderScreen} />
          <Stack.Screen name="ShippingHistory"   component={ShippingHistoryScreen} />
          <Stack.Screen name="LiveTracking"      component={LiveTrackingScreen} />
          <Stack.Screen name="DiscountedRoutes"  component={DiscountedRoutesScreen} />
          <Stack.Screen name="Settings"          component={SettingsScreen} />
          <Stack.Screen name="MyCompany"         component={MyCompanyScreen} />
          <Stack.Screen name="Addresses"         component={AddressesScreen} />
          <Stack.Screen name="History"           component={HistoryScreen} />
          <Stack.Screen name="Favorites"         component={FavoritesScreen} />
          <Stack.Screen name="PaymentMethods"    component={PaymentMethodsScreen} />
          <Stack.Screen name="Support"           component={SupportScreen} />
          <Stack.Screen name="Information"       component={InformationScreen} />
          <Stack.Screen name="Tracking"          component={TrackingScreen} />
          <Stack.Screen name="Chat"              component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
