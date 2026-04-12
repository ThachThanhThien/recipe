import { DataSource } from 'typeorm';
import { Ingredient } from '../src/ingredient/ingredient.entity';
import { IngredientType } from '../src/ingredient-types/ingredient-type.entity';
import { Recipe } from '../src/recipe/recipe.entity';
import { RecipeIngredient } from '../src/recipe-ingredient/recipe-ingredient.entity';
import { Tag } from '../src/tag/tag.entity';

async function seed() {
  const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'recipe.db',
    entities: [Ingredient, IngredientType, Recipe, RecipeIngredient, Tag],
    synchronize: true,
  });

  await AppDataSource.initialize();
  console.log('Data Source has been initialized!');

  // 1. Clear existing data
  console.log('Clearing existing data...');
  await AppDataSource.getRepository(RecipeIngredient).clear();
  await AppDataSource.getRepository(Recipe).clear();
  await AppDataSource.getRepository(Ingredient).clear();
  await AppDataSource.getRepository(IngredientType).clear();
  await AppDataSource.getRepository(Tag).clear();
  console.log('Tables cleared.');

  // 2. Create Ingredient Types (Categories) - 20
  const categoriesData = [
    { name: { en: 'Vegetables', vi: 'Rau củ' }, description: { en: 'Fresh and nutritious vegetables', vi: 'Rau củ tươi xanh và bổ dưỡng' } },
    { name: { en: 'Fruits', vi: 'Trái cây' }, description: { en: 'Sweet and tangy fruits', vi: 'Trái cây ngọt ngào và tươi mới' } },
    { name: { en: 'Dairy', vi: 'Sản phẩm từ sữa' }, description: { en: 'Milk-based products', vi: 'Các sản phẩm làm từ sữa' } },
    { name: { en: 'Meat', vi: 'Thịt' }, description: { en: 'Various types of meat', vi: 'Các loại thịt động vật' } },
    { name: { en: 'Seafood', vi: 'Hải sản' }, description: { en: 'Fish and shellfish', vi: 'Cá và các loại động vật có vỏ' } },
    { name: { en: 'Spices', vi: 'Gia vị' }, description: { en: 'Seasonings and spices', vi: 'Các loại gia vị tinh chế' } },
    { name: { en: 'Grains', vi: 'Ngũ cốc' }, description: { en: 'Cereals and grains', vi: 'Các loại ngũ cốc và hạt' } },
    { name: { en: 'Nuts & Seeds', vi: 'Hạt & Các loại hạt' }, description: { en: 'Nutritious nuts and seeds', vi: 'Hạt dinh dưỡng và các loại đậu hạt' } },
    { name: { en: 'Oils & Fats', vi: 'Dầu & Mỡ' }, description: { en: 'Cooking oils and fats', vi: 'Dầu ăn và mỡ thực vật/động vật' } },
    { name: { en: 'Legumes', vi: 'Họ Đậu' }, description: { en: 'Beans and pulses', vi: 'Các loại đậu và cây họ đậu' } },
    { name: { en: 'Herbs', vi: 'Thảo mộc' }, description: { en: 'Fresh and dried herbs', vi: 'Thảo mộc tươi và khô' } },
    { name: { en: 'Sweeteners', vi: 'Chất tạo ngọt' }, description: { en: 'Sugar and alternatives', vi: 'Đường và các chất tạo ngọt thay thế' } },
    { name: { en: 'Bakery', vi: 'Đồ nướng & Bánh mỳ' }, description: { en: 'Breads and baked goods', vi: 'Các loại bánh mỳ và đồ nướng' } },
    { name: { en: 'Beverages', vi: 'Đồ uống' }, description: { en: 'Drinks and liquids', vi: 'Các loại nước giải khát và đồ uống' } },
    { name: { en: 'Condiments', vi: 'Gia vị bàn ăn' }, description: { en: 'Table sauces and flavors', vi: 'Nước xốt và gia vị dùng kèm' } },
    { name: { en: 'Pasta', vi: 'Mì Ý & Pasta' }, description: { en: 'Various pasta shapes', vi: 'Các loại mì Ý và pasta' } },
    { name: { en: 'Roots & Tubers', vi: 'Củ & Rễ' }, description: { en: 'Starchy roots and tubers', vi: 'Các loại củ chứa tinh bột' } },
    { name: { en: 'Mushrooms', vi: 'Nấm' }, description: { en: 'Edible fungi', vi: 'Các loại nấm ăn được' } },
    { name: { en: 'Eggs', vi: 'Trứng' }, description: { en: 'Poultry eggs', vi: 'Trứng gia cầm' } },
    { name: { en: 'Sauces', vi: 'Nước xốt nấu ăn' }, description: { en: 'Prepared sauces', vi: 'Các loại nước xốt đã chế biến' } },
  ];

  const categoryEntities = await Promise.all(
    categoriesData.map(c => {
      const type = new IngredientType();
      type.name = c.name;
      type.description = c.description;
      type.isActive = true;
      return AppDataSource.getRepository(IngredientType).save(type);
    })
  );
  console.log(`Created ${categoryEntities.length} ingredient categories.`);

  const catMap = Object.fromEntries(categoryEntities.map(c => [c.name.en, c]));

  // 3. Create Ingredients - 100
  const ingredientsData = [
    // Vegetables
    { name: { en: 'Carrot', vi: 'Cà rốt' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Broccoli', vi: 'Bông cải xanh' }, unit: 'head', cats: ['Vegetables'] },
    { name: { en: 'Spinach', vi: 'Cải bó xôi' }, unit: 'g', cats: ['Vegetables'] },
    { name: { en: 'Bell Pepper', vi: 'Ớt chuông' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Tomato', vi: 'Cà chua' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Cucumber', vi: 'Dưa leo' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Onion', vi: 'Hành tây' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Garlic', vi: 'Tỏi' }, unit: 'clove', cats: ['Vegetables'] },
    { name: { en: 'Potato', vi: 'Khoai tây' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Cabbage', vi: 'Bắp cải' }, unit: 'head', cats: ['Vegetables'] },
    { name: { en: 'Cauliflower', vi: 'Súp lơ trắng' }, unit: 'head', cats: ['Vegetables'] },
    { name: { en: 'Zucchini', vi: 'Bí ngòi' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Eggplant', vi: 'Cà tím' }, unit: 'piece', cats: ['Vegetables'] },
    { name: { en: 'Asparagus', vi: 'Măng tây' }, unit: 'bunch', cats: ['Vegetables'] },
    { name: { en: 'Kale', vi: 'Cải xoăn' }, unit: 'g', cats: ['Vegetables'] },
    // Fruits
    { name: { en: 'Apple', vi: 'Táo' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Banana', vi: 'Chuối' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Orange', vi: 'Cam' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Strawberry', vi: 'Dâu tây' }, unit: 'g', cats: ['Fruits'] },
    { name: { en: 'Blueberry', vi: 'Việt quất' }, unit: 'g', cats: ['Fruits'] },
    { name: { en: 'Mango', vi: 'Xoài' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Pineapple', vi: 'Dứa' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Grapes', vi: 'Nho' }, unit: 'g', cats: ['Fruits'] },
    { name: { en: 'Watermelon', vi: 'Dưa hấu' }, unit: 'slice', cats: ['Fruits'] },
    { name: { en: 'Peach', vi: 'Đào' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Lemon', vi: 'Chanh vàng' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Lime', vi: 'Chanh xanh' }, unit: 'piece', cats: ['Fruits'] },
    { name: { en: 'Avocado', vi: 'Bơ' }, unit: 'piece', cats: ['Fruits'] },
    // Dairy
    { name: { en: 'Milk', vi: 'Sữa' }, unit: 'ml', cats: ['Dairy'] },
    { name: { en: 'Cheese', vi: 'Phô mai' }, unit: 'g', cats: ['Dairy'] },
    { name: { en: 'Yogurt', vi: 'Sữa chua' }, unit: 'g', cats: ['Dairy'] },
    { name: { en: 'Butter', vi: 'Bơ sữa' }, unit: 'g', cats: ['Dairy'] },
    { name: { en: 'Cream', vi: 'Kem tươi' }, unit: 'ml', cats: ['Dairy'] },
    { name: { en: 'Sour Cream', vi: 'Kem chua' }, unit: 'g', cats: ['Dairy'] },
    // Meat
    { name: { en: 'Chicken Breast', vi: 'Ức gà' }, unit: 'g', cats: ['Meat'] },
    { name: { en: 'Beef Steak', vi: 'Thịt bò bít tết' }, unit: 'g', cats: ['Meat'] },
    { name: { en: 'Pork Chops', vi: 'Sườn heo' }, unit: 'g', cats: ['Meat'] },
    { name: { en: 'Bacon', vi: 'Thịt xông khói' }, unit: 'slice', cats: ['Meat'] },
    { name: { en: 'Ground Beef', vi: 'Thịt bò xay' }, unit: 'g', cats: ['Meat'] },
    { name: { en: 'Lamb', vi: 'Thịt cừu' }, unit: 'g', cats: ['Meat'] },
    { name: { en: 'Turkey', vi: 'Thịt gà tây' }, unit: 'g', cats: ['Meat'] },
    // Seafood
    { name: { en: 'Salmon', vi: 'Cá hồi' }, unit: 'g', cats: ['Seafood'] },
    { name: { en: 'Tuna', vi: 'Cá ngừ' }, unit: 'g', cats: ['Seafood'] },
    { name: { en: 'Shrimp', vi: 'Tôm' }, unit: 'g', cats: ['Seafood'] },
    { name: { en: 'Crab', vi: 'Cua' }, unit: 'g', cats: ['Seafood'] },
    { name: { en: 'Mackerel', vi: 'Cá thu' }, unit: 'g', cats: ['Seafood'] },
    { name: { en: 'Scallops', vi: 'Sò điệp' }, unit: 'g', cats: ['Seafood'] },
    // Spices
    { name: { en: 'Salt', vi: 'Muối' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Black Pepper', vi: 'Tiêu đen' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Cumin', vi: 'Thì là Ai Cập' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Turmeric', vi: 'Nghệ' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Paprika', vi: 'Ớt bột Paprika' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Chili Powder', vi: 'Ớt bột' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Cinnamon', vi: 'Quế' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Ginger Powder', vi: 'Bột gừng' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Oregano', vi: 'Lá kinh giới cay' }, unit: 'tsp', cats: ['Spices'] },
    { name: { en: 'Thyme', vi: 'Cỏ xạ hương' }, unit: 'tsp', cats: ['Spices'] },
    // Grains
    { name: { en: 'Rice', vi: 'Gạo' }, unit: 'g', cats: ['Grains'] },
    { name: { en: 'Quinoa', vi: 'Hạt diêm mạch' }, unit: 'g', cats: ['Grains'] },
    { name: { en: 'Oats', vi: 'Yến mạch' }, unit: 'g', cats: ['Grains'] },
    { name: { en: 'Barley', vi: 'Đại mạch' }, unit: 'g', cats: ['Grains'] },
    { name: { en: 'Couscous', vi: 'Hạt Couscous' }, unit: 'g', cats: ['Grains'] },
    { name: { en: 'Wheat Flour', vi: 'Bột mì' }, unit: 'g', cats: ['Grains'] },
    // Nuts & Seeds
    { name: { en: 'Almonds', vi: 'Hạnh nhân' }, unit: 'g', cats: ['Nuts & Seeds'] },
    { name: { en: 'Walnuts', vi: 'Quả óc chó' }, unit: 'g', cats: ['Nuts & Seeds'] },
    { name: { en: 'Chia Seeds', vi: 'Hạt chia' }, unit: 'g', cats: ['Nuts & Seeds'] },
    { name: { en: 'Sesame Seeds', vi: 'Hạt mè' }, unit: 'g', cats: ['Nuts & Seeds'] },
    { name: { en: 'Pumpkin Seeds', vi: 'Hạt bí' }, unit: 'g', cats: ['Nuts & Seeds'] },
    // Oils & Fats
    { name: { en: 'Olive Oil', vi: 'Dầu ô liu' }, unit: 'ml', cats: ['Oils & Fats'] },
    { name: { en: 'Coconut Oil', vi: 'Dầu dừa' }, unit: 'ml', cats: ['Oils & Fats'] },
    { name: { en: 'Vegetable Oil', vi: 'Dầu thực vật' }, unit: 'ml', cats: ['Oils & Fats'] },
    { name: { en: 'Sesame Oil', vi: 'Dầu mè' }, unit: 'ml', cats: ['Oils & Fats'] },
    // Legumes
    { name: { en: 'Chickpeas', vi: 'Đậu gà' }, unit: 'g', cats: ['Legumes'] },
    { name: { en: 'Lentils', vi: 'Đậu lăng' }, unit: 'g', cats: ['Legumes'] },
    { name: { en: 'Black Beans', vi: 'Đậu đen' }, unit: 'g', cats: ['Legumes'] },
    { name: { en: 'Soybeans', vi: 'Đậu nành' }, unit: 'g', cats: ['Legumes'] },
    // Herbs
    { name: { en: 'Basil', vi: 'Húng quế' }, unit: 'leaf', cats: ['Herbs'] },
    { name: { en: 'Parsley', vi: 'Ngò tây' }, unit: 'sprig', cats: ['Herbs'] },
    { name: { en: 'Cilantro', vi: 'Ngò rí' }, unit: 'sprig', cats: ['Herbs'] },
    { name: { en: 'Mint', vi: 'Bạc hà' }, unit: 'leaf', cats: ['Herbs'] },
    { name: { en: 'Rosemary', vi: 'Hương thảo' }, unit: 'sprig', cats: ['Herbs'] },
    // Sweeteners
    { name: { en: 'Sugar', vi: 'Đường' }, unit: 'g', cats: ['Sweeteners'] },
    { name: { en: 'Honey', vi: 'Mật ong' }, unit: 'tbsp', cats: ['Sweeteners'] },
    { name: { en: 'Maple Syrup', vi: 'Siro phong' }, unit: 'ml', cats: ['Sweeteners'] },
    { name: { en: 'Stevia', vi: 'Cỏ ngọt' }, unit: 'tsp', cats: ['Sweeteners'] },
    // Bakery
    { name: { en: 'Bread', vi: 'Bánh mì' }, unit: 'slice', cats: ['Bakery'] },
    { name: { en: 'Tortillas', vi: 'Bánh Tortilla' }, unit: 'piece', cats: ['Bakery'] },
    { name: { en: 'Baguette', vi: 'Bánh mì Pháp' }, unit: 'piece', cats: ['Bakery'] },
    // Beverages
    { name: { en: 'Water', vi: 'Nước' }, unit: 'ml', cats: ['Beverages'] },
    { name: { en: 'Coffee', vi: 'Cà phê' }, unit: 'ml', cats: ['Beverages'] },
    { name: { en: 'Tea', vi: 'Trà' }, unit: 'ml', cats: ['Beverages'] },
    { name: { en: 'Fruit Juice', vi: 'Nước ép trái cây' }, unit: 'ml', cats: ['Beverages'] },
    // Condiments
    { name: { en: 'Soy Sauce', vi: 'Nước tương' }, unit: 'ml', cats: ['Condiments'] },
    { name: { en: 'Mayo', vi: 'Xốt Mayonnaise' }, unit: 'ml', cats: ['Condiments'] },
    { name: { en: 'Mustard', vi: 'Mù tạt' }, unit: 'ml', cats: ['Condiments'] },
    { name: { en: 'Ketchup', vi: 'Tương cà' }, unit: 'ml', cats: ['Condiments'] },
    // Pasta
    { name: { en: 'Spaghetti', vi: 'Mì Ý Spaghetti' }, unit: 'g', cats: ['Pasta'] },
    { name: { en: 'Penne', vi: 'Mì Penne' }, unit: 'g', cats: ['Pasta'] },
    { name: { en: 'Fusilli', vi: 'Mì Fusilli' }, unit: 'g', cats: ['Pasta'] },
    // Roots & Tubers
    { name: { en: 'Sweet Potato', vi: 'Khoai lang' }, unit: 'piece', cats: ['Roots & Tubers'] },
    { name: { en: 'Ginger', vi: 'Gừng' }, unit: 'g', cats: ['Roots & Tubers'] },
    { name: { en: 'Radish', vi: 'Củ cải' }, unit: 'piece', cats: ['Roots & Tubers'] },
    // Mushrooms
    { name: { en: 'Shiitake', vi: 'Nấm hương' }, unit: 'g', cats: ['Mushrooms'] },
    { name: { en: 'Button Mushroom', vi: 'Nấm mỡ' }, unit: 'g', cats: ['Mushrooms'] },
    // Eggs
    { name: { en: 'Chicken Egg', vi: 'Trứng gà' }, unit: 'piece', cats: ['Eggs'] },
    // Sauces
    { name: { en: 'Tomato Sauce', vi: 'Xốt cà chua' }, unit: 'ml', cats: ['Sauces'] },
    { name: { en: 'Pesto', vi: 'Xốt Pesto' }, unit: 'ml', cats: ['Sauces'] },
  ];

  const ingredientEntities = await Promise.all(
    ingredientsData.map(i => {
      const ing = new Ingredient();
      ing.name = i.name;
      ing.unit = i.unit;
      ing.types = i.cats.map(cName => catMap[cName]).filter(Boolean);
      ing.isActive = true;
      return AppDataSource.getRepository(Ingredient).save(ing);
    })
  );
  console.log(`Created ${ingredientEntities.length} ingredients.`);

  const ingMap = Object.fromEntries(ingredientEntities.map(i => [i.name.en, i]));

  // 4. Create Recipes - 20
  const recipesData = [
    {
      title: { en: 'Spaghetti Carbonara', vi: 'Mì Ý Carbonara' },
      description: { en: 'Classic Italian pasta dish with eggs, cheese, and bacon.', vi: 'Món mì Ý cổ điển với trứng, phô mai và thịt xông khói.' },
      instructions: { en: '1. Boil spaghetti. 2. Fry bacon. 3. Mix eggs and cheese. 4. Combine all with pasta.', vi: '1. Luộc mì Ý. 2. Chiên thịt xông khói. 3. Trộn trứng và phô mai. 4. Kết hợp tất cả với mì.' },
      ingredients: [
        { name: 'Spaghetti', quantity: '200g' },
        { name: 'Bacon', quantity: '100g' },
        { name: 'Chicken Egg', quantity: '2 pieces' },
        { name: 'Cheese', quantity: '50g' },
        { name: 'Black Pepper', quantity: '1 tsp' },
      ]
    },
    {
      title: { en: 'Chicken Curry', vi: 'Cà ri gà' },
      description: { en: 'Spicy and flavorful chicken curry.', vi: 'Món cà ri gà cay nồng và đậm đà hương vị.' },
      instructions: { en: '1. Sauté onions and garlic. 2. Add chicken and spices. 3. Simmer with water or milk.', vi: '1. Xào hành tây và tỏi. 2. Thêm gà và gia vị. 3. Ninh nhỏ lửa với nước hoặc sữa.' },
      ingredients: [
        { name: 'Chicken Breast', quantity: '500g' },
        { name: 'Onion', quantity: '1 piece' },
        { name: 'Garlic', quantity: '3 cloves' },
        { name: 'Cumin', quantity: '1 tsp' },
        { name: 'Turmeric', quantity: '1 tsp' },
        { name: 'Ginger Powder', quantity: '1 tsp' },
      ]
    },
    {
        title: { en: 'Caesar Salad', vi: 'Salad Caesar' },
        description: { en: 'Fresh romaine lettuce with Caesar dressing and croutons.', vi: 'Xà lách tươi với nước xốt Caesar và bánh mì nướng giòn.' },
        instructions: { en: '1. Chop lettuce. 2. Add croutons and cheese. 3. Toss with dressing.', vi: '1. Cắt nhỏ xà lách. 2. Thêm bánh mì nướng và phô mai. 3. Trộn đều với nước xốt.' },
        ingredients: [
            { name: 'Spinach', quantity: '100g' },
            { name: 'Cheese', quantity: '30g' },
            { name: 'Mayo', quantity: '2 tbsp' },
            { name: 'Mustard', quantity: '1 tsp' },
            { name: 'Garlic', quantity: '1 clove' },
        ]
    },
    {
        title: { en: 'Beef Stir-fry', vi: 'Bò xào' },
        description: { en: 'Quick and easy beef stir-fry with vegetables.', vi: 'Món bò xào rau củ nhanh chóng và dễ dàng.' },
        instructions: { en: '1. Slice beef and vegetables. 2. Sauté beef. 3. Add vegetables and soy sauce.', vi: '1. Thái lát thịt bò và rau củ. 2. Xào thịt bò. 3. Thêm rau củ và nước tương.' },
        ingredients: [
            { name: 'Beef Steak', quantity: '300g' },
            { name: 'Bell Pepper', quantity: '1 piece' },
            { name: 'Broccoli', quantity: '100g' },
            { name: 'Soy Sauce', quantity: '2 tbsp' },
            { name: 'Ginger', quantity: '10g' },
        ]
    },
    {
        title: { en: 'Salmon with Roasted Vegetables', vi: 'Cá hồi kèm rau củ nướng' },
        description: { en: 'Healthy baked salmon with seasonal vegetables.', vi: 'Cá hồi nướng tốt cho sức khỏe với rau củ theo mùa.' },
        instructions: { en: '1. Season salmon. 2. Chop vegetables. 3. Bake all in oven.', vi: '1. Tẩm ướp cá hồi. 2. Cắt nhỏ rau củ. 3. Nướng tất cả trong lò.' },
        ingredients: [
            { name: 'Salmon', quantity: '200g' },
            { name: 'Carrot', quantity: '1 piece' },
            { name: 'Zucchini', quantity: '1 piece' },
            { name: 'Olive Oil', quantity: '1 tbsp' },
            { name: 'Lemon', quantity: '1/2 piece' },
        ]
    },
    {
        title: { en: 'Caprese Salad', vi: 'Salad Caprese' },
        description: { en: 'Simple Italian salad with tomato, basil, and cheese.', vi: 'Salad Ý đơn giản với cà chua, húng quế và phô mai.' },
        instructions: { en: '1. Slice tomatoes and cheese. 2. Layer with basil leaves. 3. Drizzle with olive oil.', vi: '1. Thái lát cà chua và phô mai. 2. Xếp lớp với lá húng quế. 3. Rưới dầu ô liu.' },
        ingredients: [
            { name: 'Tomato', quantity: '2 pieces' },
            { name: 'Cheese', quantity: '100g' },
            { name: 'Basil', quantity: '5 leaves' },
            { name: 'Olive Oil', quantity: '1 tbsp' },
            { name: 'Black Pepper', quantity: '1/2 tsp' },
        ]
    },
    {
        title: { en: 'Guacamole', vi: 'Xốt bơ Guacamole' },
        description: { en: 'Creamy avocado dip with lime and cilantro.', vi: 'Món nhúng bơ béo ngậy với chanh và ngò rí.' },
        instructions: { en: '1. Mash avocados. 2. Mix with lime juice and chopped cilantro. 3. Season with salt.', vi: '1. Nghiền nát bơ. 2. Trộn với nước cốt chanh và ngò rí băm nhỏ. 3. Nêm với muối.' },
        ingredients: [
            { name: 'Avocado', quantity: '2 pieces' },
            { name: 'Lime', quantity: '1 piece' },
            { name: 'Cilantro', quantity: '2 sprigs' },
            { name: 'Salt', quantity: '1/2 tsp' },
            { name: 'Onion', quantity: '1/4 piece' },
        ]
    },
    {
        title: { en: 'Scrambled Eggs with Herbs', vi: 'Trứng xào thảo mộc' },
        description: { en: 'Fluffy scrambled eggs with fresh herbs.', vi: 'Trứng xào tơi xốp với thảo mộc tươi.' },
        instructions: { en: '1. Whisk eggs. 2. Add herbs and salt. 3. Cook in butter.', vi: '1. Đánh trứng. 2. Thêm thảo mộc và muối. 3. Nấu với bơ.' },
        ingredients: [
            { name: 'Chicken Egg', quantity: '3 pieces' },
            { name: 'Parsley', quantity: '1 sprig' },
            { name: 'Butter', quantity: '10g' },
            { name: 'Salt', quantity: '1/4 tsp' },
            { name: 'Black Pepper', quantity: '1/4 tsp' },
        ]
    },
    {
        title: { en: 'Lentil Soup', vi: 'Súp đậu lăng' },
        description: { en: 'Hearty and nutritious lentil soup.', vi: 'Món súp đậu lăng bổ dưỡng và ngon miệng.' },
        instructions: { en: '1. Boil lentils with vegetables. 2. Season with cumin and turmeric. 3. Blend if desired.', vi: '1. Đun sôi đậu lăng với rau củ. 2. Nêm với thì là và nghệ. 3. Xay nhuyễn nếu muốn.' },
        ingredients: [
            { name: 'Lentils', quantity: '1 cup' },
            { name: 'Onion', quantity: '1 piece' },
            { name: 'Carrot', quantity: '1 piece' },
            { name: 'Cumin', quantity: '1 tsp' },
            { name: 'Water', quantity: '500ml' },
        ]
    },
    {
        title: { en: 'Avocado Toast', vi: 'Bánh mì nướng bơ' },
        description: { en: 'Modern breakfast classic with avocado and egg.', vi: 'Món ăn sáng hiện đại với bơ và trứng.' },
        instructions: { en: '1. Toast bread. 2. Mash avocado on top. 3. Add a fried egg.', vi: '1. Nướng bánh mì. 2. Nghiền bơ lên trên. 3. Thêm một quả trứng chiên.' },
        ingredients: [
            { name: 'Bread', quantity: '1 slice' },
            { name: 'Avocado', quantity: '1/2 piece' },
            { name: 'Chicken Egg', quantity: '1 piece' },
            { name: 'Salt', quantity: '1/4 tsp' },
            { name: 'Black Pepper', quantity: '1/4 tsp' },
        ]
    },
    {
        title: { en: 'Greek Salad', vi: 'Salad Hy Lạp' },
        description: { en: 'Refreshing salad with cucumbers, tomatoes, and olives.', vi: 'Món salad thanh mát với dưa leo, cà chua và ô liu.' },
        instructions: { en: '1. Chop vegetables. 2. Add cheese and olives. 3. Toss with olive oil.', vi: '1. Cắt nhỏ rau củ. 2. Thêm phô mai và ô liu. 3. Trộn với dầu ô liu.' },
        ingredients: [
            { name: 'Cucumber', quantity: '1 piece' },
            { name: 'Tomato', quantity: '2 pieces' },
            { name: 'Cheese', quantity: '50g' },
            { name: 'Olive Oil', quantity: '2 tbsp' },
            { name: 'Oregano', quantity: '1/2 tsp' },
        ]
    },
    {
        title: { en: 'Pancakes', vi: 'Bánh Pancakes' },
        description: { en: 'Classic fluffy pancakes for breakfast.', vi: 'Món bánh pancakes tơi xốp cho bữa sáng.' },
        instructions: { en: '1. Mix flour, eggs, and milk. 2. Cook on a griddle. 3. Serve with syrup.', vi: '1. Trộn bột, trứng và sữa. 2. Nấu trên chảo. 3. Dùng kèm với siro.' },
        ingredients: [
            { name: 'Wheat Flour', quantity: '200g' },
            { name: 'Milk', quantity: '300ml' },
            { name: 'Chicken Egg', quantity: '1 piece' },
            { name: 'Sugar', quantity: '2 tbsp' },
            { name: 'Honey', quantity: '1 tbsp' },
        ]
    },
    {
        title: { en: 'Chicken Caesar Wrap', vi: 'Bánh cuộn gà Caesar' },
        description: { en: 'Chicken and Caesar salad wrapped in a tortilla.', vi: 'Gà và salad Caesar cuộn trong bánh tortilla.' },
        instructions: { en: '1. Grill chicken. 2. Mix with salad. 3. Wrap in tortilla.', vi: '1. Nướng gà. 2. Trộn với salad. 3. Cuộn trong bánh tortilla.' },
        ingredients: [
            { name: 'Chicken Breast', quantity: '150g' },
            { name: 'Tortillas', quantity: '1 piece' },
            { name: 'Spinach', quantity: '50g' },
            { name: 'Mayo', quantity: '1 tbsp' },
            { name: 'Cheese', quantity: '20g' },
        ]
    },
    {
        title: { en: 'Tomato Soup', vi: 'Súp cà chua' },
        description: { en: 'Creamy and comforting tomato soup.', vi: 'Món súp cà chua béo ngậy và ấm áp.' },
        instructions: { en: '1. Sauté garlic and onions. 2. Add tomatoes and simmer. 3. Blend with cream.', vi: '1. Xào tỏi và hành tây. 2. Thêm cà chua và ninh nhỏ lửa. 3. Xay nhuyễn với kem.' },
        ingredients: [
            { name: 'Tomato', quantity: '5 pieces' },
            { name: 'Garlic', quantity: '2 cloves' },
            { name: 'Cream', quantity: '50ml' },
            { name: 'Basil', quantity: '2 leaves' },
            { name: 'Water', quantity: '200ml' },
        ]
    },
    {
        title: { en: 'Shrimp Scampi', vi: 'Tôm Scampi' },
        description: { en: 'Shrimp sautéed in garlic and lemon butter.', vi: 'Tôm xào tỏi và bơ chanh.' },
        instructions: { en: '1. Sauté garlic in butter. 2. Add shrimp and lemon juice. 3. Toss with pasta.', vi: '1. Xào tỏi với bơ. 2. Thêm tôm và nước cốt chanh. 3. Trộn với mì Ý.' },
        ingredients: [
            { name: 'Shrimp', quantity: '200g' },
            { name: 'Garlic', quantity: '3 cloves' },
            { name: 'Lemon', quantity: '1/2 piece' },
            { name: 'Butter', quantity: '20g' },
            { name: 'Spaghetti', quantity: '100g' },
        ]
    },
    {
        title: { en: 'Beef Tacos', vi: 'Bánh Tacos bò' },
        description: { en: 'Flavorful beef tacos with fresh toppings.', vi: 'Món bánh tacos bò đậm đà với các loại nhân tươi.' },
        instructions: { en: '1. Cook ground beef with spices. 2. Warm tortillas. 3. Fill with beef and toppings.', vi: '1. Nấu thịt bò xay với gia vị. 2. Làm ấm bánh tortilla. 3. Cho thịt bò và nhân vào.' },
        ingredients: [
            { name: 'Ground Beef', quantity: '300g' },
            { name: 'Tortillas', quantity: '3 pieces' },
            { name: 'Chili Powder', quantity: '1 tsp' },
            { name: 'Cumin', quantity: '1/2 tsp' },
            { name: 'Tomato', quantity: '1 piece' },
        ]
    },
    {
        title: { en: 'Pasta Primavera', vi: 'Pasta Primavera' },
        description: { en: 'Light pasta dish with fresh spring vegetables.', vi: 'Món pasta nhẹ nhàng với rau củ tươi mùa xuân.' },
        instructions: { en: '1. Boil pasta. 2. Sauté vegetables. 3. Combine with olive oil and cheese.', vi: '1. Luộc mì. 2. Xào rau củ. 3. Kết hợp với dầu ô liu và phô mai.' },
        ingredients: [
            { name: 'Penne', quantity: '200g' },
            { name: 'Bell Pepper', quantity: '1 piece' },
            { name: 'Zucchini', quantity: '1/2 piece' },
            { name: 'Broccoli', quantity: '100g' },
            { name: 'Olive Oil', quantity: '2 tbsp' },
        ]
    },
    {
        title: { en: 'Fruit Salad', vi: 'Salad trái cây' },
        description: { en: 'Mixed fresh fruits with a hint of lime.', vi: 'Trái cây tươi hỗn hợp với một chút chanh.' },
        instructions: { en: '1. Chop fruits. 2. Mix together. 3. Drizzle with lime juice.', vi: '1. Cắt nhỏ trái cây. 2. Trộn với nhau. 3. Rưới nước cốt chanh.' },
        ingredients: [
            { name: 'Apple', quantity: '1 piece' },
            { name: 'Banana', quantity: '1 piece' },
            { name: 'Orange', quantity: '1 piece' },
            { name: 'Grapes', quantity: '100g' },
            { name: 'Lime', quantity: '1/2 piece' },
        ]
    },
    {
        title: { en: 'Grilled Cheese Sandwich', vi: 'Bánh mì nướng phô mai' },
        description: { en: 'Classic toasted sandwich with melted cheese.', vi: 'Món bánh mì nướng cổ điển với phô mai tan chảy.' },
        instructions: { en: '1. Butter bread. 2. Add cheese between slices. 3. Grill until golden.', vi: '1. Phết bơ lên bánh mì. 2. Thêm phô mai vào giữa các lát. 3. Nướng cho đến khi vàng giòn.' },
        ingredients: [
            { name: 'Bread', quantity: '2 slices' },
            { name: 'Cheese', quantity: '50g' },
            { name: 'Butter', quantity: '10g' },
        ]
    },
    {
        title: { en: 'Roasted Chicken', vi: 'Gà nướng' },
        description: { en: 'Whole roasted chicken with herbs and vegetables.', vi: 'Gà nướng nguyên con với thảo mộc và rau củ.' },
        instructions: { en: '1. Season chicken with herbs. 2. Roast in oven with vegetables.', vi: '1. Tẩm ướp gà với thảo mộc. 2. Nướng trong lò với rau củ.' },
        ingredients: [
            { name: 'Chicken Breast', quantity: '500g' },
            { name: 'Rosemary', quantity: '1 sprig' },
            { name: 'Garlic', quantity: '2 cloves' },
            { name: 'Potato', quantity: '2 pieces' },
            { name: 'Carrot', quantity: '1 piece' },
        ]
    },
  ];

  for (const rData of recipesData) {
    const recipe = new Recipe();
    recipe.title = rData.title;
    recipe.description = rData.description;
    recipe.instructions = rData.instructions;
    recipe.isActive = true;

    const riEntities = rData.ingredients.map(riData => {
      const ri = new RecipeIngredient();
      ri.ingredient = ingMap[riData.name];
      ri.quantity = riData.quantity;
      if (!ri.ingredient) {
          console.warn(`Ingredient not found: ${riData.name}`);
      }
      return ri;
    }).filter(ri => ri.ingredient);

    recipe.recipeIngredients = riEntities;
    await AppDataSource.getRepository(Recipe).save(recipe);
  }

  console.log(`Created ${recipesData.length} recipes.`);

  await AppDataSource.destroy();
  console.log('Seed completed successfully!');
}

seed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
