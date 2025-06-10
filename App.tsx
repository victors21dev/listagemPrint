import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/pages/login/loginScreen";
import RegisterScreen from "./app/pages/register/registerScreen";
import Tabs from "./app/routes/TabRoutes";
import AuthLoadingScreen from "./app/pages/auth/authLoadingScreen";
import CompleteProfileScreen from "./app/pages/completeProfile/completeProfileScreen";
import { CadastroProvider } from "./app/context/cadastroContext";
import { UserProvider } from "./app/context/userContext";

export type RootStackParamList = {
  AuthLoading: undefined;
  Login: undefined;
  Home: undefined;
  Registro: undefined;
  Tabs: undefined;
  CompleteProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <CadastroProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="AuthLoading"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegisterScreen} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CadastroProvider>
    </UserProvider>
  );
}
