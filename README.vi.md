# OpenNovel Framework 🖋️

Framework hỗ trợ viết tiểu thuyết với sự trợ giúp của AI.

[:uk: English](README.md)

Kết hợp **CLI tool** + **7 agent skills** dành cho AI coding assistant (Claude Code, OpenCode, Codex) — từ khởi tạo project, xây dựng thế giới nhân vật, lên outline, viết chapter, review, tracking continuity, đến export bản cuối.

---

## Tính năng chính

- **CLI scaffold** — `opennovel init` tạo project structure chuẩn
- **Story bible** — nhân vật, luật thế giới, bí mật, chuỗi cause-effect
- **Plot outline** — chapter briefs, timeline, turning points, hooks
- **AI-assisted writing** — viết chapter theo brief, đúng tính cách nhân vật
- **Built-in review** — 6 tầng quality check (logic → character → plot → pacing → emotion → prose)
- **Continuity tracking** — tự động cập nhật story state sau mỗi chapter
- **Raw Story Assimilation** — import truyện có sẵn, extract bible/outline, rewrite hoặc continue
- **Export** — `.md` → `.txt` / `.html`

---

## Cài đặt

```bash
# Cài global
npm install -g @hkstudio011/opennovel

# Hoặc chạy trực tiếp qua npx
npx @hkstudio011/opennovel init my-story
```

**Yêu cầu:** Node.js >= 18

---

## Bắt đầu nhanh

```bash
npx @hkstudio011/opennovel init my-story
cd my-story
```

Sau đó load skill `opennovel-writing-assistant` trong AI coding assistant của bạn (Claude Code, OpenCode, Codex...).

### Cách 1: Truyện mới

Nói với AI:

> "Tôi muốn viết truyện" / "I want to write a story"

AI sẽ tự động:
1. Điền metadata project (genre, tone, POV, premise...)
2. Xây dựng story bible (nhân vật, thế giới, luật, bí mật)
3. Lên outline (cốt truyện, chapter briefs)
4. Viết từng chapter — review — sửa — cập nhật continuity

### Cách 2: Truyện đã có

Paste text truyện có sẵn và nói:

> "Tiếp tục truyện này" / "Viết lại chapter này"

AI sẽ vào **Raw Story Assimilation Mode**:
1. Phân tích nội dung → nhận diện nhân vật, cốt truyện, secrets
2. Đề xuất Proposed Bible Update + Proposed Outline Update
3. Sau khi bạn duyệt, rewrite hoặc continue với continuity tracking

---

## Luồng làm việc

```
Bible → Outline → Write → Review → Revise → Continuity
  ↑                                              │
  └───────────────────── Next chapter ───────────┘
                              │
                              ↓
                          Export
```

Chi tiết:
1. **project-init** — tạo project, điền metadata
2. **bible-builder** — xây dựng nhân vật, thế giới, luật, bí mật
3. **outline-builder** — plot, timeline, chapter briefs
4. **writing-assistant** — viết chapter theo brief
5. **review** — kiểm tra quality (chỉ chẩn đoán, không tự sửa)
6. **writing-assistant** — sửa lỗi dựa trên review (logic → prose)
7. **continuity-manager** — cập nhật story state (chỉ sau khi chapter finalized)
8. Quay lại bước 4 cho chapter tiếp theo, hoặc **export** khi hoàn thành

---

## Danh sách Skill

| Skill | Vai trò | Khi nào dùng |
|---|---|---|
| `opennovel-writing-assistant` | Điều phối chính, viết/sửa | Mọi writing session — **entry point chính** |
| `opennovel-bible-builder` | Nhân vật, thế giới, luật, bí mật | Thiếu context, worldbuilding, hoặc analyze raw text |
| `opennovel-outline-builder` | Plot, timeline, chapter briefs | Thiếu cấu trúc, planning, hoặc analyze raw text |
| `opennovel-continuity-manager` | Theo dõi story state | Sau mỗi chapter finalized |
| `opennovel-review` | Kiểm tra quality (chỉ đọc) | Trước khi finalize chapter |
| `opennovel-exporter` | .md → .txt / .html | Khi hoàn thành truyện |

---

## Golden Rules

1. Mỗi chapter cần: **goal** → **conflict** → **mini-climax** → **hook**
2. Thứ tự review: logic → character → plot → pacing → emotion → prose
3. Thứ tự sửa: logic trước, prose sau
4. Cập nhật continuity sau mỗi chapter (chỉ khi đã finalized)
5. Không tiết lộ bí mật sớm, không phá vỡ tính cách nhân vật

---

## License

MIT
