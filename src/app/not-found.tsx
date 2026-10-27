import { Button, Logo, Screen, Spacer } from "@/components/ui";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <Screen background="glowTop">
      <div className={styles.box}>
        <Logo size={80} />
        <h1 className={styles.title}>تسلل!</h1>
        <p className={styles.body}>هالصفحة مو موجودة.</p>
      </div>
      <Spacer />
      <Button size="lg" href="/">
        روح للرئيسية
      </Button>
    </Screen>
  );
}
