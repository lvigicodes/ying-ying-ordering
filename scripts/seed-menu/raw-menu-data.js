// CommonJS export for use in seed script
// Raw menu data lifted directly from public/menu.html — do not transform here.

const menuItems = [
    { id: 1, name: "Kebab", price: 130, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 2, name: "Fried Wanton", price: 210, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 3, name: "Fried Dumpling", price: 210, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 4, name: "Fried Fish Ball", price: 190, category: "Dimsum", station: "lower", image: "🐟" },
    { id: 5, name: "Fried Fish Cake", price: 190, category: "Dimsum", station: "lower", image: "🐟" },
    { id: 6, name: "Shrimp Cheong Fan", price: 125, category: "Dimsum", station: "lower", image: "🦐" },
    { id: 7, name: "Beef Cheong Fan", price: 125, category: "Dimsum", station: "lower", image: "🥩" },
    { id: 8, name: "Asado Cheong Fan", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 9, name: "Vegetable Cheong Fan", price: 125, category: "Dimsum", station: "lower", image: "🥬" },
    { id: 10, name: "Hebe Cheong Fan", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 11, name: "Plain Cheong Fan", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 12, name: "Special Pao", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 13, name: "Silver Roll", price: null, category: "Dimsum", station: "lower", variations: [
        { size: "Steam", price: 60 },
        { size: "Fried", price: 60 }
    ], image: "🥟" },
    { id: 14, name: "Asado Pao", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 15, name: "Lin Yong Pao", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 16, name: "Black Mongo Pao", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 17, name: "Cua Pao", price: null, category: "Dimsum", station: "lower", variations: [
        { size: "Steam", price: 100 },
        { size: "Fried", price: 100 }
    ], image: "🥟" },
    { id: 18, name: "Spring Roll", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 19, name: "Pineapple Bread", price: 120, category: "Dimsum", station: "lower", image: "🍞" },
    { id: 20, name: "Asado Roll", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 21, name: "Egg Tart", price: 120, category: "Dimsum", station: "lower", image: "🥧" },
    { id: 22, name: "Taro Puff", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 23, name: "Butchi", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 24, name: "Hot Salad Roll", price: 125, category: "Dimsum", station: "lower", image: "🥬" },
    { id: 25, name: "Asado Bun", price: 135, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 26, name: "Pork Siomai", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 27, name: "Hakao", price: 135, category: "Dimsum", station: "lower", image: "🦐" },
    { id: 28, name: "Japanese Siomai", price: 135, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 29, name: "Crabstick Roll", price: 135, category: "Dimsum", station: "lower", image: "🦀" },
    { id: 30, name: "Chicken Feet", price: 120, category: "Dimsum", station: "lower", image: "🐔" },
    { id: 31, name: "Spareribs", price: 120, category: "Dimsum", station: "lower", image: "🥩" },
    { id: 32, name: "Beef Ball", price: 120, category: "Dimsum", station: "lower", image: "🥩" },
    { id: 33, name: "Goto", price: 120, category: "Dimsum", station: "lower", image: "🍲" },
    { id: 34, name: "Shark's Fin", price: 125, category: "Dimsum", station: "lower", image: "🐟" },
    { id: 35, name: "Chiu Chao Dumpling", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 36, name: "Vegetable Dumpling", price: 120, category: "Dimsum", station: "lower", image: "🥬" },
    { id: 37, name: "Kutchay Dumpling", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 38, name: "Shaolong Bao", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 39, name: "Steamed Lumpia", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 40, name: "Lo Mai Kai", price: 120, category: "Dimsum", station: "lower", image: "🍚" },
    { id: 41, name: "Chicken Taro", price: 125, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 42, name: "Ham Suy Kok", price: 120, category: "Dimsum", station: "lower", image: "🥟" },
    { id: 43, name: "Raddish Cake", price: 120, category: "Dimsum", station: "lower", image: "🥘" },
    { id: 50, name: "Ampalaya Scrambled Egg", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍚" },
    { id: 51, name: "Curry Fish Fillet", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🐟" },
    { id: 52, name: "Curry Chicken", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍗" },
    { id: 53, name: "Curry Beef", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 54, name: "Sweet & Sour Fish Fillet", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🐟" },
    { id: 55, name: "Sweet & Sour Pork", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 56, name: "Hong Ma", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍚" },
    { id: 73, name: "Ampalaya Shrimp", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🦐" },
    { id: 74, name: "Ampalaya Fish Fillet", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🐟" },
    { id: 75, name: "Ampalaya Beef", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 76, name: "Ampalaya Chicken", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍗" },
    { id: 77, name: "Chopsuey", price: null, category: "Toppings", station: "upper", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥬" },
    { id: 57, name: "Tomato Pork Chop", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 58, name: "Chicken Mushroom", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍗" },
    { id: 59, name: "Curry Beef Brisket", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 60, name: "Chicken Feet Spareribs", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 250 },
        { size: "Fried Rice", price: 275 }
    ], image: "🍗" },
    { id: 61, name: "Steamed Minced Beef", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 62, name: "Asado", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 63, name: "Lechon Kawali", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🥩" },
    { id: 64, name: "White Chicken", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍗" },
    { id: 65, name: "Soy Chicken", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 200 },
        { size: "Fried Rice", price: 225 }
    ], image: "🍗" },
    { id: 66, name: "Roast Duck", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 210 },
        { size: "Fried Rice", price: 235 }
    ], image: "🦆" },
    { id: 67, name: "Soy Chicken Roast Duck", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 230 },
        { size: "Fried Rice", price: 255 }
    ], image: "🍗" },
    { id: 68, name: "Roast Duck Asado", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 230 },
        { size: "Fried Rice", price: 255 }
    ], image: "🦆" },
    { id: 69, name: "Lechon Kawali Roast Duck", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 230 },
        { size: "Fried Rice", price: 255 }
    ], image: "🥩" },
    { id: 70, name: "White Chicken Roast Duck", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 230 },
        { size: "Fried Rice", price: 255 }
    ], image: "🍗" },
    { id: 71, name: "Lechon Kawali Asado", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 210 },
        { size: "Fried Rice", price: 235 }
    ], image: "🥩" },
    { id: 72, name: "Ying Ying Mixed", price: null, category: "Toppings", station: "lower", variations: [
        { size: "Plain Rice", price: 250 },
        { size: "Fried Rice", price: 275 }
    ], image: "🍚" },
    { id: 80, name: "Roast Peking Duck", price: null, category: "Roasting", station: "lower", variations: [
        { size: "1 Whole", price: 2000 },
        { size: "1/2", price: 1000 },
        { size: "1/4", price: 500 }
    ], image: "🦆" },
    { id: 81, name: "Asado", price: null, category: "Roasting", station: "lower", variations: [
        { size: "1 KL", price: 1100 },
        { size: "1/2", price: 550 },
        { size: "1/4", price: 275 }
    ], image: "🥩" },
    { id: 82, name: "Lechon Kawali", price: null, category: "Roasting", station: "lower", variations: [
        { size: "1 KL", price: 1100 },
        { size: "1/2", price: 550 },
        { size: "1/4", price: 275 }
    ], image: "🥩" },
    { id: 83, name: "White Chicken", price: null, category: "Roasting", station: "lower", variations: [
        { size: "1 Whole", price: 490 },
        { size: "1/2", price: 245 },
        { size: "1/4", price: 130 }
    ], image: "🍗" },
    { id: 84, name: "Soy Chicken", price: null, category: "Roasting", station: "lower", variations: [
        { size: "1 Whole", price: 490 },
        { size: "1/2", price: 245 },
        { size: "1/4", price: 130 }
    ], image: "🍗" },
    { id: 85, name: "Cold Cuts", price: null, category: "Roasting", station: "lower", variations: [
        { size: "Large", price: 1100 },
        { size: "Medium", price: 550 },
        { size: "Small", price: 320 }
    ], image: "🥩" },
    { id: 90, name: "Buttered Chicken", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 91, name: "Lemon Chicken", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 92, name: "Okiam Chicken", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 93, name: "Boneless Chicken with Garlic", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 94, name: "Sliced Chicken with Oyster Sauce", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 95, name: "Diced Chicken with Cashew Nut", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🍗" },
    { id: 96, name: "Sliced Chicken with Vegetable", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 97, name: "Diced Chicken (Sze Chuan Style)", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍗" },
    { id: 98, name: "Ying Ying Fried Chicken", price: null, category: "Chicken", station: "upper", variations: [
        { size: "Whole", price: 510 },
        { size: "Half", price: 255 }
    ], image: "🍗" },
    { id: 99, name: "Stuffed Chicken", price: 780, category: "Chicken", station: "upper", image: "🍗" },
    { id: 100, name: "Hot Sour Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 101, name: "Fish Lip Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 102, name: "Spinach Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 103, name: "Minced Beef Thick Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 104, name: "Bean Curd w/ 8 Treasure Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 105, name: "Seafood Bean Curd Clear Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 106, name: "Corn Soup w/ Quail Egg", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 107, name: "Corn Soup with Crab Meat", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 108, name: "Corn Soup w/ Minced Chicken", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 109, name: "Bird Nest w/ Quail Egg", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 110, name: "Bird Nest w/ Crab Meat", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 111, name: "Bird Nest w/ Minced Chicken", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 112, name: "Oyster Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 113, name: "Sliced Pork w/ Salted Egg Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 114, name: "Mashed Fish w/ Egg Thick Soup", price: null, category: "Soup", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍲" },
    { id: 120, name: "Coffee", price: null, category: "Drinks", station: "lower", variations: {
        temperature: [
            { name: "Hot", price: 65 },
            { name: "Cold", price: 85 }
        ]
    }, image: "☕" },
    { id: 121, name: "Milk Tea", price: null, category: "Drinks", station: "lower", variations: {
        temperature: [
            { name: "Hot", price: 70 },
            { name: "Cold", price: 85 }
        ]
    }, image: "🧋" },
    { id: 122, name: "Lemon Tea", price: null, category: "Drinks", station: "lower", variations: {
        temperature: [
            { name: "Hot", price: 70 },
            { name: "Cold", price: 85 }
        ]
    }, image: "🍋" },
    { id: 123, name: "Fresh Lemonade", price: null, category: "Drinks", station: "lower", variations: {
        temperature: [
            { name: "Hot", price: 70 },
            { name: "Cold", price: 85 }
        ]
    }, image: "🍋" },
    { id: 124, name: "Chocolate", price: null, category: "Drinks", station: "lower", variations: {
        temperature: [
            { name: "Hot", price: 100 },
            { name: "Cold", price: 120 }
        ]
    }, image: "🍫" },
    { id: 125, name: "Coffee & Milk Tea", price: null, category: "Drinks", station: "lower", variations: {
        temperature: [
            { name: "Hot", price: 70 },
            { name: "Cold", price: 85 }
        ]
    }, image: "☕" },
    { id: 126, name: "Soy Milk", price: 55, category: "Drinks", station: "lower", image: "🥛" },
    { id: 127, name: "Sugarcane Juice", price: 80, category: "Drinks", station: "lower", image: "🌾" },
    { id: 128, name: "Calamansi Juice", price: 55, category: "Drinks", station: "lower", image: "🍋" },
    { id: 129, name: "Fruit Shake", price: null, category: "Drinks", station: "lower", variations: {
        flavor: [
            { name: "Mango", price: 95 },
            { name: "Green Mango", price: 95 },
            { name: "Watermelon", price: 95 },
            { name: "Pineapple", price: 95 },
            { name: "Four Season", price: 100 }
        ],
        addons: [
            { name: "With Sago", priceModifier: 5 }
        ]
    }, image: "🍹" },
    { id: 134, name: "Gulaman", price: null, category: "Drinks", station: "lower", variations: {
        flavor: [
            { name: "Black", price: 85 },
            { name: "White", price: 85 },
            { name: "Mix", price: 85 }
        ]
    }, image: "🥤" },
    { id: 136, name: "Softdrink in Can", price: 55, category: "Drinks", station: "lower", image: "🥤" },
    { id: 137, name: "Distilled Water", price: 25, category: "Drinks", station: "lower", image: "💧" },
    { id: 140, name: "Mango Sago", price: 320, category: "Dessert", station: "lower", image: "🥭" },
    { id: 141, name: "Mango with Almond Jelly", price: 320, category: "Dessert", station: "lower", image: "🥭" },
    { id: 142, name: "Sliced Mixed Fruits", price: 620, category: "Dessert", station: "lower", image: "🍎" },
    { id: 152, name: "Roast Duck Congee", price: 210, category: "Congee", station: "lower", image: "🍚" },
    { id: 153, name: "Fish Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 154, name: "Meat Ball Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 155, name: "Pork Century Egg Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 156, name: "Mixed Meat Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 157, name: "Beef Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 158, name: "Soy Chicken Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 159, name: "White Chicken Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 160, name: "Asado Congee", price: 185, category: "Congee", station: "lower", image: "🍚" },
    { id: 150, name: "Asado Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 151, name: "Roast Duck Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 210 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 161, name: "Wanton Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 162, name: "Dumpling Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 163, name: "Beef Brisket Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 164, name: "Gutchap Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 165, name: "Fish Cake Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 166, name: "Fish Ball Mami", price: null, category: "Mami", station: "lower", variations: {
        size: [{ name: "Regular", price: 185 }],
        noodle: [
            { name: "Egg Noodle", priceModifier: 0 },
            { name: "Bihon", priceModifier: 0 },
            { name: "Hofan", priceModifier: 0 }
        ],
        style: [
            { name: "Original", priceModifier: 0 },
            { name: "Toasted", priceModifier: 10 }
        ],
        addons: [
            { name: "Extra Soup", priceModifier: 0 }
        ]
    }, image: "🍜" },
    { id: 170, name: "Sizzling Stuff Bean Curd", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥘" },
    { id: 171, name: "Sizzling Beef Ginger Onion", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥘" },
    { id: 172, name: "Sizzling 3 Kinds Vegetable", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥘" },
    { id: 173, name: "Sizzling Oyster", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥘" },
    { id: 174, name: "Sizzling Chicken with Tausi", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥘" },
    { id: 175, name: "Sizzling Shrimp with Bean Curd", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🥘" },
    { id: 176, name: "Sizzling Shrimp (Sze Chuan Style)", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🥘" },
    { id: 177, name: "Sizzling Fish Fillet", price: null, category: "Sizzling", station: "lower", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥘" },
    { id: 180, name: "Polonchay", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 300 },
        { size: "Medium", price: 450 },
        { size: "Large", price: 900 }
    ], image: "🥬" },
    { id: 181, name: "Spinach", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 182, name: "Taiwan Pechay", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 183, name: "Asparagus", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 300 },
        { size: "Medium", price: 450 },
        { size: "Large", price: 900 }
    ], image: "🥬" },
    { id: 184, name: "Mustasa", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 185, name: "Kangkong", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 186, name: "Lettuce", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 187, name: "Kaylan", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 188, name: "Brocoli Flower", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 300 },
        { size: "Medium", price: 450 },
        { size: "Large", price: 900 }
    ], image: "🥦" },
    { id: 189, name: "Celery", price: null, category: "Vegetable", station: "upper", variations: [
        { size: "Small", price: 280 },
        { size: "Medium", price: 420 },
        { size: "Large", price: 840 }
    ], image: "🥬" },
    { id: 190, name: "Shredded Chicken Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍚" },
    { id: 191, name: "Two Color Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 480 },
        { size: "Medium", price: 720 },
        { size: "Large", price: 1440 }
    ], image: "🍚" },
    { id: 192, name: "Pineapple Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 480 },
        { size: "Medium", price: 720 },
        { size: "Large", price: 1440 }
    ], image: "🍚" },
    { id: 193, name: "Lotus Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 480 },
        { size: "Medium", price: 720 },
        { size: "Large", price: 1440 }
    ], image: "🍚" },
    { id: 194, name: "Fookien Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 340 },
        { size: "Medium", price: 510 },
        { size: "Large", price: 1020 }
    ], image: "🍚" },
    { id: 195, name: "Seafoods Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍚" },
    { id: 196, name: "Kiampong Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍚" },
    { id: 197, name: "Salted Fish Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 320 },
        { size: "Medium", price: 480 },
        { size: "Large", price: 960 }
    ], image: "🍚" },
    { id: 198, name: "Yang Chow Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍚" },
    { id: 199, name: "Minced Beef Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍚" },
    { id: 200, name: "Garlic Fried Rice", price: null, category: "Fried Rice", station: "upper", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍚" },
    { id: 210, name: "King Dao Porkchop", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 211, name: "Salt and Chili Porkchop", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 212, name: "Cutlet Porkchop", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 213, name: "Sweet and Sour Pork", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 214, name: "Pork Kidney Liver with Ginger Onion", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 215, name: "Minced Pork with Lettuce", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🥩" },
    { id: 216, name: "Steamed Minced Pork with Salted Egg", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🥩" },
    { id: 217, name: "Steamed Minced Pork with Salted Fish", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🥩" },
    { id: 218, name: "Steamed Minced Pork with Squid", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🥩" },
    { id: 219, name: "Minced Pork with Sliced Bean", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 220, name: "Hong Ma Fookien Style", price: null, category: "Pork", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🥩" },
    { id: 221, name: "Pata Tim", price: 1000, category: "Pork", station: "upper", image: "🥩" },
    { id: 230, name: "Sliced Beef with Vegetables", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 231, name: "Sliced Beef with Oyster Sauce", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 232, name: "Sliced Beef with Ampalaya", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 233, name: "Sliced Beef Chinese Style", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 234, name: "Sliced Beef with Tausi Chili", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 235, name: "Sliced Beef with Tomato Sauce", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 236, name: "Sliced Beef with Black Pepper", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 237, name: "Sliced Beef with Satay Sauce", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 238, name: "Sliced Beef with Curry Sauce", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 239, name: "Fried Crispy Beef", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 240, name: "Sliced Beef Button Mushroom", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 241, name: "Sliced Beef Scrambled Egg", price: null, category: "Beef", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🥩" },
    { id: 250, name: "Hot Prawn Salad", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 470 },
        { size: "Medium", price: 705 },
        { size: "Large", price: 1410 }
    ], image: "🦐" },
    { id: 251, name: "Crystal Prawn", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🦐" },
    { id: 252, name: "Saute Shrimp", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🦐" },
    { id: 253, name: "Prawn Cutlet", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🦐" },
    { id: 254, name: "Shrimp w/ Sze Chuan", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🦐" },
    { id: 255, name: "Saute Shrimp Cashew Nut", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 470 },
        { size: "Medium", price: 705 },
        { size: "Large", price: 1410 }
    ], image: "🦐" },
    { id: 256, name: "Saute Shrimp w/ Vegetable", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🦐" },
    { id: 257, name: "Saute Shrimp w/ Scramble Egg", price: null, category: "Shrimps", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🦐" },
    { id: 258, name: "Fried Squid Salt & Chili", price: null, category: "Squid", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦑" },
    { id: 259, name: "Saute Squid w/ Vegetable", price: null, category: "Squid", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦑" },
    { id: 260, name: "Saute Squid w/ Tausi Pepper", price: null, category: "Squid", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦑" },
    { id: 261, name: "Boiled Squid", price: null, category: "Squid", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦑" },
    { id: 262, name: "Saute Squid", price: null, category: "Squid", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦑" },
    { id: 263, name: "Cutlet Squid", price: null, category: "Squid", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦑" },
    { id: 270, name: "Boiled Fish Fillet", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 271, name: "Fish Fillet Tausi Chili", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 272, name: "Saute Fish Fillet", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 273, name: "Fish Fillet White Sauce", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 274, name: "Fish Fillet Sweet Corn Sauce", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 275, name: "Sweet and Sour Fish Fillet", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 276, name: "Fish Fillet w/ Vegetable", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 277, name: "Fish Fillet Salt and Chili", price: null, category: "Fish Fillet", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🐟" },
    { id: 278, name: "Fried Crispy Oyster", price: null, category: "Oyster", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦪" },
    { id: 279, name: "Oyster w/ Ginger Onion", price: null, category: "Oyster", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦪" },
    { id: 280, name: "Oyster Cake", price: null, category: "Oyster", station: "upper", variations: [
        { size: "Fookien Style", price: 370 },
        { size: "HK Style", price: 370 }
    ], image: "🦪" },
    { id: 282, name: "Boiled Oyster", price: null, category: "Oyster", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦪" },
    { id: 283, name: "Oyster Salt & Chili", price: null, category: "Oyster", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🦪" },
    { id: 290, name: "Spareribs Taro Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍲" },
    { id: 291, name: "Chicken Taro Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍲" },
    { id: 292, name: "Fish Fillet Beancurd Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🍲" },
    { id: 293, name: "Seafood Beancurd Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🍲" },
    { id: 294, name: "Minced Pork with Eggplant Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍲" },
    { id: 295, name: "Fish Head Ginger and Onion Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🍲" },
    { id: 296, name: "Goat Meat Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 420 },
        { size: "Medium", price: 630 },
        { size: "Large", price: 1260 }
    ], image: "🍲" },
    { id: 297, name: "Raddish Gutchap Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🍲" },
    { id: 298, name: "Raddish Beef Brisket Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 390 },
        { size: "Medium", price: 585 },
        { size: "Large", price: 1170 }
    ], image: "🍲" },
    { id: 299, name: "Chicken Ginger Onion Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍲" },
    { id: 300, name: "Beancurd Kawali Beancurd Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍲" },
    { id: 301, name: "Steamed Chicken Mushroom Hotpot", price: null, category: "Hotpot", station: "upper", variations: [
        { size: "Small", price: 370 },
        { size: "Medium", price: 555 },
        { size: "Large", price: 1110 }
    ], image: "🍲" },
    { id: 310, name: "Seafood Misua Soup", price: null, category: "Noodles", station: "lower", variations: [
        { size: "Small", price: 220 },
        { size: "Medium", price: 330 },
        { size: "Large", price: 660 }
    ], image: "🍜" },
    { id: 311, name: "Cha Misua", price: null, category: "Noodles", station: "lower", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍜" },
    { id: 312, name: "Shrimp & Pork Noodles", price: null, category: "Noodles", station: "lower", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍜" },
    { id: 313, name: "Seafood Noodles (HK)", price: null, category: "Noodles", station: "lower", variations: [
        { size: "Small", price: 290 },
        { size: "Medium", price: 435 },
        { size: "Large", price: 870 }
    ], image: "🍜" },
    { id: 314, name: "Singapore Bihon", price: 290, category: "Bihon", station: "lower", image: "🍜" },
    { id: 315, name: "Pata Bihon", price: 320, category: "Bihon", station: "lower", image: "🍜" },
    { id: 316, name: "Seafood Bihon", price: 290, category: "Bihon", station: "lower", image: "🍜" },
    { id: 317, name: "Fookien Bihon", price: 290, category: "Bihon", station: "lower", image: "🍜" },
    { id: 318, name: "Shredded Pork Hofan", price: 290, category: "Hofan", station: "lower", image: "🍜" },
    { id: 319, name: "Shrimp & Pork Hofan", price: 290, category: "Hofan", station: "lower", image: "🍜" },
    { id: 320, name: "Tausi Chili Spareribs Hofan", price: 290, category: "Hofan", station: "lower", image: "🍜" },
    { id: 321, name: "Beef Hofan (Dry)", price: 290, category: "Hofan", station: "lower", image: "🍜" },
    { id: 322, name: "Beef Hofan", price: 290, category: "Hofan", station: "lower", image: "🍜" },
    { id: 323, name: "Seafood Hofan", price: 290, category: "Hofan", station: "lower", image: "🍜" },
];

// Fixed category display order from getCategories() in menu.html
const categoryOrder = [
    'Dimsum',
    'Toppings',
    'Mami',
    'Congee',
    'Sizzling',
    'Vegetable',
    'Fried Rice',
    'Roasting',
    'Beef',
    'Pork',
    'Chicken',
    'Shrimps',
    'Squid',
    'Fish Fillet',
    'Oyster',
    'Noodles',
    'Bihon',
    'Hofan',
    'Soup',
    'Hotpot',
    'Drinks',
    'Dessert'
];

module.exports = { menuItems, categoryOrder };
