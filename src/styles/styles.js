import { StyleSheet } from "react-native";

export const COLORS = {
  background: "#121212",
  primary: "#007bff",
  accent: "#00d4ff",
  text: "#ffffff",
  textSecondary: "#bbbbbb",
  border: "#1f1f1f",
  bubbleRight: "#1a2f4d",      
  bubbleLeft: "#1f1f1f",       
  bubbleRightBorder: "#2d5a8f", 
  bubbleLeftBorder: "#333333",  
};

export const GLOBAL = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  tab: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  tabActive: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  text: {
    color: COLORS.text,
  },
  textSecondary: {
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
});