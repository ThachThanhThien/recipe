export type Multilingual = { [key: string]: string };

export interface Recipe {
  id: string;
  title: Multilingual;
  description: Multilingual;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  ingredients: { item: Multilingual; amount: string }[];
  instructions: Multilingual;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: { en: "Vibrant Berry Smoothie Bowl", vi: "Sinh tố dâu tây rực rỡ" },
    description: { 
      en: "A refreshing and nutrient-packed bowl topped with fresh berries, chia seeds, and a hint of mint. Perfect for a quick, energizing breakfast.",
      vi: "Một bát sinh tố tươi mát và giàu dinh dưỡng với các loại dâu tươi, hạt chia và một chút bạc hà. Hoàn hảo cho bữa sáng nhanh chóng và đầy năng lượng."
    },
    image: "/images/smoothie.png",
    prepTime: "10 mins",
    cookTime: "0 mins",
    servings: 1,
    calories: 320,
    difficulty: "Easy",
    category: "Breakfast",
    tags: ["Quick", "Healthy", "Vegetarian"],
    rating: 4.8,
    reviews: 124,
    ingredients: [
      { item: { en: "Mixed berries", vi: "Dâu tổng hợp" }, amount: "1.5 cups" },
      { item: { en: "Greek yogurt", vi: "Sữa chua Hy Lạp" }, amount: "1/2 cup" },
      { item: { en: "Almond milk", vi: "Sữa hạnh nhân" }, amount: "1/4 cup" },
      { item: { en: "Chia seeds", vi: "Hạt chia" }, amount: "1 tbsp" },
      { item: { en: "Honey or Maple syrup", vi: "Mật ong hoặc xi-rô phong" }, amount: "1 tsp" },
      { item: { en: "Granola", vi: "Granola" }, amount: "1/4 cup" }
    ],
    instructions: {
      en: "Blend berries, yogurt, milk, and sweetener until smooth.\nPour into a bowl.\nTop with chia seeds, granola, and extra berries.\nServe immediately while chilled.",
      vi: "Xay dâu, sữa chua, sữa và chất tạo ngọt cho đến khi mịn.\nĐổ vào bát.\nRắc hạt chia, granola và thêm dâu lên trên.\nThưởng thức ngay khi còn lạnh."
    },
    isFeatured: true,
  },
  {
    id: "2",
    title: { en: "Glazed Salmon with Charred Asparagus", vi: "Cá hồi áp chảo với măng tây" },
    description: {
      en: "Honey-garlic glazed salmon fillet perfectly seared and served with roasted asparagus.",
      vi: "Phi lê cá hồi sốt mật ong tỏi áp chảo hoàn hảo, dùng kèm măng tây nướng."
    },
    image: "/images/salmon.png",
    prepTime: "10 mins",
    cookTime: "12 mins",
    servings: 2,
    calories: 450,
    difficulty: "Medium",
    category: "Dinner",
    tags: ["High Protein", "Gluten-Free", "Dinner"],
    rating: 4.9,
    reviews: 89,
    ingredients: [
      { item: { en: "Salmon fillets", vi: "Phi lê cá hồi" }, amount: "2 large pieces" },
      { item: { en: "Asparagus", vi: "Măng tây" }, amount: "1 bunch" }
    ],
    instructions: {
      en: "Preheat pan or oven to 400°F.\nSeason salmon and asparagus.\nSauté until done.",
      vi: "Làm nóng chảo hoặc lò nướng ở 400°F.\nTẩm ướp gia vị cho cá hồi và măng tây.\nÁp chảo cho đến khi chín."
    },
    isTrending: true,
  }
];
