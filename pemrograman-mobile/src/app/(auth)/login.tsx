import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "expo-router";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await authService.login(data);
      setAuth(res.user, res.token);
      router.replace("/(main)/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center text-primary">Smart Task Planner</Text>
      <View className="mb-4">
        <Text className="mb-2 text-gray-600">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 p-3 rounded-lg"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <Text className="text-danger mt-1">{errors.email.message}</Text>}
      </View>
      <View className="mb-6">
        <Text className="mb-2 text-gray-600">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 p-3 rounded-lg"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && <Text className="text-danger mt-1">{errors.password.message}</Text>}
      </View>
      <TouchableOpacity
        className="bg-primary p-4 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/register")} className="mt-4">
        <Text className="text-center text-primary">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
