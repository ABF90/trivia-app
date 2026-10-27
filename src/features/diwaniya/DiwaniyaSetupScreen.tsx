"use client";

import { useRouter } from "next/navigation";
import { Button, Screen, ScreenHeader, SegmentedControl, Spacer } from "@/components/ui";
import { DIWANIYA_CONFIG } from "@/config/game";
import { toArabicDigits } from "@/lib/arabic";
import { PlayerField } from "./components/PlayerField";
import { useDiwaniya } from "./DiwaniyaProvider";
import { defaultPlayerName } from "./model";
import styles from "./DiwaniyaSetupScreen.module.css";

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

      <p className={styles.intro}>تلفون واحد يتمرر بين الربع. كل واحد يجاوب سؤاله، واللي يجمع أكثر يفوز.</p>

      <section className={styles.players}>
        <h2 className={styles.sectionTitle}>
          اللاعبين ({toArabicDigits(players.length)}) · اكتب الأسماء، أو خلّها
        </h2>
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
          <Button variant="dashed" size="sm" icon="plus" iconPosition="start" onClick={addPlayer}>
            أضف لاعب
          </Button>
        )}
      </section>

      <div className={styles.count}>
        <SegmentedControl
          legend="كم سؤال لكل لاعب؟"
          options={DIWANIYA_CONFIG.questionCounts}
          value={state.questionsPerPlayer}
          onChange={setQuestionCount}
          format={toArabicDigits}
        />
      </div>

      <Spacer />

      <Button size="lg" onClick={begin}>
        يلا نبدأ
      </Button>
    </Screen>
  );
}
