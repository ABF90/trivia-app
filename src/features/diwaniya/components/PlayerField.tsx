import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Avatar, avatarColorAt, Icon } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { colors, fonts, radius, rtl } from "@/theme";

interface PlayerFieldProps {
  index: number;
  name: string;
  placeholder: string;
  canRemove: boolean;
  onRename: (name: string) => void;
  onRemove: () => void;
}

export function PlayerField({ index, name, placeholder, canRemove, onRename, onRemove }: PlayerFieldProps) {
  return (
    <View style={styles.field}>
      <Avatar label={toArabicDigits(index + 1)} color={avatarColorAt(index)} />
      <TextInput
        style={styles.input}
        value={name}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        maxLength={20}
        aria-label={`اسم اللاعب ${toArabicDigits(index + 1)}`}
        onChangeText={onRename}
        returnKeyType="done"
      />
      {canRemove && (
        <Pressable
          role="button"
          aria-label={`احذف ${name || placeholder}`}
          hitSlop={6}
          onPress={onRemove}
          style={({ pressed }) => [styles.remove, pressed && styles.removePressed]}
        >
          <Icon name="close" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: rtl.row,
    alignItems: "center",
    gap: 12,
    height: 56,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 17,
    textAlign: rtl.textStart,
    writingDirection: "rtl",
    paddingVertical: 0,
  },
  remove: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  removePressed: { backgroundColor: "rgba(255,77,109,0.10)" },
});
