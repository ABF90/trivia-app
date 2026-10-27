import { Button, Logo, Spacer } from "@/components/ui";
import styles from "./InvalidChallenge.module.css";

export function InvalidChallenge() {
  return (
    <>
      <div className={styles.box}>
        <Logo size={72} />
        <h1 className={styles.title}>الرابط خربان</h1>
        <p className={styles.body}>ما قدرنا نقرا التحدي. اطلب من ربعك يرسله مرة ثانية.</p>
      </div>
      <Spacer />
      <Button size="lg" href="/">
        روح للرئيسية
      </Button>
    </>
  );
}
