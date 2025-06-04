// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/pages/login/loginScreen";
import RegisterScreen from "./app/pages/register/registerScreen";
import TabRoutes from "./app/routes/TabRoutes";
import { CadastroProvider } from "./app/context/cadastroContext";

export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CadastroProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegisterScreen} />
          <Stack.Screen name="Tabs" component={TabRoutes} />
        </Stack.Navigator>
      </NavigationContainer>
    </CadastroProvider>
  );
}
