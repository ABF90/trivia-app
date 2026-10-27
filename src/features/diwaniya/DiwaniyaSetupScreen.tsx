import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Screen, ScreenHeader, SegmentedControl, Spacer, Text } from "@/components/ui";
import { DIWANIYA_CONFIG } from "@/config/game";
import { toArabicDigits } from "@/lib/arabic";
import { colors } from "@/theme";
import { PlayerField } from "./components/PlayerField";
import { useDiwaniya } from "./DiwaniyaProvider";
import { defaultPlayerName } from "./model";

export function DiwaniyaSetupScreen() {
  const router = useRouter();
  const { state, addPlayer, removePlayer, renamePlayer, setQuestionCount, start } = useDiwaniya();
  const { players } = state;
  const canRemove = players.length > DIWANIYA_CONFIG.minPlayers;

  const begin = () => {
    start();
    router.push("/diwaniya/play");
  };

  return (
    <Screen>
      <ScreenHeader title="وضع الديوانية" backHref="/" />

      <Text size={16} lineHeight={27} color={colors.textSecondary} style={styles.intro}>
        تلفون واحد يتمرر بين الربع. كل واحد يجاوب سؤاله، واللي يجمع أكثر يفوز.
      </Text>

      <View style={styles.players}>
        <Text weight="heavy" size={15} color={colors.textMuted}>
          {`اللاعبين (${toArabicDigits(players.length)}) · اكتب الأسماء، أو خلّها`}
        </Text>
        {players.map((player, index) => (
          <PlayerField
            key={player.id}
            index={index}
            name={player.name}
            placeholder={defaultPlayerName(index)}
            canRemove={canRemove}
            onRename={(name) => renamePlayer(player.id, name)}
            onRemove={() => removePlayer(player.id)}
          />
        ))}
        {players.length < DIWANIYA_CONFIG.maxPlayers && (
          <Button variant="dashed" size="sm" icon="plus" iconPosition="start" onPress={addPlayer}>
            أضف لاعب
          </Button>
        )}
      </View>

      <View style={styles.count}>
        <SegmentedControl
          legend="كم سؤال لكل لاعب؟"
          options={DIWANIYA_CONFIG.questionCounts}
          value={state.questionsPerPlayer}
          onChange={setQuestionCount}
          format={toArabicDigits}
        />
      </View>

      <Spacer />

      <Button size="lg" onPress={begin}>
        يلا نبدأ
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: 20 },
  players: { marginTop: 20, gap: 10 },
  count: { marginTop: 24 },
});
