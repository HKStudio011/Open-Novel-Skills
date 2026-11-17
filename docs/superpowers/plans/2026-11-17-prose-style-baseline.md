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
