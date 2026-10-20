import type { Lang } from "./lang";

/**
 * UI label dictionary. Keep entries short. Recipe content (title, description,
 * instructions) comes localized from recipe-site/data, so it is not listed here.
 * `{name}` placeholders are filled from the `vars` argument of `t()`.
 */
const DICT = {
  // Brand & navigation
  "brand.tagline": { en: "Your recipe notebook", vi: "Sổ tay công thức của bạn" },
  "nav.home": { en: "Home", vi: "Trang chủ" },
  "nav.recipes": { en: "Recipes", vi: "Công thức" },
  "nav.search": { en: "Search", vi: "Tìm kiếm" },
  "nav.saved": { en: "Saved", vi: "Đã lưu" },
  "nav.shoppingList": { en: "Shopping list", vi: "Danh sách đi chợ" },
  "nav.shopping": { en: "Shopping", vi: "Đi chợ" },
  "nav.main": { en: "Main", vi: "Điều hướng chính" },
  "nav.skip": { en: "Skip to content", vi: "Bỏ qua đến nội dung" },
  "nav.lightTheme": { en: "Switch to light theme", vi: "Chuyển sang giao diện sáng" },
  "nav.darkTheme": { en: "Switch to dark theme", vi: "Chuyển sang giao diện tối" },
  "nav.searchPlaceholder": { en: "Search dishes or ingredients", vi: "Tìm món hoặc nguyên liệu" },
  "nav.searchAria": { en: "Search recipes", vi: "Tìm công thức" },
  "nav.clearSearch": { en: "Clear search", vi: "Xoá tìm kiếm" },
  "nav.language": { en: "Language", vi: "Ngôn ngữ" },

  // Home
  "home.greeting": { en: "What are we cooking today?", vi: "Hôm nay nấu món gì?" },
  "home.count": { en: "{n} recipes in your notebook", vi: "{n} công thức trong sổ tay" },
  "home.recent": { en: "Recently viewed", vi: "Xem gần đây" },
  "home.saved": { en: "Saved", vi: "Đã lưu" },
  "home.featured": { en: "Featured", vi: "Nổi bật" },
  "home.latest": { en: "Newest", vi: "Mới thêm" },
  "home.seeAll": { en: "See all", vi: "Xem tất cả" },
  "home.noRecipesTitle": { en: "No recipes yet", vi: "Chưa có công thức nào" },
  "home.noRecipesDesc": {
    en: "Add your first recipe in the admin portal and it'll appear here.",
    vi: "Hãy thêm công thức đầu tiên trong trang quản trị.",
  },

  // Recipes (browse)
  "recipes.title": { en: "Recipes", vi: "Công thức" },
  "recipes.searchPlaceholder": { en: "Dish, ingredient or tag", vi: "Tên món, nguyên liệu hoặc thẻ" },
  "recipes.all": { en: "All", vi: "Tất cả" },
  "recipes.featured": { en: "Featured", vi: "Nổi bật" },
  "recipes.categories": { en: "Categories", vi: "Danh mục" },
  "recipes.count.one": { en: "1 recipe", vi: "1 công thức" },
  "recipes.count.other": { en: "{n} recipes", vi: "{n} công thức" },
  "recipes.anyLevel": { en: "Any level", vi: "Mọi độ khó" },
  "recipes.difficulty": { en: "Difficulty", vi: "Độ khó" },
  "recipes.sort": { en: "Sort", vi: "Sắp xếp" },
  "recipes.sort.newest": { en: "Newest", vi: "Mới nhất" },
  "recipes.sort.quickest": { en: "Quickest", vi: "Nhanh nhất" },
  "recipes.sort.rating": { en: "Top rated", vi: "Đánh giá cao" },
  "recipes.sort.name": { en: "A–Z", vi: "A–Z" },
  "recipes.clear": { en: "Clear filters", vi: "Xoá bộ lọc" },
  "recipes.noResultsTitle": { en: "No matching recipes", vi: "Không có công thức phù hợp" },
  "recipes.noResultsDesc": {
    en: "Try another word, or clear the filters.",
    vi: "Thử từ khoá khác hoặc xoá bộ lọc.",
  },
  "recipes.emptyDesc": {
    en: "Once recipes are added in the admin portal, they'll show up here.",
    vi: "Khi có công thức trong trang quản trị, chúng sẽ hiển thị tại đây.",
  },

  // Recipe detail
  "detail.back": { en: "Recipes", vi: "Công thức" },
  "detail.prep": { en: "Prep", vi: "Sơ chế" },
  "detail.cook": { en: "Cook", vi: "Nấu" },
  "detail.servings": { en: "Servings", vi: "Khẩu phần" },
  "detail.calories": { en: "kcal", vi: "kcal" },
  "detail.rating": { en: "Rating", vi: "Đánh giá" },
  "detail.ingredients": { en: "Ingredients", vi: "Nguyên liệu" },
  "detail.steps": { en: "Steps", vi: "Cách làm" },
  "detail.stepsHelp": { en: "Tap a step to tick it off.", vi: "Chạm vào một bước để đánh dấu đã xong." },
  "detail.markStep": { en: "Step {n}", vi: "Bước {n}" },
  "detail.noInstructions": { en: "No steps written yet.", vi: "Chưa có hướng dẫn." },
  "detail.noIngredients": { en: "No ingredients listed yet.", vi: "Chưa có nguyên liệu." },
  "detail.startCooking": { en: "Start cooking", vi: "Bắt đầu nấu" },
  "detail.fewer": { en: "Fewer servings", vi: "Giảm khẩu phần" },
  "detail.more": { en: "More servings", vi: "Tăng khẩu phần" },
  "detail.reset": { en: "Reset", vi: "Đặt lại" },
  "detail.haveCount": { en: "{done} of {total} ready", vi: "Đã có {done}/{total}" },
  "detail.allReady": { en: "All set — time to cook!", vi: "Đủ nguyên liệu rồi — nấu thôi!" },
  "detail.addToList": { en: "Add to shopping list", vi: "Thêm vào danh sách đi chợ" },
  "detail.addedToList": { en: "Added to shopping list", vi: "Đã thêm vào danh sách" },
  "detail.viewList": { en: "View list", vi: "Xem danh sách" },
  "detail.save": { en: "Save", vi: "Lưu" },
  "detail.saved": { en: "Saved", vi: "Đã lưu" },
  "detail.saveAria": { en: "Save recipe", vi: "Lưu công thức" },
  "detail.unsaveAria": { en: "Remove from saved", vi: "Bỏ lưu công thức" },
  "detail.tags": { en: "Tags", vi: "Thẻ" },
  "detail.related": { en: "More like this", vi: "Món tương tự" },
  "detail.notFound": { en: "Recipe not found", vi: "Không tìm thấy công thức" },
  "detail.notFoundDesc": {
    en: "This recipe doesn't exist, or it may have been hidden.",
    vi: "Công thức này không tồn tại hoặc đã bị ẩn.",
  },
  "detail.fallbackTitle": { en: "Untitled recipe", vi: "Công thức chưa đặt tên" },
  "detail.fallbackDesc": {
    en: "A delicious recipe to try at home.",
    vi: "Một công thức thơm ngon để thử tại nhà.",
  },

  // Cooking mode
  "cook.mode": { en: "Cooking mode", vi: "Chế độ nấu" },
  "cook.step": { en: "Step {n} of {total}", vi: "Bước {n}/{total}" },
  "cook.prev": { en: "Back", vi: "Trước" },
  "cook.next": { en: "Next", vi: "Tiếp" },
  "cook.done": { en: "Done", vi: "Xong" },
  "cook.exit": { en: "Exit cooking mode", vi: "Thoát chế độ nấu" },
  "cook.jump": { en: "Go to step {n}", vi: "Đến bước {n}" },
  "cook.awake": { en: "Screen stays on", vi: "Màn hình luôn sáng" },
  "cook.empty": { en: "No steps to show.", vi: "Không có bước nào." },
  "cook.hint": { en: "Swipe or use ← → to move", vi: "Vuốt hoặc dùng ← → để chuyển bước" },
  "cook.showIngredients": { en: "Ingredients", vi: "Nguyên liệu" },
  "cook.hideIngredients": { en: "Hide ingredients", vi: "Ẩn nguyên liệu" },

  // Saved
  "saved.title": { en: "Saved recipes", vi: "Công thức đã lưu" },
  "saved.subtitle": { en: "Kept on this device — no account needed.", vi: "Lưu trên thiết bị này — không cần tài khoản." },
  "saved.clearAll": { en: "Clear all", vi: "Xoá tất cả" },
  "saved.clearConfirm": { en: "Remove all saved recipes?", vi: "Bỏ lưu tất cả công thức?" },
  "saved.emptyTitle": { en: "Nothing saved yet", vi: "Chưa lưu công thức nào" },
  "saved.emptyDesc": {
    en: "Tap the heart on any recipe to keep it here.",
    vi: "Chạm vào biểu tượng trái tim trên công thức để lưu tại đây.",
  },
  "common.browse": { en: "Browse recipes", vi: "Xem công thức" },

  // Shopping list
  "shop.title": { en: "Shopping list", vi: "Danh sách đi chợ" },
  "shop.subtitle": { en: "Grouped by recipe, kept on this device.", vi: "Nhóm theo món, lưu trên thiết bị này." },
  "shop.remaining": { en: "{left} of {total} left to buy", vi: "Còn {left}/{total} món cần mua" },
  "shop.clearChecked": { en: "Clear bought", vi: "Xoá món đã mua" },
  "shop.clearAll": { en: "Clear all", vi: "Xoá tất cả" },
  "shop.clearConfirm": { en: "Clear the whole list?", vi: "Xoá toàn bộ danh sách?" },
  "shop.removeRecipe": { en: "Remove {name}", vi: "Xoá {name}" },
  "shop.markBought": { en: "{name} — bought", vi: "{name} — đã mua" },
  "shop.removeItem": { en: "Remove {name}", vi: "Xoá {name}" },
  "shop.emptyTitle": { en: "Your list is empty", vi: "Danh sách đang trống" },
  "shop.emptyDesc": {
    en: "Open a recipe and tap “Add to shopping list”.",
    vi: "Mở một công thức và chọn “Thêm vào danh sách đi chợ”.",
  },
  "shop.findRecipe": { en: "Find a recipe", vi: "Tìm công thức" },

  // Errors
  "error.title": { en: "Something went wrong", vi: "Đã có lỗi xảy ra" },
  "error.desc": { en: "Try again, or head back home.", vi: "Hãy thử lại hoặc quay về trang chủ." },
  "error.retry": { en: "Try again", vi: "Thử lại" },

  // Time & difficulty
  "time.h": { en: "h", vi: "giờ" },
  "time.min": { en: "min", vi: "phút" },
  "difficulty.Easy": { en: "Easy", vi: "Dễ" },
  "difficulty.Medium": { en: "Medium", vi: "Vừa" },
  "difficulty.Hard": { en: "Hard", vi: "Khó" },
} satisfies Record<string, Record<Lang, string>>;

export type TKey = keyof typeof DICT;
export type TVars = Record<string, string | number>;

export function t(lang: Lang, key: TKey, vars?: TVars): string {
  const entry = DICT[key];
  const text: string = entry[lang] ?? entry.en ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m)) : text;
}

/** Convenience: returns a bound translator for a specific language. */
export function translator(lang: Lang): (key: TKey, vars?: TVars) => string {
  return (key, vars) => t(lang, key, vars);
}
