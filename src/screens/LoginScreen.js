import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { useAuth } from "../contexts/authContext";

import { COLORS } from '../styles/styles';

export default function LoginScreen({navigation}) {
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.navigate('Home');
    }
  }, [user, navigation]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [errors, setErrors] = useState({});

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Ingresa tu correo";
    if (!password.trim()) newErrors.password = "Ingresa tu contraseña";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
        await signIn(email, password);
    } catch (err) {
      setErrors({
        ...newErrors,
        global: err?.message || "Correo o contraseña incorrectos",
      });
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* BRAND / HEADER */}
          <View style={styles.brandContainer}>
            <Image 
              source={require("../assets/images/Logo.png")} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.brandSubtitle}>Tu lugar de confianza</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            {/* EMAIL */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Correo</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.email && styles.inputErrorBorder,
                ]}
              >
                {/* "icono" fake con solo texto */}
                <Text
                  style={[
                    styles.leftIcon,
                    errors.email && styles.leftIconError,
                  ]}
                >
                  @
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="tucorreo@gmail.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Contraseña</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.password && styles.inputErrorBorder,
                ]}
              >
                <Text
                  style={[
                    styles.leftIcon,
                    errors.password && styles.leftIconError,
                  ]}
                >
                  *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />

                {/* toggle ver/ocultar */}
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.rightActionBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.rightActionText}>
                    {passwordVisible ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>

              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => navigation?.navigate?.("ForgotPassword")}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Error global */}
            {errors.global && (
              <Text style={styles.globalError}>{errors.global}</Text>
            )}

            {/* Login button */}
            <TouchableOpacity
              style={[styles.loginBtn, !canSubmit && styles.loginBtnDisabled]}
              disabled={!canSubmit}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>Ingresar</Text>
            </TouchableOpacity>

            {/* Divider */}
            {/* <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View> */}

            {/* Botones sociales "fake" sin SDKs */}
            {/* <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialBtnIcon}>f</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialBtnIcon}>{`{}`}</Text>
                <Text style={styles.socialText}>Github</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Register CTA */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.("Register")}>
              <Text style={styles.registerCta}> Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const CARD_BG = "#1f1f1f";
const TEXT_MAIN = "#fff";
const TEXT_DIM = "#94a3b8";
const ERROR = "#f87171";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop:
      64 + (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0),
    paddingBottom: 40,
  },

  // HEADER / BRAND
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    color: TEXT_MAIN,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  brandName: {
    color: TEXT_MAIN,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    color: TEXT_DIM,
    fontSize: 14,
    marginTop: 4,
  },

  // CARD
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 20,

    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 24 },
    // elevación Android
    elevation: 16,
  },

  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    color: "#e2e8f0",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },

  inputContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 52,
  },

  inputErrorBorder: {
    borderColor: ERROR,
  },

  leftIcon: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
    paddingRight: 8,
  },
  leftIconError: {
    color: ERROR,
  },

  input: {
    flex: 1,
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 0,
  },

  rightActionBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  rightActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_DIM,
  },

  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 16,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
  },

  errorText: {
    color: ERROR,
    fontSize: 13,
    marginTop: 6,
    fontWeight: "400",
  },

  globalError: {
    color: ERROR,
    backgroundColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.4)",
    borderWidth: 1,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },

  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },

    elevation: 8,
  },
  loginBtnDisabled: {
    opacity: 0.4,
  },
  loginBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(226,232,240,0.07)",
  },
  dividerText: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 12,
    letterSpacing: -0.2,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  socialBtnIcon: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "700",
    marginRight: 6,
  },
  socialText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: TEXT_DIM,
    fontSize: 14,
  },
  registerCta: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  logo: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  }
});
