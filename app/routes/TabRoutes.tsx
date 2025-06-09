// app/routes/TabRoutes.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../pages/home/homeScreen";
import UserScreen from "../pages/user/userScreen";
import CadastroScreen from "../pages/cadastro/cadastroScreen";
import { Home, User, PlusCircle } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#005CB3",
        tabBarInactiveTintColor: "#A8A8A8",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: 80,
          paddingBottom: 6,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Cadastro"
        component={CadastroScreen}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
}
