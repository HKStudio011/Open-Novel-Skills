# Baseline slop test — no prose guidance (RED)

Date: 2026-11-17
Condition: subagent with the current (unmodified) `opennovel-writing-assistant` SKILL.md embedded verbatim, Raw Story rewrite scenario per plan Task 1 Step 2. Session: ses_e162ca428ffeYztGlsBfPkW1S8.

## Verbatim output

> Linh had counted the nights without meaning to. Eleven, since Phong started coming home after ten, always with the same answer when she asked where he'd been: extra shifts at the shop. He said it while unlacing his shoes, eyes down, and she nodded every time, because that was what he needed.
>
> But extra shifts didn't leave a man pale. Extra shifts didn't make him flinch when the phone rang.
>
> At dinner, neither of them touched the soup until it had gone lukewarm. Phong, feeling it too, reached for his bright voice — the one he used the way other people used walls. "You know what the new manager said today? That I have a gift. For standing around looking worried about inventory." Linh laughed. She hated herself for it, a little — for letting the charm work, the charm he wore like a coat over whatever he wouldn't let anyone see.
>
> That was the thing about Phong: he'd rather carry a thing alone for months than have one honest conversation about it. She'd known it since they were kids. She hadn't known it could frighten her.
>
> His jacket hung on the back of his chair, the one he'd worn every evening and never left behind. She was clearing the table when she stopped beside it, dishes stacked in her arms.
>
> She told herself she was only moving it.
>
> The phone was in the inside pocket. A prepaid thing, cheap and anonymous, screen dark, a strip of electrical tape holding the battery cover closed. Phong's real phone lived in his hand all day, cracked at the corner, full of family photos. This one was for a life he didn't bring home. Nobody carried a second phone unless they were afraid of somebody.
>
> Her arms went cold around the ceramic. She thought of him at the door each night, arranging his face before he turned around. Whatever had hold of her brother had been coming for a long time — and now that she had touched it, there was no giving it back.

## Scores (pattern list from plan Task 1 Step 3)

| Pattern | Count | Instances |
|---|---|---|
| Named emotions | 2 | "She hated herself for it, a little"; "it could frighten her" |
| Stated knowledge/motives | 5 | "because that was what he needed"; "Phong, feeling it too"; "That was the thing about Phong: he'd rather carry a thing alone... She'd known it since they were kids"; "This one was for a life he didn't bring home"; "Nobody carried a second phone unless they were afraid of somebody" |
| Stock phrasing (planted) | 0 | none of "air was thick with tension" / "wave of" / "suddenly" survived |
| Moralizing/meaning close | 1 | "and now that she had touched it, there was no giving it back" (narrator draws the meaning, foreshadowing close) |

Planted-pattern survival: **8 instances** — RED confirmed (expected ≥3).

## Verdict

Failing test confirmed. The slop that survives a capable model's rewrite is concentrated in **narrator explaining** — asserted inner states of other characters ("feeling it too"), motive statements ("because that was what he needed"), direct character explanation ("That was the thing about Phong..."), generalization-as-meaning ("Nobody carried a second phone unless..."), and a meaning-drawing closing line. Stock phrases did not survive; the recipe in Task 2 must therefore target narrator-explaining specifically, not cliché word lists.

With-skill rerun (Task 4) target: ≤2 surviving instances, no meaning-drawing close, no asserted inner states of characters other than the POV holder.

---

# With-skill rerun (Task 4) — GREEN check

Date: 2026-11-18. Identical scenario and prompt as the baseline (session ses_e1572db49ffeKgyxrm41KWV21O), with the updated SKILL.md (Prose Style section) embedded verbatim.

## Verbatim output

> The gym bag hadn't been near a gym in weeks. Linh knew because she did the laundry: every week the towel inside came back clean and folded, never used, while Phong came home past nine with street food on his breath and someone else's cigarette smoke in his collar.
>
> At dinner she asked how his evening was.
>
> "Good. Gym." He helped himself to the fish and turned the head away from her bowl, a habit from when they were small. "Then phở with Dũng. You remember Dũng." He did the voice Dũng answered the phone in, and grinned until she had to look at her rice.
>
> She tried once more. "Every night this week, though."
>
> "And every night this week, phở." He tapped her bowl twice with his chopsticks, the way he'd done since she was six, and took the last piece of fish off her plate.
>
> After dinner he carried the plates to the sink and went to shower, humming. His jacket hung on the back of his chair. Linh gave the running water thirty seconds to cover her, then went through the pockets. Keys. Crumpled receipts. In the inside pocket, the one with the broken zip he never used, a phone.
>
> It wasn't his. An older model, screen scratched, no case. It lit under her thumb. One message, from a number with no name saved to it.
>
> *You were followed.*
>
> She read it twice. The timestamp was 6:47 — while they'd been eating. In the bathroom the water kept running. She made herself learn the words, the time, the number, then set the phone back and turned the seam of the pocket the way she'd found it.
>
> The shower shut off. By the time he came out, rubbing his hair with a towel, she was at the stove warming the leftover fish. He said there was no need. She said it was already hot. While the microwave hummed she watched her own face in the dark glass of the oven door, and made it into a smile before she turned around.

## Scores (same pattern list)

| Pattern | Baseline | With skill |
|---|---|---|
| Named emotions | 2 | **0** ("made it into a smile" renders the beat behaviorally) |
| Stated knowledge/motives | 5 | **0** (Phong's avoidance shown via dialogue and the phở deflection; "Linh knew because she did the laundry" is the POV character's own grounded reasoning, not narrator explanation) |
| Stock phrasing | 0 | **0** |
| Moralizing/meaning close | 1 | **0** (ends on the oven-door reflection image) |

Planted-pattern survival: **0-1** (borderline: none beyond acceptable POV interiority) vs baseline 8. Target was ≤2 — **GREEN, round 1, no refactor rounds needed.**

## Review plant-slop test (Task 4 Step 2)

Session ses_e1572db49ffdVpmUrZICmL0zXH, updated review SKILL.md, passage with 4 planted patterns. Result: narrator-explaining flagged **Major** (density + emotional peak, per the checklist's severity rule), moralizing flagged **Major**, stock phrasing flagged **Minor**, redundant summary flagged **Minor**, plus adverb tics (**Suggestion**). Uniform voice correctly declined for insufficient data. Output stayed read-only — no rewrite, ends with the pointer to `opennovel-writing-assistant` per the skill's rules.

## Verdict

Both verification tests passed in round 1: the Prose Style recipe reduced narrator-explaining from 8 surviving instances to 0-1 on identical input, and the review checklist detects planted slop with correct severities while staying read-only.
