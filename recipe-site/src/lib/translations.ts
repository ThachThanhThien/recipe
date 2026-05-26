import type { Lang } from "./lang";

/**
 * UI label dictionary. Add keys as needed — keep entries short.
 * Recipe content (title/description/instructions) is localized by the API
 * via the `x-lang` header, so it does not need entries here.
 */
const DICT = {
  // Brand & navigation
  "brand.tagline": { en: "Modern Recipes", vi: "Công thức hiện đại" },
  "nav.home": { en: "Home", vi: "Trang chủ" },
  "nav.recipes": { en: "All Recipes", vi: "Tất cả công thức" },
  "nav.favorites": { en: "Favorites", vi: "Yêu thích" },
  "nav.shoppingList": { en: "Shopping list", vi: "Danh sách mua sắm" },
  "nav.toggleTheme": { en: "Toggle theme", vi: "Đổi giao diện" },
  "nav.toggleMenu": { en: "Toggle menu", vi: "Mở menu" },
  "nav.searchPlaceholder": { en: "Search recipes...", vi: "Tìm công thức..." },
  "nav.searchAria": { en: "Search recipes", vi: "Tìm công thức" },
  "nav.language": { en: "Language", vi: "Ngôn ngữ" },

  // Home page sections
  "home.apiUnavailableLine1": {
    en: "We couldn't reach the recipe API. Make sure",
    vi: "Không thể kết nối tới API. Vui lòng đảm bảo",
  },
  "home.apiUnavailableLine2": {
    en: "is running on",
    vi: "đang chạy ở",
  },
  "home.browseEyebrow": { en: "Browse", vi: "Khám phá" },
  "home.byCategory": { en: "By category", vi: "Theo danh mục" },
  "home.byCategoryDesc": {
    en: "Find recipes that match your mood or meal.",
    vi: "Tìm công thức phù hợp với khẩu vị của bạn.",
  },
  "home.editorsChoice": { en: "Editor's choice", vi: "Lựa chọn biên tập" },
  "home.featured": { en: "Featured recipes", vi: "Công thức nổi bật" },
  "home.featuredDesc": {
    en: "Our team's favorites, hand-picked this week.",
    vi: "Lựa chọn yêu thích của đội ngũ tuần này.",
  },
  "home.hotNow": { en: "Hot right now", vi: "Đang hot" },
  "home.trending": { en: "Trending recipes", vi: "Công thức thịnh hành" },
  "home.trendingDesc": {
    en: "What everyone's cooking this week.",
    vi: "Món mọi người đang nấu tuần này.",
  },
  "home.fresh": { en: "Fresh from the kitchen", vi: "Vừa ra lò" },
  "home.latest": { en: "Latest recipes", vi: "Công thức mới nhất" },
  "home.latestDesc": {
    en: "The newest additions to our collection.",
    vi: "Những công thức mới nhất của chúng tôi.",
  },
  "home.seeAll": { en: "See all", vi: "Xem tất cả" },
  "home.browseAll": { en: "Browse all", vi: "Xem tất cả" },
  "home.browseAllLong": { en: "Browse all recipes", vi: "Xem tất cả công thức" },
  "home.noRecipesTitle": { en: "No recipes yet", vi: "Chưa có công thức nào" },
  "home.noRecipesDesc": {
    en: "Add your first recipe in the admin portal and it'll appear here.",
    vi: "Hãy thêm công thức đầu tiên trong trang quản trị.",
  },
  "home.ctaHeadline": { en: "Hungry for more?", vi: "Muốn khám phá thêm?" },
  "home.ctaDesc": {
    en: "Explore our full catalog of recipes — filter by category, difficulty, or time.",
    vi: "Khám phá toàn bộ công thức — lọc theo danh mục, độ khó, hay thời gian.",
  },

  // All recipes page
  "recipes.title1": { en: "All", vi: "Tất cả" },
  "recipes.title2": { en: "recipes", vi: "công thức" },
  "recipes.subtitle": {
    en: "Browse, search, and filter our entire recipe collection.",
    vi: "Duyệt, tìm kiếm và lọc toàn bộ công thức của chúng tôi.",
  },
  "recipes.apiUnavailableTitle": { en: "API unavailable", vi: "Không có API" },
  "recipes.apiUnavailableDesc": {
    en: "We couldn't reach the recipe API. Make sure recipe-api is running on http://localhost:3000 then refresh.",
    vi: "Không thể kết nối API. Hãy đảm bảo recipe-api đang chạy tại http://localhost:3000 rồi tải lại.",
  },
  "recipes.emptyDesc": {
    en: "Once recipes are added in the admin portal, they'll show up here.",
    vi: "Khi có công thức trong trang quản trị, chúng sẽ hiển thị tại đây.",
  },

  // Recipe detail page
  "detail.back": { en: "Back to recipes", vi: "Quay lại danh sách" },
  "detail.featured": { en: "Featured", vi: "Nổi bật" },
  "detail.trending": { en: "Trending", vi: "Thịnh hành" },
  "detail.kitchen": { en: "TastyFresh kitchen", vi: "Bếp TastyFresh" },
  "detail.prep": { en: "Prep", vi: "Chuẩn bị" },
  "detail.cook": { en: "Cook", vi: "Nấu" },
  "detail.servings": { en: "Servings", vi: "Khẩu phần" },
  "detail.calories": { en: "Calories", vi: "Calo" },
  "detail.instructions": { en: "Instructions", vi: "Hướng dẫn" },
  "detail.instructionsHelp": {
    en: "Tap each step to mark it complete as you cook — or start cooking mode for a hands-free, step-by-step view.",
    vi: "Nhấn từng bước để đánh dấu khi đã làm xong — hoặc bật chế độ nấu để xem từng bước rảnh tay.",
  },
  "detail.markStepComplete": { en: "Mark step complete", vi: "Đánh dấu hoàn tất bước" },
  "detail.noInstructions": { en: "No instructions provided.", vi: "Không có hướng dẫn." },
  "detail.rating": { en: "Recipe rating", vi: "Đánh giá công thức" },
  "detail.readReviews": { en: "Read reviews →", vi: "Đọc đánh giá →" },
  "detail.review": { en: "review", vi: "đánh giá" },
  "detail.reviews": { en: "reviews", vi: "đánh giá" },
  "detail.related": { en: "You might also like", vi: "Có thể bạn cũng thích" },
  "detail.notFound": { en: "Recipe not found", vi: "Không tìm thấy công thức" },
  "detail.fallbackTitle": { en: "Untitled recipe", vi: "Công thức chưa đặt tên" },
  "detail.fallbackDesc": {
    en: "A delicious recipe to try at home.",
    vi: "Một công thức thơm ngon để thử tại nhà.",
  },

  // Difficulty
  "difficulty.Easy": { en: "Easy", vi: "Dễ" },
  "difficulty.Medium": { en: "Medium", vi: "Trung bình" },
  "difficulty.Hard": { en: "Hard", vi: "Khó" },
} satisfies Record<string, Record<Lang, string>>;

export type TKey = keyof typeof DICT;

export function t(lang: Lang, key: TKey): string {
  const entry = DICT[key];
  return entry[lang] ?? entry.en ?? key;
}

/** Convenience: returns a bound translator for a specific language. */
export function translator(lang: Lang): (key: TKey) => string {
  return (key) => t(lang, key);
}
