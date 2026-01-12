import React, { useMemo } from "react";
import { passwordStrengthScore } from "../lib/validators.ts";

export default function PasswordStrength({ password }) {
  const score = useMemo(() => passwordStrengthScore(password), [password]);
  const label = score <= 1 ? "弱" : score === 2 ? "中" : "強";

  return (
    <div className="stack">
      <div className="small">密碼強度：{label}</div>
      <progress max="4" value={score} />
    </div>
  );
}
