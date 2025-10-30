import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";


import { COLORS, GLOBAL } from "../styles/styles";

export default function MenuItem({ item }) {
  return (
    <TouchableOpacity onPress={item.onPress}>
      <View style={styles.container}>
        {
          item?.icon ? 
          <Ionicons
            name={item?.icon}
            size={28}
            color='#fff'
          /> : null
        }
        <Text style={[GLOBAL.text, styles.text]}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#fff',
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: 'center',
    gap: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: 600
  }
});
