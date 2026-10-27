import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Screen, ScreenHeader, SegmentedControl, Spacer, Text } from "@/components/ui";
import { DIWANIYA_CONFIG } from "@/config/game";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import { PlayerField } from "./components/PlayerField";
import { useDiwaniya } from "./DiwaniyaProvider";
import { defaultPlayerName } from "./model";

export function DiwaniyaSetupScreen() {
  const router = useRouter();
  const i18n = useI18n();
  const { t, n } = i18n;
  const { state, addPlayer, removePlayer, renamePlayer, setQuestionCount, start } = useDiwaniya();
  const { players } = state;
  const canRemove = players.length > DIWANIYA_CONFIG.minPlayers;

  const begin = () => {
    start();
    router.push("/diwaniya/play");
  };

  return (
    <Screen>
      <ScreenHeader title={t.diwaniya} backHref="/" />

      <Text size={16} lineHeight={27} color={colors.textSecondary} style={styles.intro}>
        {t.diwaniyaIntro}
      </Text>

      <View style={styles.players}>
        <Text weight="heavy" size={15} color={colors.textMuted}>
          {t.playersHeading(n(players.length))}
        </Text>
        {players.map((player, index) => (
          <PlayerField
            key={player.id}
            index={index}
            name={player.name}
            placeholder={defaultPlayerName(i18n, index)}
            canRemove={canRemove}
            onRename={(name) => renamePlayer(player.id, name)}
            onRemove={() => removePlayer(player.id)}
          />
        ))}
        {players.length < DIWANIYA_CONFIG.maxPlayers && (
          <Button variant="dashed" size="sm" icon="plus" iconPosition="start" onPress={addPlayer}>
            {t.addPlayer}
          </Button>
        )}
      </View>

      <View style={styles.count}>
        <SegmentedControl
          legend={t.questionsPerPlayer}
          options={DIWANIYA_CONFIG.questionCounts}
          value={state.questionsPerPlayer}
          onChange={setQuestionCount}
          format={n}
        />
      </View>

      <Spacer />

      <Button size="lg" onPress={begin}>
        {t.letsGo}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: 20 },
  players: { marginTop: 20, gap: 10 },
  count: { marginTop: 24 },
});
