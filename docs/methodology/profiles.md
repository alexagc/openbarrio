# Decision Profiles Methodology Specification

- **Methodology Version:** `2.1.0`
- **Source of Truth:** `packages/core/src/scoring/profiles.ts`, `packages/core/src/scoring/weights.ts`
- **Clamped Multiplier Bounds:** `[0.6, 1.5]`

---

## 1. Design Rules & Invariants

1. **Dual Transparency:** Selecting a decision profile (`family`, `investor`, `senior`, `renter`) **never** replaces the base BarrioScore (`v2.0.0` / `none`). Both the base BarrioScore and the profile-weighted score are always displayed side by side.
2. **Uncertainty & Safety Gate Preserved:** A profile **cannot** upgrade an `UNCERTAIN` traffic light (`pillarsWithData < 3`) and **cannot** bypass the `CRITICAL_LAYER_KEYS` (`sica`, `snczi`) green ceiling (`AMBER` max when either critical layer is missing).
3. **No New Scoring Pillars:** Non-pillar signals (SERPAVI rent caps, CEE, substandard housing, market trends, VUT) affect **dossier section ordering** and **visit checklist prioritization**, not the 5-pillar weighted formula.

---

## 2. Declarative Profile Weight Multipliers (`PROFILE_TEMPLATES`)

Multipliers are applied to the typology base weights (`SCORING_WEIGHTS_BY_TYPOLOGY`) and renormalized so $\sum w_p = 1$:

| Profile ID | Connectivity | Building | Socioeconomic | Environmental | Urban Planning | Dossier & Checklist Focus |
|---|---:|---:|---:|---:|---:|---|
| `family` | `×1.4` | `×0.8` | `×0.8` | `×1.4` | `×0.8` | Education, healthcare, parks, acoustic comfort |
| `investor` | `×0.8` | `×1.4` | `×1.4` | `×0.8` | `×0.8` | Fiscal/market trends, CapEx, ITE/IEE, VUT pressure |
| `senior` | `×1.4` | `×0.8` | `×0.8` | `×1.4` | `×0.8` | Healthcare, rapid transit, accessibility, acoustic comfort |
| `renter` | `×0.8` | `×1.4` | `×1.4` | `×0.8` | `×0.8` | SERPAVI rent caps, CEE, substandard housing, noise |

> **Shared-multiplier disclosure:** `family` and `senior` share identical 5-pillar multipliers (`connectivity` and `environmental` `×1.4`; remaining `×0.8`), and `investor` and `renter` share identical 5-pillar multipliers (`building` and `socioeconomic` `×1.4`; remaining `×0.8`). They differentiate through deterministic **dossier section ordering** (`sectionOrder`) and **visit checklist priority boosts** (`PROFILE_CHECKLIST_BOOSTS`).

---

## 3. Effective Normalized Weights for `RESIDENTIAL`

Applying the multipliers above to `RESIDENTIAL` base weights (`25% / 25% / 20% / 15% / 15%`):

| Profile ID | Connectivity | Building | Socioeconomic | Environmental | Urban Planning | Sum |
|---|---:|---:|---:|---:|---:|---:|
| `none` (base) | `25.0%` | `25.0%` | `20.0%` | `15.0%` | `15.0%` | 100% |
| `family` | `33.7%` | `19.2%` | `15.4%` | `20.2%` | `11.5%` | 100% |
| `investor` | `18.7%` | `32.7%` | `26.2%` | `11.2%` | `11.2%` | 100% |
| `senior` | `33.7%` | `19.2%` | `15.4%` | `20.2%` | `11.5%` | 100% |
| `renter` | `18.7%` | `32.7%` | `26.2%` | `11.2%` | `11.2%` | 100% |
