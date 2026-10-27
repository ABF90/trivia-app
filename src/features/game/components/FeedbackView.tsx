import { StyleSheet, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { AnswerOption, Button, FactCard, QuestionCard, Spacer, Text, type AnswerState } from "@/components/ui";
import { colors } from "@/theme";
import type { AnswerRecord, Question } from "../types";

interface FeedbackViewProps {
  question: Question;
  answer: AnswerRecord;
  nextLabel?: string;
  disabled?: boolean;
  onNext: () => void;
}

/** Shown after a wrong answer or timeout: reveals the right answer and a fact. */
export function FeedbackView({ question, answer, nextLabel = "التالي", disabled, onNext }: FeedbackViewProps) {
  const timedOut = answer.selected === null;

  const stateFor = (i: number): { state: AnswerState; tag?: string } => {
    if (i === question.answer) return { state: "correct", tag: "الجواب الصح" };
    if (i === answer.selected) return { state: "wrong", tag: "جوابك" };
    return { state: "dimmed" };
  };

  return (
    <>
      <Animated.View entering={ZoomIn.duration(400)} style={styles.headline}>
        <Text weight="display" size={36} lineHeight={52} color={colors.danger} align="center" aria-live="polite">
          {timedOut ? "خلص الوقت!" : "مو هالمرة!"}
        </Text>
      </Animated.View>

      <QuestionCard prompt={question.prompt} compact />

      <View style={styles.options}>
        {question.options.map((label, i) => {
          const { state, tag } = stateFor(i);
          return <AnswerOption key={i} label={label} state={state} tag={tag} compact animateIn={false} />;
        })}
      </View>

      <View style={styles.fact}>
        <FactCard>{question.fact}</FactCard>
      </View>

      <Spacer />

      <Button size="lg" flat icon="chevronForward" onPress={onNext} disabled={disabled}>
        {nextLabel}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: 14, marginBottom: 8 },
  options: { marginTop: 16, gap: 10 },
  fact: { marginTop: 16 },
});
