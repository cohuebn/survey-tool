import Image from "next/image";
import businessmanPullingScale from "@assets/businessman-pulling-scale.png";

import { productName } from "../constants";

import styles from "./second-section.module.css";

export function SecondSection() {
  return (
    <div className={styles.section}>
      <Image
        src={businessmanPullingScale}
        alt="Businessman pulling scale"
        className={styles.image}
      />
      <div className={styles.content}>
        <p>
          In the healthcare industry, concerns about social & professional
          backlash often hinder healthcare professionals from sharing their
          unfiltered insights.
        </p>
        <p>
          This can result in lack of feedback or worse yet, partial opinions
          that aren&rsquo;t completely candid. {productName} is meant to put the
          power to effect change back into the hands of physicians, nurses, and
          other medical professionals.
        </p>
        <p>
          {productName} prevents misrepresented results by validating
          physicians. It keeps those physicians&rsquo; identities safe by
          minimizing personally identifiable information required and never
          including that information with survey results.
        </p>
      </div>
    </div>
  );
}
