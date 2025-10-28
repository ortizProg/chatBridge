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
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../contexts/authContext";
import { COLORS } from "../styles/styles";


export default function SignUpScreen({ navigation }) {
  const { user, signUp } = useAuth();
  useEffect(() => {
    // si user existe => ya está logueado => vamos al Home
    if (user) {
      navigation.navigate("Home");
    }
  }, [user, navigation]);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [errors, setErrors] = useState({});

  const canSubmit =
    email.trim().length > 0 &&
    pass1.trim().length > 0 &&
    pass2.trim().length > 0;

  let submitted = false;

  const handleSubmit = async () => {
    
    if(submitted) return;
    submitted = true;

    try {
      const newErrors = {};
  
      if (!email.trim()) newErrors.email = "Ingresa tu correo";
      if (!pass1.trim()) newErrors.pass1 = "Ingresa una contraseña";
      if (!pass2.trim()) newErrors.pass2 = "Confirma tu contraseña";
  
      if (pass1.trim() && pass1.trim().length < 6) {
        newErrors.pass1 = "Mínimo 6 caracteres";
      }
  
      if (pass1.trim() && pass2.trim() && pass1.trim() !== pass2.trim()) {
        newErrors.pass2 = "Las contraseñas no coinciden";
      }
  
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length > 0) return;
  
      try {
        await signUp?.(email.trim(), pass1.trim(), userName.trim());
      } catch (err) {
        setErrors({
          ...newErrors,
          global: err?.message || "No se pudo crear la cuenta",
        });
      }
    } finally {
      submitted = false;
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
          <View style={styles.brandContainer}>
            <Image 
              source={require("../assets/images/Logo.png")} 
              style={styles.logo} 
              resizeMode="contain"
            />

            <Text style={styles.brandName}>Crea tu cuenta</Text>
            <Text style={styles.brandSubtitle}>Es rápido y gratis</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldWrapper}>
              {/* USERNAME */}
              <Text style={styles.label}>Nombre de usuario</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.userName && styles.inputErrorBorder,
                ]}
              >
                <Ionicons 
                  name="person-outline"
                  color={COLORS.textSecondary || '#aaa'}
                  style={[
                    styles.leftIcon,
                    errors.email && styles.leftIconError,
                  ]}
                /> 

                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  placeholderTextColor="#64748b"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                />
              </View>

              {errors.email && (
                <Text style={styles.errorText}>{errors.userName}</Text>
              )}
            </View>
            {/* EMAIL */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Correo</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.email && styles.inputErrorBorder,
                ]}
              >
                <Ionicons 
                  name="mail-outline"
                  color={COLORS.textSecondary || '#aaa'}
                  style={[
                    styles.leftIcon,
                    errors.email && styles.leftIconError,
                  ]}
                /> 

                <TextInput
                  style={styles.input}
                  placeholder="tucorreo@empresa.com"
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
                  errors.pass1 && styles.inputErrorBorder,
                ]}
              >
                <Ionicons 
                  name="lock-closed-outline"
                  color={COLORS.textSecondary || '#aaa'}
                  style={[
                    styles.leftIcon,
                    errors.pass1 && styles.leftIconError,
                  ]}
                /> 

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showPass1}
                  value={pass1}
                  onChangeText={setPass1}
                />

                <TouchableOpacity
                  onPress={() => setShowPass1(!showPass1)}
                  style={styles.rightActionBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.rightActionText}>
                    {
                    showPass1 ? 
                    <Ionicons 
                      name="eye-outline"
                      color={COLORS.textSecondary || '#aaa'}
                      style={[
                        styles.rightActionText,
                      ]}
                    /> 
                    : 
                    <Ionicons 
                      name="eye-off-outline"
                      color={COLORS.textSecondary || '#aaa'}
                      style={[
                        styles.rightActionText,
                      ]}
                    /> 
                  }
                  </Text>
                </TouchableOpacity>
              </View>

              {errors.pass1 && (
                <Text style={styles.errorText}>{errors.pass1}</Text>
              )}
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Confirmar contraseña</Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.pass2 && styles.inputErrorBorder,
                ]}
              >
                <Ionicons 
                  name="lock-closed-outline"
                  color={COLORS.textSecondary || '#aaa'}
                  style={[
                    styles.leftIcon,
                    errors.pass2 && styles.leftIconError,
                  ]}
                /> 

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showPass2}
                  value={pass2}
                  onChangeText={setPass2}
                />

                <TouchableOpacity
                  onPress={() => setShowPass2(!showPass2)}
                  style={styles.rightActionBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {
                    showPass2 ? 
                    <Ionicons 
                      name="eye-outline"
                      color={COLORS.textSecondary || '#aaa'}
                      style={[
                        styles.rightActionText,
                      ]}
                    /> 
                    : 
                    <Ionicons 
                      name="eye-off-outline"
                      color={COLORS.textSecondary || '#aaa'}
                      style={[
                        styles.rightActionText,
                      ]}
                    /> 
                  }
                </TouchableOpacity>
              </View>

              {errors.pass2 && (
                <Text style={styles.errorText}>{errors.pass2}</Text>
              )}
            </View>

            {/* GLOBAL ERROR */}
            {errors.global && (
              <Text style={styles.globalError}>{errors.global}</Text>
            )}

            {/* CTA CREATE ACCOUNT */}
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !canSubmit && styles.primaryBtnDisabled,
              ]}
              disabled={!canSubmit}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.primaryBtnText}>Crear cuenta</Text>
            </TouchableOpacity>

            {/* Already have account */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={() => navigation?.navigate?.("Login")}>
                <Text style={styles.loginCta}> Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Legal mini-footnote */}
          <View style={styles.termsWrapper}>
            <Text style={styles.termsText}>
              Al continuar aceptas nuestros Términos y Política de Privacidad.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Tokens de color compartidos con Login
const CARD_BG = "#1f1f1f"; // card
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

  // Header
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
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  brandName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    color: TEXT_DIM,
    fontSize: 14,
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 24 },
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
    color: COLORS.text,
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

  primaryBtn: {
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
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: TEXT_DIM,
    fontSize: 14,
  },
  loginCta: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  termsWrapper: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  termsText: {
    color: TEXT_DIM,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  logo: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  }
});
