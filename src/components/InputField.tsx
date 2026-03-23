import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  Icon: LucideIcon;
  onPress?: () => void;
  editable?: boolean;
  /** Use light variant (white background, dark text) for forms on light surfaces */
  light?: boolean;
  style?: ViewStyle;
  secureTextEntry?: boolean;
}

export default function InputField({
  placeholder,
  value,
  onChangeText,
  Icon,
  onPress,
  editable = true,
  light = false,
  style,
  secureTextEntry = false,
}: InputFieldProps) {
  const content = (
    <View style={[styles.container, light && styles.containerLight, style]}>
      <Icon size={18} color={light ? '#49C593' : '#49C593'} strokeWidth={2} />
      <TextInput
        style={[styles.input, light && styles.inputLight]}
        placeholder={placeholder}
        placeholderTextColor={light ? '#AAAAAA' : '#666'}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    padding: 0,
  },
  inputLight: {
    color: '#1A1A1A',
  },
});
