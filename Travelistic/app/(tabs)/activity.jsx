import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { Fonts } from "@/constants/theme";



export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>

      <Text style={styles.subtitle}>Friends going:</Text>
      {/* Example usage of Friend if it's a component */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: Fonts.medium,
  },
});
