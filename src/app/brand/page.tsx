import type { Metadata } from "next";
import { AnswerOption, Logo } from "@/components/ui";
import styles from "./brand.module.css";

export const metadata: Metadata = { title: "الهوية" };

const SWATCHES = [
  { name: "ليل الملعب", token: "--color-bg", hex: "#0A1020", role: "خلفية" },
  { name: "الكروت", token: "--color-surface", hex: "#16213A", role: "سطوح" },
  { name: "الأزرق", token: "--color-primary", hex: "#1F6BFF", role: "أساسي" },
  { name: "النص", token: "--color-text", hex: "#F4F6FA" },
  { name: "صح ✓", token: "--color-success", hex: "#12C7A5" },
  { name: "غلط ✕", token: "--color-danger", hex: "#FF4D6D" },
  { name: "آخر ٥ ثواني", token: "--color-warning", hex: "#FFB020" },
];

export default function BrandPage() {
  return (
    <main className={styles.page}>
      <section className={styles.identity}>
        <Logo size={180} className={styles.logo} />
        <div>
          <p className={styles.wordmark}>صفارة</p>
          <p className={styles.latin} dir="ltr">
            SFARA
          </p>
        </div>
        <p className={styles.note}>صفارة حكم بيضاء على الأزرق، وشريط صغير بألوان العلم. بدون شعارات أندية أو شعار الدولة.</p>
      </section>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.heading}>الألوان</h2>
          <div className={styles.swatches}>
            {SWATCHES.map((s) => (
              <div key={s.token} className={styles.swatch}>
                <div className={styles.chip} style={{ background: `var(${s.token})` }} />
                <b className={styles.swatchName}>{s.name}</b>
                <span className={styles.swatchMeta} dir="ltr">
                  {s.hex}
                  {s.role && ` · ${s.role}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.type}>
          <div className={styles.typeCard}>
            <span className={styles.typeMeta} dir="ltr">
              Lalezar · العناوين والأرقام
            </span>
            <span className={styles.display}>كفو! ٤ / ٥</span>
          </div>
          <div className={styles.typeCard}>
            <span className={styles.typeMeta} dir="ltr">
              Cairo · الأسئلة والأزرار
            </span>
            <span className={styles.bodySample}>في أي سنة شارك الأزرق في كأس العالم؟</span>
            <span className={styles.bodyNote}>نص عادي ١٦، والأسئلة ٢٢ عريض</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>حالات زر الجواب</h2>
          <div className={styles.states}>
            <AnswerOption label="عادي" compact />
            <AnswerOption label="صح" state="correct" compact />
            <AnswerOption label="غلط" state="wrong" compact />
            <AnswerOption label="انحذف (٥٠/٥٠)" state="removed" compact />
          </div>
        </section>
      </div>
    </main>
  );
}
