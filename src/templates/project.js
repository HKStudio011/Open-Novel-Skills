const path = require('path');

const EMPTY = '.gitkeep\n';

function getFileTree(projectName) {
  return [
    // Story Core
    { dir: 'core' },
    { file: 'core/story_core.md', content: storyCoreTemplate(projectName) },

    // Characters
    { dir: 'characters' },
    { dir: 'characters/main_characters' },
    { file: 'characters/main_characters/.gitkeep', content: EMPTY },
    { dir: 'characters/supporting_characters' },
    { file: 'characters/supporting_characters/.gitkeep', content: EMPTY },
    { dir: 'characters/antagonists' },
    { file: 'characters/antagonists/.gitkeep', content: EMPTY },
    { file: 'characters/character_bible.md', content: characterBibleTemplate },
    { file: 'characters/relationships.md', content: relationshipsTemplate },

    // World
    { dir: 'world' },
    { file: 'world/world_overview.md', content: worldOverviewTemplate },
    { file: 'world/locations.md', content: locationsTemplate },
    { file: 'world/history.md', content: historyTemplate },
    { file: 'world/culture.md', content: cultureTemplate },
    { file: 'world/atmosphere.md', content: atmosphereTemplate },

    // Logic
    { dir: 'logic' },
    { file: 'logic/world_rules.md', content: worldRulesTemplate },
    { file: 'logic/power_system.md', content: powerSystemTemplate },
    { file: 'logic/secrets_reveals.md', content: secretsRevealsTemplate },
    { file: 'logic/cause_effect.md', content: causeEffectTemplate },
    { file: 'logic/logic_errors_to_avoid.md', content: logicErrorsTemplate },

    // Plot
    { dir: 'plot' },
    { file: 'plot/main_plot.md', content: mainPlotTemplate },
    { file: 'plot/subplot.md', content: subplotTemplate },
    { file: 'plot/timeline.md', content: timelineTemplate },
    { file: 'plot/turning_points.md', content: turningPointsTemplate },
    { file: 'plot/climax_ending.md', content: climaxEndingTemplate },

    // Chapters
    { dir: 'chapters' },
    { dir: 'chapters/chapter_briefs' },
    { file: 'chapters/chapter_briefs/.gitkeep', content: EMPTY },
    { dir: 'chapters/scene_breakdowns' },
    { file: 'chapters/scene_breakdowns/.gitkeep', content: EMPTY },
    { file: 'chapters/chapter_list.md', content: chapterListTemplate },
    { file: 'chapters/chapter_hooks.md', content: chapterHooksTemplate },

    // Writing
    { dir: 'writing' },
    { dir: 'writing/ai_outputs' },
    { file: 'writing/ai_outputs/.gitkeep', content: EMPTY },
    { dir: 'writing/review_notes' },
    { file: 'writing/review_notes/.gitkeep', content: EMPTY },
    { file: 'writing/writing_prompts.md', content: writingPromptsTemplate },
    { file: 'writing/revision_prompts.md', content: revisionPromptsTemplate },

    // Approved chapters
    { dir: 'approved' },
    { file: 'approved/.gitkeep', content: EMPTY },

    // Continuity
    { dir: 'continuity' },
    { file: 'continuity/continuity_log.md', content: continuityLogTemplate },
    { file: 'continuity/character_status.md', content: characterStatusTemplate },
    { file: 'continuity/revealed_information.md', content: revealedInfoTemplate },
    { file: 'continuity/hidden_information.md', content: hiddenInfoTemplate },
    { file: 'continuity/next_chapter_setup.md', content: nextChapterSetupTemplate },

    // Editing
    { dir: 'editing' },
    { file: 'editing/structure_edit.md', content: structureEditTemplate },
    { file: 'editing/prose_edit.md', content: proseEditTemplate },
    { file: 'editing/dialogue_edit.md', content: dialogueEditTemplate },
    { file: 'editing/final_review.md', content: finalReviewTemplate },

    // Output
    { dir: 'output' },
    { file: 'output/full_story.md', content: fullStoryTemplate },
    { file: 'output/final_script.md', content: finalScriptTemplate },
  ];
}

// ----- Template content generators -----

function storyCoreTemplate(name) {
  return `# Story Core — ${name}

## Premise
[Ý tưởng nền của câu chuyện]

## Logline
Một [nhân vật chính] phải [mục tiêu], nhưng [trở ngại lớn], buộc họ phải [lựa chọn/thay đổi].

## Chủ đề chính
-
-

## Xung đột chính
- Bên ngoài:
- Bên trong:

## Mục tiêu nhân vật chính
- Mục tiêu bên ngoài:
- Mục tiêu bên trong:

## Cái giá nếu thất bại
-

## Tông truyện
-

## Kiểu kết thúc
[Đóng / mở / bi kịch / bittersweet / twist / vòng lặp]
`;
}

const characterBibleTemplate = `# Character Bible

## Hồ sơ nhân vật chuẩn

Tên:
Vai trò:
Tuổi:
Ngoại hình:
Trang phục:
Vũ khí/vật phẩm đặc trưng:
Tính cách:
Giọng nói/hội thoại:
Mục tiêu bên ngoài:
Mục tiêu bên trong:
Nỗi sợ:
Điểm yếu:
Điểm mạnh:
Quá khứ:
Bí mật:
Quan hệ với nhân vật khác:
Điều nhân vật biết:
Điều nhân vật chưa biết:
Điều nhân vật đang che giấu:
Sự thay đổi qua truyện:
Số phận cuối truyện:

## Không được viết sai
-
-
-
`;

const relationshipsTemplate = `# Relationships

## Bảng quan hệ nhân vật

| Nhân vật 1 | Nhân vật 2 | Kiểu quan hệ | Mức độ tin tưởng | Mâu thuẫn | Thay đổi qua truyện |
|------------|------------|--------------|------------------|-----------|---------------------|
|            |            |              |                  |           |                     |
`;

const worldOverviewTemplate = `# World Overview

## Tổng quan bối cảnh
[Thế giới/câu chuyện diễn ra ở đâu?]

## Thời gian
[Quá khứ / hiện đại / tương lai / giả tưởng / không xác định]
`;

const locationsTemplate = `# Locations

## Địa điểm chính
-
-

## Địa điểm phụ
-
-
`;

const historyTemplate = `# History

## Lịch sử quan trọng
- Sự kiện quá khứ:
- Biến cố ảnh hưởng tới hiện tại:
`;

const cultureTemplate = `# Culture

## Xã hội và văn hóa
- Luật lệ:
- Tầng lớp:
- Tín ngưỡng:
- Tập quán:
`;

const atmosphereTemplate = `# Atmosphere

## Không khí hình ảnh
- Màu sắc:
- Ánh sáng:
- Âm thanh:
- Cảm giác chủ đạo:
`;

const worldRulesTemplate = `# World Rules

## Luật thế giới
1.
2.
3.
`;

const powerSystemTemplate = `# Power System

## Luật sức mạnh/năng lực/hệ thống
1.
2.
3.

## Giới hạn
- Nhân vật không thể:
- Thế giới không cho phép:
- Phản diện không thể:
`;

const secretsRevealsTemplate = `# Secrets & Reveals

## Bí mật và thời điểm hé lộ
- Bí mật 1:
  - Người biết:
  - Người chưa biết:
  - Hé lộ ở chương:
- Bí mật 2:
  - Người biết:
  - Người chưa biết:
  - Hé lộ ở chương:
`;

const causeEffectTemplate = `# Cause & Effect

## Nhân quả quan trọng
Nếu [sự kiện A] xảy ra thì [hệ quả B].
`;

const logicErrorsTemplate = `# Logic Errors to Avoid

## Lỗi logic cần tránh
-
-
`;

const mainPlotTemplate = `# Main Plot

## Mở đầu
-

## Biến cố khởi đầu
-

## Mục tiêu chính được thiết lập
-

## Điểm ngoặt 1
-

## Chuỗi thử thách
1.
2.
3.

## Điểm giữa truyện
-

## Khủng hoảng lớn
-

## Điểm ngoặt 2
-

## Cao trào
-

## Kết thúc
-

## Dư âm sau kết thúc
-
`;

const subplotTemplate = `# Subplot

## Tuyến phụ
[Miêu tả tuyến truyện phụ và cách nó kết nối với mạch chính]
`;

const timelineTemplate = `# Timeline

## Dòng thời gian
| Thời điểm | Sự kiện | Ghi chú |
|-----------|---------|---------|
|           |         |         |
`;

const turningPointsTemplate = `# Turning Points

1. Opening Image
2. Inciting Incident
3. First Turning Point
4. Rising Conflict
5. Midpoint
6. Crisis
7. Second Turning Point
8. Climax
9. Resolution
10. Final Image

[Điền chi tiết cho từng mốc]
`;

const climaxEndingTemplate = `# Climax & Ending

## Cao trào
-

## Kết thúc
[Miêu tả kết thúc]

## Loại kết thúc
[Đóng / mở / bi kịch / bittersweet / twist / vòng lặp]
`;

const chapterListTemplate = `# Chapter List

| Chương | Tên | Độ dài dự kiến | Trạng thái |
|--------|-----|----------------|------------|
| 1      |     |                |            |
`;

const chapterHooksTemplate = `# Chapter Hooks

| Chương | Hook cuối | Dẫn tới chương |
|--------|-----------|----------------|
|        |           |                |
`;

const writingPromptsTemplate = `# Writing Prompts

## Prompt chuẩn cho AI viết chương

Khi viết chương, hãy sử dụng prompt sau:

"Bạn là AI viết truyện theo OpenNovel Framework.
Hãy viết Chương [số]: [tên chương].
...
"
`;

const revisionPromptsTemplate = `# Revision Prompts

## Prompt review

"Hãy review chương truyện theo OpenNovel Framework.
Kiểm tra: Logic, Nhân vật, Cốt truyện, Nhịp truyện, Cảm xúc, Văn phong."

## Prompt sửa

"Hãy chỉnh sửa chương dựa trên lỗi đã phát hiện.
Thứ tự sửa: logic → nhân vật → cốt truyện → nhịp → hội thoại → văn phong."
`;

const continuityLogTemplate = `# Continuity Log

## Chương [số]
- Nhân vật đã biết thêm:
- Bí mật đã hé lộ:
- Quan hệ thay đổi:
- Vật phẩm/sự kiện mới:
- Trạng thái cuối chương:
- Móc nối chương sau:
`;

const characterStatusTemplate = `# Character Status

| Nhân vật | Tình trạng | Mục tiêu hiện tại | Đã biết | Đang giấu | Cảm xúc |
|----------|------------|-------------------|---------|-----------|---------|
|          |            |                   |         |           |         |
`;

const revealedInfoTemplate = `# Revealed Information

## Thông tin đã hé lộ
-
`;

const hiddenInfoTemplate = `# Hidden Information

## Thông tin vẫn cần giấu
-
`;

const nextChapterSetupTemplate = `# Next Chapter Setup

## Hậu quả cần nhớ ở chương sau
-

## Móc nối chương tiếp theo
-
`;

const structureEditTemplate = `# Structure Edit

## Kiểm tra cấu trúc tổng thể
[ ]
`;

const proseEditTemplate = `# Prose Edit

## Kiểm tra văn phong
[ ]
`;

const dialogueEditTemplate = `# Dialogue Edit

## Kiểm tra hội thoại
[ ]
`;

const finalReviewTemplate = `# Final Review

## Kiểm tra lần cuối
[ ]
`;

const fullStoryTemplate = `# Full Story

[Toàn bộ truyện hoàn chỉnh]
`;

const finalScriptTemplate = `# Final Script

[Kịch bản hoàn chỉnh]
`;

module.exports = { getFileTree };
