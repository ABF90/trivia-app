import { StyleSheet, View } from "react-native";
import { AnswerOption, QuestionCard, Spacer, TimerRing, type AnswerState } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { getCategory } from "@/data/categories";
import { useI18n } from "@/i18n";

import type { GameState } from "../model/gameReducer";
import type { AnswerRecord, Question } from "../types";
import { LifelineButton } from "./LifelineButton";

interface QuestionViewProps {
  state: GameState;
  question: Question;
  lastAnswer?: AnswerRecord;
  allowLifeline: boolean;
  onAnswer: (option: number) => void;
  onLifeline: () => void;
}

function optionState(i: number, state: GameState, question: Question, lastAnswer?: AnswerRecord): AnswerState {
  if (lastAnswer && lastAnswer.selected === i) return lastAnswer.correct ? "correct" : "wrong";
  if (state.removed.includes(i)) return "removed";
  if (lastAnswer && i === question.answer) return "correct";
  return "idle";
}

export function QuestionView({ state, question, lastAnswer, allowLifeline, onAnswer, onLifeline }: QuestionViewProps) {
  const { pick, lang, t } = useI18n();
  const english = lang === "ar" && question.untranslated ? "en" : undefined;
  const answering = state.phase === "answering";
  const warning = answering && state.timeLeft <= GAME_CONFIG.warningSeconds;

  return (
    <>
      {/* Timer centred, 50/50 at the reading end (left), away from the answers. */}
      <View style={styles.timerRow}>
        <View style={styles.side} />
        <TimerRing
          timeLeft={state.timeLeft}
          total={state.secondsPerQuestion}
          warningAt={GAME_CONFIG.warningSeconds}
          paused={state.paused || !answering}
        />
        <View style={[styles.side, styles.sideEnd]}>
          {allowLifeline && <LifelineButton used={state.lifelineUsed} disabled={!answering} onUse={onLifeline} />}
        </View>
      </View>

      {/* key remounts the card so every question gets its entry animation */}
      <View style={styles.card} key={question.id}>
        <QuestionCard
          prompt={pick(question.prompt)}
          category={pick(getCategory(question.category).label)}
          warning={warning}
          textLang={english}
          note={english && t.untranslatedBadge}
          noteLabel={english && t.untranslatedLabel}
        />
      </View>

      <Spacer />

      <View style={styles.options} key={`${question.id}-options`}>
        {question.options.map((label, i) => (
          <AnswerOption
            key={i}
            index={i}
            label={pick(label)}
            textLang={english}
            state={optionState(i, state, question, lastAnswer)}
            disabled={!answering}
            onSelect={() => onAnswer(i)}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  timerRow: { flexDirection: "row", alignItems: "center", marginTop: 28 },
  side: { flex: 1 },
  sideEnd: { alignItems: "flex-end" },
  card: { marginTop: 20 },
  options: { gap: 12 },
});
