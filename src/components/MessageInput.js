import React, { useState, useRef } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL } from "../styles/styles";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (message.trim()) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      onSend(message);
      setMessage("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, GLOBAL.text]}
          placeholder="Mensaje..."
          placeholderTextColor={COLORS.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            message.trim() && styles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
          activeOpacity={0.7}
        >
          <Ionicons
            name={message.trim() ? "send" : "send-outline"}
            size={22}
            color={message.trim() ? "#fff" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1f1f1f",
    borderRadius: 25,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  input: {
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: COLORS.accent,
  },
});