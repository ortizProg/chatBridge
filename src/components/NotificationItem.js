import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import {formatNotificationDate} from "../utils/dateUtils";
import { GLOBAL } from "../styles/styles";

export default function NotificationItem({ item }) {
  return (
    <TouchableOpacity
      style={[GLOBAL.card, styles.container]}
      activeOpacity={0.7}
    >
      <Image
        source={require("../assets/images/notification.jpg")}
        style={styles.avatar}
      />

      <View style={styles.content}>

        <Text style={[styles.title, GLOBAL.text]} numberOfLines={2}>
          {item.title}
        </Text>

        {item.body && (
          <Text
            style={[styles.description, GLOBAL.textSecondary]}
            numberOfLines={2}
          >
            {item.body}
          </Text>
        )}
        <Text
          style={[styles.date, GLOBAL.textSecondary]}
          numberOfLines={2}
        >
          {formatNotificationDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2a2a2a",
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  author: {
    fontSize: 12,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    lineHeight: 18,
  },
});