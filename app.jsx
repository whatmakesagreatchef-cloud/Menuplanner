import React, { useState } from 'react';
import { Plus, Trash2, Calculator, Save, Download, DollarSign, Scale, AlertCircle, CheckCircle } from 'lucide-react';

export default function RecipePlanner() {
  const [mode, setMode] = useState('scenario');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState({
    name: '',
    servings: 4,
    ingredients: [],
    method: '',
    category: 'Entree',
    dietaryInfo: [],
    targetCostPerServing: 0
  });
  
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    costPerUnit: '',
    supplier: 'General'
  });

  const [sellingPrice, setSellingPrice] = useState('');
  const [showIngredientDB, setShowIngredientDB] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [showSeasonalOnly, setShowSeasonalOnly] = useState(false);

  // Get current month for seasonal checking (0-11)
  const currentMonth = new Date().getMonth();

  // Seasonal availability by month (true = in season)
  const seasonalCalendar = {
    'Barramundi fillet': [1,1,1,1,1,1,1,1,1,1,1,1], // Year-round
    'King prawns': [1,1,0,0,0,0,0,0,1,1,1,1], // Summer/Autumn/Winter
    'Salmon fillet': [1,1,1,1,0,0,0,0,0,1,1,1], // Cooler months
    'Asparagus': [0,0,0,0,0,0,0,1,1,1,0,0], // Spring (Aug-Oct)
    'Cherry tomatoes': [1,1,1,0,0,0,0,0,0,1,1,1], // Summer/Autumn
    'Broccoli': [0,0,1,1,1,1,1,1,0,0,0,0], // Autumn/Winter
    'Sweet potato': [0,0,1,1,1,1,1,0,0,0,0,0], // Autumn/Winter
    'Potatoes': [1,1,1,1,1,1,1,1,1,1,1,1], // Year-round
    'Carrots': [1,1,1,1,1,1,1,1,1,1,1,1], // Year-round
    'Button mushrooms': [1,1,1,1,1,1,1,1,1,1,1,1], // Year-round
    'Lemons': [1,1,1,1,1,1,1,0,0,0,1,1], // Winter/Spring
    'Parsley': [1,1,1,1,1,1,1,1,1,1,1,1], // Year-round
    'Garlic': [1,1,1,1,1,1,1,1,1,1,1,1], // Year-round
    'Onions': [1,1,1,1,1,1,1,1,1,1,1,1] // Year-round
  };

  // Multi-supplier pricing comparison with REAL PERTH SUPPLIERS
  const ingredientDatabase = {
    'Chicken thigh': {
      suppliers: [
        { name: 'Mondos Poultry', unit: 'kg', cost: 8.50, quality: 'Hormone Free', contact: 'Canning Vale' },
        { name: 'Bidfood Perth', unit: 'kg', cost: 8.20, quality: 'Standard', contact: 'Welshpool' },
        { name: 'PFD Food Services', unit: 'kg', cost: 9.10, quality: 'Premium', contact: 'Malaga' }
      ],
      seasonal: false
    },
    'Chicken breast': {
      suppliers: [
        { name: 'Mondos Poultry', unit: 'kg', cost: 12.00, quality: 'Hormone Free', contact: 'Canning Vale' },
        { name: 'Bidfood Perth', unit: 'kg', cost: 11.50, quality: 'Standard', contact: 'Welshpool' },
        { name: 'Lilydale Free Range', unit: 'kg', cost: 16.50, quality: 'Free Range', contact: 'Various' }
      ],
      seasonal: false
    },
    'Barramundi fillet': {
      suppliers: [
        { name: 'Fins Seafood', unit: 'kg', cost: 35.00, quality: 'WA Fresh', contact: 'Fishing Boat Harbour' },
        { name: 'Kailis Bros', unit: 'kg', cost: 38.00, quality: 'Premium Fresh', contact: 'Leederville' },
        { name: 'De Luca Seafood', unit: 'kg', cost: 32.50, quality: 'Frozen', contact: 'Fremantle Markets' }
      ],
      seasonal: seasonalCalendar['Barramundi fillet'][currentMonth] === 1
    },
    'King prawns': {
      suppliers: [
        { name: 'Kailis Bros', unit: 'kg', cost: 42.00, quality: 'WA Wild Caught', contact: 'Leederville' },
        { name: 'Fins Seafood', unit: 'kg', cost: 40.00, quality: 'Local Fresh', contact: 'Fishing Boat Harbour' },
        { name: 'Exmouth Gulf', unit: 'kg', cost: 52.00, quality: 'Premium Wild', contact: 'Direct' }
      ],
      seasonal: seasonalCalendar['King prawns'][currentMonth] === 1
    },
    'Salmon fillet': {
      suppliers: [
        { name: 'Kailis Bros', unit: 'kg', cost: 38.00, quality: 'Tasmanian', contact: 'Leederville' },
        { name: 'Fins Seafood', unit: 'kg', cost: 36.00, quality: 'Atlantic', contact: 'Fishing Boat Harbour' },
        { name: 'De Luca Seafood', unit: 'kg', cost: 34.00, quality: 'Standard', contact: 'Fremantle Markets' }
      ],
      seasonal: seasonalCalendar['Salmon fillet'][currentMonth] === 1
    },
    'Beef scotch fillet': {
      suppliers: [
        { name: 'Harvey Beef', unit: 'kg', cost: 45.00, quality: 'WA Grass Fed', contact: 'Harvey' },
        { name: 'Mondo Quality Meats', unit: 'kg', cost: 42.00, quality: 'Premium', contact: 'Canning Vale' },
        { name: 'Vics Premium Quality Meat', unit: 'kg', cost: 48.00, quality: 'Aged Beef', contact: 'Inglewood' }
      ],
      seasonal: false
    },
    'Lamb cutlets': {
      suppliers: [
        { name: 'Mondo Quality Meats', unit: 'kg', cost: 32.00, quality: 'WA Lamb', contact: 'Canning Vale' },
        { name: 'Vics Premium Quality Meat', unit: 'kg', cost: 35.00, quality: 'Premium', contact: 'Inglewood' },
        { name: 'Bidfood Perth', unit: 'kg', cost: 29.50, quality: 'Standard', contact: 'Welshpool' }
      ],
      seasonal: false
    },
    'Pork loin': {
      suppliers: [
        { name: 'Linley Valley Pork', unit: 'kg', cost: 18.00, quality: 'Free Range WA', contact: 'Northam' },
        { name: 'Mondo Quality Meats', unit: 'kg', cost: 16.50, quality: 'Standard', contact: 'Canning Vale' },
        { name: 'Bidfood Perth', unit: 'kg', cost: 14.50, quality: 'Economy', contact: 'Welshpool' }
      ],
      seasonal: false
    },
    'Potatoes': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 2.50, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 2.20, quality: 'Local', contact: 'Canning Vale Markets' },
        { name: 'Tony Ale & Sons', unit: 'kg', cost: 2.80, quality: 'Premium WA', contact: 'Wanneroo' }
      ],
      seasonal: seasonalCalendar['Potatoes'][currentMonth] === 1
    },
    'Sweet potato': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 3.20, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 2.80, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Sweet potato'][currentMonth] === 1
    },
    'Carrots': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 2.00, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 1.80, quality: 'Local', contact: 'Canning Vale Markets' },
        { name: 'Perth Organic', unit: 'kg', cost: 3.50, quality: 'Certified Organic', contact: 'Wanneroo' }
      ],
      seasonal: seasonalCalendar['Carrots'][currentMonth] === 1
    },
    'Broccoli': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 4.50, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 3.80, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Broccoli'][currentMonth] === 1
    },
    'Asparagus': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'bunch', cost: 3.50, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'bunch', cost: 3.20, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Asparagus'][currentMonth] === 1
    },
    'Cherry tomatoes': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 8.00, quality: 'WA Hydroponic', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 7.50, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Cherry tomatoes'][currentMonth] === 1
    },
    'Button mushrooms': {
      suppliers: [
        { name: 'Perth Mushroom Co', unit: 'kg', cost: 12.00, quality: 'Local Fresh', contact: 'Carabooda' },
        { name: 'Galati Fresh', unit: 'kg', cost: 11.50, quality: 'WA Grown', contact: 'Spearwood' }
      ],
      seasonal: seasonalCalendar['Button mushrooms'][currentMonth] === 1
    },
    'Olive oil': {
      suppliers: [
        { name: 'Olio Bello', unit: 'L', cost: 24.00, quality: 'WA Extra Virgin', contact: 'Swan Valley' },
        { name: 'Bidfood Perth', unit: 'L', cost: 12.00, quality: 'Blend', contact: 'Welshpool' },
        { name: 'Dirty Clean Food', unit: 'L', cost: 28.00, quality: 'Organic WA', contact: 'Margaret River' }
      ],
      seasonal: false
    },
    'Butter': {
      suppliers: [
        { name: 'Brownes Dairy', unit: 'kg', cost: 9.50, quality: 'WA Cultured', contact: 'Balcatta' },
        { name: 'Western Star', unit: 'kg', cost: 11.00, quality: 'Premium', contact: 'Various' }
      ],
      seasonal: false
    },
    'Cream': {
      suppliers: [
        { name: 'Brownes Dairy', unit: 'L', cost: 8.00, quality: 'WA Pure Cream', contact: 'Balcatta' },
        { name: 'Bidfood Perth', unit: 'L', cost: 7.20, quality: 'Standard', contact: 'Welshpool' }
      ],
      seasonal: false
    },
    'Milk': {
      suppliers: [
        { name: 'Brownes Dairy', unit: 'L', cost: 2.50, quality: 'WA Full Cream', contact: 'Balcatta' },
        { name: 'Harvey Fresh', unit: 'L', cost: 2.40, quality: 'WA Fresh', contact: 'Harvey' }
      ],
      seasonal: false
    },
    'Eggs': {
      suppliers: [
        { name: 'Golden Egg Farms', unit: 'each', cost: 0.45, quality: 'Barn Laid WA', contact: 'Gingin' },
        { name: 'Farmers Pride', unit: 'each', cost: 0.75, quality: 'Free Range WA', contact: 'Chittering' },
        { name: 'Swan Valley Eggs', unit: 'each', cost: 0.95, quality: 'Organic', contact: 'Swan Valley' }
      ],
      seasonal: false
    },
    'Rice (arborio)': {
      suppliers: [
        { name: 'Bidfood Perth', unit: 'kg', cost: 4.50, quality: 'Standard', contact: 'Welshpool' },
        { name: 'Essential Ingredient', unit: 'kg', cost: 8.50, quality: 'Italian Premium', contact: 'Subiaco' }
      ],
      seasonal: false
    },
    'Pasta': {
      suppliers: [
        { name: 'Bidfood Perth', unit: 'kg', cost: 3.20, quality: 'Dried', contact: 'Welshpool' },
        { name: 'Re Store', unit: 'kg', cost: 5.50, quality: 'Artisan WA', contact: 'Mt Lawley' }
      ],
      seasonal: false
    },
    'Flour': {
      suppliers: [
        { name: 'Millers Fine Foods', unit: 'kg', cost: 2.00, quality: 'Plain', contact: 'Welshpool' },
        { name: 'Laucke Flour Mills', unit: 'kg', cost: 3.50, quality: 'Bakers Premium', contact: 'Various' }
      ],
      seasonal: false
    },
    'Sugar': {
      suppliers: [
        { name: 'CSR', unit: 'kg', cost: 1.80, quality: 'White', contact: 'Various' },
        { name: 'Bidfood Perth', unit: 'kg', cost: 1.60, quality: 'Bulk', contact: 'Welshpool' }
      ],
      seasonal: false
    },
    'Salt': {
      suppliers: [
        { name: 'Shark Bay Salt', unit: 'kg', cost: 1.20, quality: 'WA Sea Salt', contact: 'Shark Bay' },
        { name: 'Olssons Salt', unit: 'kg', cost: 8.50, quality: 'Premium Flakes', contact: 'Various' }
      ],
      seasonal: false
    },
    'Black pepper': {
      suppliers: [
        { name: 'Herbie\'s Spices', unit: 'kg', cost: 18.00, quality: 'Ground', contact: 'Multiple locations' },
        { name: 'Essential Ingredient', unit: 'kg', cost: 32.00, quality: 'Whole Tellicherry', contact: 'Subiaco' }
      ],
      seasonal: false
    },
    'Garlic': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 8.50, quality: 'Australian', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 6.50, quality: 'Imported', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Garlic'][currentMonth] === 1
    },
    'Onions': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 2.20, quality: 'WA Brown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 1.95, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Onions'][currentMonth] === 1
    },
    'Lemons': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'each', cost: 0.80, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'each', cost: 0.65, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Lemons'][currentMonth] === 1
    },
    'Parsley': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'bunch', cost: 2.50, quality: 'Fresh Cut WA', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'bunch', cost: 2.00, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: seasonalCalendar['Parsley'][currentMonth] === 1
    },
    'Avocado': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'each', cost: 2.50, quality: 'WA Hass', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'each', cost: 2.20, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: [0,1,1,1,0,0,0,0,0,0,1,1][currentMonth] === 1 // Summer/Autumn
    },
    'Basil': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'bunch', cost: 3.00, quality: 'Fresh WA', contact: 'Spearwood' },
        { name: 'The Herb Barn', unit: 'bunch', cost: 3.50, quality: 'Organic', contact: 'Wanneroo' }
      ],
      seasonal: [1,1,0,0,0,0,0,0,1,1,1,1][currentMonth] === 1 // Warmer months
    },
    'Coriander': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'bunch', cost: 2.50, quality: 'Fresh WA', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'bunch', cost: 2.20, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: false
    },
    'Zucchini': {
      suppliers: [
        { name: 'Galati Fresh', unit: 'kg', cost: 4.00, quality: 'WA Grown', contact: 'Spearwood' },
        { name: 'Perth Markets', unit: 'kg', cost: 3.50, quality: 'Local', contact: 'Canning Vale Markets' }
      ],
      seasonal: [1,1,0,0,0,0,0,1,1,1,1,1][currentMonth] === 1 // Summer/Spring
    }
  };

  // Get unique suppliers for filtering
  const allSuppliers = [...new Set(
    Object.values(ingredientDatabase)
      .flatMap(item => item.suppliers.map(s => s.name))
  )].sort();

  // Load saved recipes from localStorage on mount
  React.useEffect(() => {
    const savedRecipes = localStorage.getItem('pavilionRecipes');
    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (e) {
        console.error('Error loading saved recipes:', e);
      }
    }
  }, []);

  // Save recipes to localStorage whenever they change
  React.useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('pavilionRecipes', JSON.stringify(recipes));
    }
  }, [recipes]);

  const units = ['g', 'kg', 'ml', 'L', 'each', 'bunch', 'clove', 'tsp', 'tbsp', 'cup'];
  const categories = ['Entree', 'Main', 'Dessert', 'Side', 'Sauce', 'Garnish'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Nut Free', 'Halal', 'Kosher', 'Low Carb'];

  const calculateFunScore = () => {
    if (!currentScenario) return { score: 0, stars: 0, badge: '', feedback: '' };
    
    const results = checkScenarioCompletion();
    let score = 0;
    let feedback = [];
    
    // Cost Control (40 points)
    if (results.costMet) {
      const savings = ((results.targetCost - results.costPerServing) / results.targetCost) * 100;
      if (savings > 15) {
        score += 40;
        feedback.push('🌟 Amazing cost control!');
      } else if (savings > 5) {
        score += 35;
        feedback.push('💰 Great budgeting!');
      } else {
        score += 30;
        feedback.push('✓ Within budget');
      }
    } else {
      score += 10;
      feedback.push('⚠️ Over budget');
    }
    
    // Food Cost Accuracy (30 points)
    const fcDeviation = Math.abs(results.foodCostPercentage - results.targetFoodCost);
    if (fcDeviation < 2) {
      score += 30;
      feedback.push('🎯 Perfect food cost!');
    } else if (fcDeviation < 4) {
      score += 25;
      feedback.push('👍 Good food cost');
    } else if (fcDeviation < 6) {
      score += 20;
      feedback.push('📊 Decent food cost');
    } else {
      score += 10;
      feedback.push('📉 Check your margins');
    }
    
    // Recipe Completeness (30 points)
    let completeness = 0;
    if (results.hasName) completeness += 10;
    if (results.hasIngredients) completeness += 10;
    if (results.hasMethod) completeness += 10;
    score += completeness;
    
    if (completeness >= 25) feedback.push('📝 Well documented!');
    else if (completeness >= 20) feedback.push('📋 Good details');
    
    // Ingredient Variety Bonus (10 points)
    const ingredientCount = currentRecipe.ingredients.length;
    if (ingredientCount >= 10) {
      score += 10;
      feedback.push('🎨 Complex dish!');
    } else if (ingredientCount >= 6) {
      score += 7;
    } else if (ingredientCount >= 3) {
      score += 5;
    }
    
    // Determine star rating (1-5)
    let stars = 1;
    if (score >= 90) stars = 5;
    else if (score >= 75) stars = 4;
    else if (score >= 60) stars = 3;
    else if (score >= 40) stars = 2;
    
    // Determine badge
    let badge = '';
    if (score >= 95) badge = '👑 Master Chef';
    else if (score >= 85) badge = '⭐ Executive Chef';
    else if (score >= 75) badge = '🔥 Head Chef';
    else if (score >= 65) badge = '👨‍🍳 Sous Chef';
    else if (score >= 50) badge = '📚 Chef de Partie';
    else badge = '🥄 Commis Chef';
    
    return {
      score: Math.round(score),
      stars,
      badge,
      feedback: feedback.join(' • ')
    };
  };

  const scenarios = [
    {
      id: 1,
      title: "Bistro Lunch Special Challenge",
      description: "The Pavilion is launching a new lunch special. You need to create a main course that costs no more than $5.50 per serving to achieve a 30% food cost when sold at $18.50. The dish must be suitable for quick service and appeal to the lunch crowd.",
      requirements: {
        maxCostPerServing: 5.50,
        targetSellingPrice: 18.50,
        targetFoodCost: 30,
        servings: 4,
        category: 'Main',
        mustInclude: ['Protein', 'Starch', 'Vegetable']
      },
      hints: [
        "Consider seasonal Australian vegetables to reduce costs",
        "Chicken thigh is cheaper than breast and more flavourful",
        "Rice and pasta are cost-effective starches",
        "Prep efficiency matters - can it be prepped ahead?"
      ],
      difficulty: "Medium"
    },
    {
      id: 2,
      title: "Premium Entree Design",
      description: "A corporate function has requested a premium entree for their 50-person event. Budget allows $12 per serving with a selling price of $38. The dish must look elegant and be suitable for plating 50 portions efficiently.",
      requirements: {
        maxCostPerServing: 12.00,
        targetSellingPrice: 38.00,
        targetFoodCost: 31.6,
        servings: 50,
        category: 'Entree',
        mustInclude: ['Premium ingredient', 'Sauce', 'Garnish']
      },
      hints: [
        "Premium ingredients should be the hero, but portion control is key",
        "Sauces can elevate cheaper components",
        "Consider what can be batch-prepped vs plated to order",
        "King prawns, Barramundi, Tassie salmon, or quality WA beef work well"
      ],
      difficulty: "Hard"
    },
    {
      id: 3,
      title: "Budget Family Meal",
      description: "Create a family-style share dish that serves 6 people. Cost must be under $4 per serving to sell at $16 per serving (25% food cost). It needs to be hearty, satisfying, and appeal to diverse tastes.",
      requirements: {
        maxCostPerServing: 4.00,
        targetSellingPrice: 16.00,
        targetFoodCost: 25,
        servings: 6,
        category: 'Main',
        mustInclude: ['Protein', 'Vegetables', 'Carbs']
      },
      hints: [
        "Bulk proteins like mince or diced chicken work well",
        "One-pot dishes reduce plating time",
        "Use aromatics (onion, garlic) for maximum flavour impact",
        "Curries, stews, and pasta bakes are cost-effective"
      ],
      difficulty: "Easy"
    },
    {
      id: 4,
      title: "Vegetarian Fine Dining",
      description: "Design a vegetarian main that competes with premium meat dishes. Target cost is $7 per serving, selling at $32. The dish must showcase technique and creativity without relying on expensive mock meats.",
      requirements: {
        maxCostPerServing: 7.00,
        targetSellingPrice: 32.00,
        targetFoodCost: 21.9,
        servings: 4,
        category: 'Main',
        mustInclude: ['Vegetarian protein', 'Seasonal vegetables', 'Complex preparation']
      },
      hints: [
        "Mushrooms, legumes, and grains can be elevated with technique",
        "Multiple components create perceived value",
        "Consider roasting, smoking, or sous vide techniques",
        "Truffle oil, aged balsamic, or native Australian ingredients add luxury"
      ],
      difficulty: "Hard"
    },
    {
      id: 5,
      title: "Quick Service Dessert",
      description: "The dessert menu needs a crowd-pleaser that can be prepped in bulk and plated quickly. Cost target is $2.50 per serving to sell at $12. Must be able to hold for service and look appealing.",
      requirements: {
        maxCostPerServing: 2.50,
        targetSellingPrice: 12.00,
        targetFoodCost: 20.8,
        servings: 8,
        category: 'Dessert',
        mustInclude: ['Sweet element', 'Texture contrast', 'Visual appeal']
      },
      hints: [
        "Chocolate, cream, and sugar are your base building blocks",
        "Mousses, panna cottas, and tarts hold well",
        "One garnish element can elevate presentation",
        "Consider what can be portioned in advance"
      ],
      difficulty: "Medium"
    }
  ];

  const startScenario = (scenario) => {
    setCurrentScenario(scenario);
    setCurrentRecipe({
      name: '',
      servings: scenario.requirements.servings,
      ingredients: [],
      method: '',
      category: scenario.requirements.category,
      dietaryInfo: scenario.requirements.category === 'Main' && scenario.id === 4 ? ['Vegetarian'] : [],
      targetCostPerServing: scenario.requirements.maxCostPerServing
    });
    setSellingPrice(scenario.requirements.targetSellingPrice.toString());
  };

  const checkScenarioCompletion = () => {
    if (!currentScenario) return null;
    
    const costPerServing = calculateCostPerServing();
    const req = currentScenario.requirements;
    
    const results = {
      costMet: costPerServing <= req.maxCostPerServing,
      costPerServing: costPerServing,
      targetCost: req.maxCostPerServing,
      foodCostPercentage: (costPerServing / req.targetSellingPrice * 100),
      targetFoodCost: req.targetFoodCost,
      hasName: currentRecipe.name.length > 0,
      hasIngredients: currentRecipe.ingredients.length >= 3,
      hasMethod: currentRecipe.method.length > 20,
      categoryMatch: currentRecipe.category === req.category
    };
    
    results.passed = results.costMet && results.hasName && results.hasIngredients && results.hasMethod && results.categoryMatch;
    
    return results;
  };

  const addIngredient = () => {
    // Validation
    if (!newIngredient.name || newIngredient.name.trim() === '') {
      alert('⚠️ Please enter an ingredient name');
      return;
    }
    
    if (!newIngredient.quantity || parseFloat(newIngredient.quantity) <= 0) {
      alert('⚠️ Quantity must be greater than 0');
      return;
    }
    
    if (!newIngredient.costPerUnit || parseFloat(newIngredient.costPerUnit) <= 0) {
      alert('⚠️ Cost must be greater than $0');
      return;
    }

    setCurrentRecipe({
      ...currentRecipe,
      ingredients: [...currentRecipe.ingredients, {
        ...newIngredient,
        id: Date.now(),
        quantity: parseFloat(newIngredient.quantity),
        costPerUnit: parseFloat(newIngredient.costPerUnit)
      }]
    });
    setNewIngredient({
      name: '',
      quantity: '',
      unit: 'g',
      costPerUnit: '',
      supplier: 'General'
    });
  };

  const selectFromDatabase = (ingredientName, supplierIndex = 0) => {
    const ingredient = ingredientDatabase[ingredientName];
    const selectedSupplier = ingredient.suppliers[supplierIndex];
    setNewIngredient({
      name: ingredientName,
      quantity: '',
      unit: selectedSupplier.unit,
      costPerUnit: selectedSupplier.cost.toString(),
      supplier: selectedSupplier.name
    });
    setShowIngredientDB(false);
  };

  const [compareIngredient, setCompareIngredient] = useState(null);

  const showSupplierComparison = (ingredientName) => {
    setCompareIngredient(ingredientName);
  };

  // Filter ingredients by supplier and seasonal
  const getFilteredIngredients = () => {
    return Object.entries(ingredientDatabase).filter(([name, data]) => {
      // Seasonal filter
      if (showSeasonalOnly && !data.seasonal) return false;
      
      // Supplier filter
      if (selectedSupplier !== 'all') {
        const hasSupplier = data.suppliers.some(s => s.name === selectedSupplier);
        if (!hasSupplier) return false;
      }
      
      return true;
    });
  };

  const removeIngredient = (id) => {
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: currentRecipe.ingredients.filter(ing => ing.id !== id)
    });
  };

  const calculateIngredientCost = (ingredient) => {
    return ingredient.quantity * ingredient.costPerUnit;
  };

  const calculateTotalCost = () => {
    return currentRecipe.ingredients.reduce((sum, ing) => sum + calculateIngredientCost(ing), 0);
  };

  const calculateCostPerServing = () => {
    return currentRecipe.servings > 0 ? calculateTotalCost() / currentRecipe.servings : 0;
  };

  const calculateMarkup = (costPerServing, sellingPrice) => {
    if (costPerServing === 0) return 0;
    return ((sellingPrice - costPerServing) / costPerServing * 100);
  };

  const calculateFoodCostPercentage = (costPerServing, sellingPrice) => {
    if (sellingPrice === 0) return 0;
    return (costPerServing / sellingPrice * 100);
  };

  const saveRecipe = () => {
    if (currentRecipe.name && currentRecipe.ingredients.length > 0) {
      setRecipes([...recipes, { ...currentRecipe, id: Date.now(), dateCreated: new Date().toISOString() }]);
      setCurrentRecipe({
        name: '',
        servings: 4,
        ingredients: [],
        method: '',
        category: 'Entree',
        dietaryInfo: [],
        targetCostPerServing: 0
      });
    }
  };

  const exportRecipe = () => {
    const totalCost = calculateTotalCost();
    const costPerServing = calculateCostPerServing();
    
    const exportData = {
      ...currentRecipe,
      totalCost: totalCost.toFixed(2),
      costPerServing: costPerServing.toFixed(2),
      dateExported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRecipe.name.replace(/\s+/g, '-')}-recipe.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalCost = calculateTotalCost();
  const costPerServing = calculateCostPerServing();
  const markup = sellingPrice ? calculateMarkup(costPerServing, parseFloat(sellingPrice)) : 0;
  const foodCostPercentage = sellingPrice ? calculateFoodCostPercentage(costPerServing, parseFloat(sellingPrice)) : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: '"Merriweather", Georgia, serif',
      padding: '40px 20px',
      color: '#e8e8e8'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'fadeSlideDown 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '3.5em',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            textShadow: '0 4px 20px rgba(243, 156, 18, 0.3)',
            letterSpacing: '-1px'
          }}>
            Recipe Planner & Costing Tool
          </h1>
          <p style={{
            fontSize: '1.2em',
            color: '#95a5a6',
            fontStyle: 'italic',
            marginBottom: '20px'
          }}>
            SITHKOP010 - Plan and Cost Recipes
          </p>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginTop: '25px'
          }}>
            <button
              onClick={() => {
                setMode('scenario');
                setCurrentScenario(null);
                setCurrentRecipe({
                  name: '',
                  servings: 4,
                  ingredients: [],
                  method: '',
                  category: 'Entree',
                  dietaryInfo: [],
                  targetCostPerServing: 0
                });
              }}
              style={{
                padding: '12px 30px',
                background: mode === 'scenario' 
                  ? 'linear-gradient(135deg, #9b59b6, #8e44ad)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: mode === 'scenario' ? '2px solid #9b59b6' : '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🎯 Scenario Mode
            </button>
            <button
              onClick={() => {
                setMode('freeform');
                setCurrentScenario(null);
                setCurrentRecipe({
                  name: '',
                  servings: 4,
                  ingredients: [],
                  method: '',
                  category: 'Entree',
                  dietaryInfo: [],
                  targetCostPerServing: 0
                });
              }}
              style={{
                padding: '12px 30px',
                background: mode === 'freeform' 
                  ? 'linear-gradient(135deg, #3498db, #2980b9)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: mode === 'freeform' ? '2px solid #3498db' : '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ✏️ Freeform Mode
            </button>
          </div>
        </div>

        {mode === 'scenario' && !currentScenario && (
          <div style={{
            marginBottom: '40px',
            animation: 'fadeSlideUp 0.6s ease-out'
          }}>
            <h2 style={{
              fontSize: '2em',
              textAlign: 'center',
              marginBottom: '30px',
              color: '#9b59b6'
            }}>
              Choose Your Challenge
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '25px'
            }}>
              {scenarios.map((scenario, index) => (
                <div
                  key={scenario.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '2px solid rgba(155, 89, 182, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    animation: `fadeSlideUp 0.4s ease-out ${index * 0.1}s backwards`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = '#9b59b6';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(155, 89, 182, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(155, 89, 182, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => startScenario(scenario)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{
                      fontSize: '1.5em',
                      color: '#9b59b6',
                      margin: 0
                    }}>
                      {scenario.title}
                    </h3>
                    <span style={{
                      padding: '6px 14px',
                      background: scenario.difficulty === 'Easy' 
                        ? 'rgba(46, 204, 113, 0.2)'
                        : scenario.difficulty === 'Medium'
                        ? 'rgba(243, 156, 18, 0.2)'
                        : 'rgba(231, 76, 60, 0.2)',
                      border: `2px solid ${scenario.difficulty === 'Easy' 
                        ? '#2ecc71'
                        : scenario.difficulty === 'Medium'
                        ? '#f39c12'
                        : '#e74c3c'}`,
                      borderRadius: '20px',
                      color: scenario.difficulty === 'Easy' 
                        ? '#2ecc71'
                        : scenario.difficulty === 'Medium'
                        ? '#f39c12'
                        : '#e74c3c',
                      fontSize: '0.85em',
                      fontWeight: '600'
                    }}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  
                  <p style={{
                    color: '#bdc3c7',
                    fontSize: '0.95em',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {scenario.description}
                  </p>

                  <div style={{
                    background: 'rgba(155, 89, 182, 0.1)',
                    padding: '15px',
                    borderRadius: '12px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      fontSize: '0.9em'
                    }}>
                      <div>
                        <span style={{ color: '#95a5a6' }}>Max Cost: </span>
                        <span style={{ color: '#e74c3c', fontWeight: '700' }}>
                          ${scenario.requirements.maxCostPerServing.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#95a5a6' }}>Selling: </span>
                        <span style={{ color: '#2ecc71', fontWeight: '700' }}>
                          ${scenario.requirements.targetSellingPrice.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#95a5a6' }}>Servings: </span>
                        <span style={{ color: '#3498db', fontWeight: '700' }}>
                          {scenario.requirements.servings}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#95a5a6' }}>Target FC: </span>
                        <span style={{ color: '#f39c12', fontWeight: '700' }}>
                          {scenario.requirements.targetFoodCost.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.85em',
                    color: '#7f8c8d'
                  }}>
                    <strong style={{ color: '#9b59b6' }}>Must include:</strong>{' '}
                    {scenario.requirements.mustInclude.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'scenario' && currentScenario && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(142, 68, 173, 0.1))',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid rgba(155, 89, 182, 0.4)',
            marginBottom: '30px',
            animation: 'fadeSlideDown 0.6s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '2em',
                  color: '#9b59b6',
                  marginBottom: '10px'
                }}>
                  🎯 {currentScenario.title}
                </h2>
                <p style={{
                  color: '#bdc3c7',
                  fontSize: '1.05em',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {currentScenario.description}
                </p>
              </div>
              <button
                onClick={() => setCurrentScenario(null)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(231, 76, 60, 0.2)',
                  border: '2px solid #e74c3c',
                  borderRadius: '10px',
                  color: '#e74c3c',
                  fontSize: '0.9em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Change Scenario
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: 'rgba(231, 76, 60, 0.2)',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(231, 76, 60, 0.3)'
              }}>
                <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                  Max Cost/Serving
                </div>
                <div style={{ fontSize: '1.8em', fontWeight: '900', color: '#e74c3c' }}>
                  ${currentScenario.requirements.maxCostPerServing.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: 'rgba(46, 204, 113, 0.2)',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(46, 204, 113, 0.3)'
              }}>
                <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                  Target Selling Price
                </div>
                <div style={{ fontSize: '1.8em', fontWeight: '900', color: '#2ecc71' }}>
                  ${currentScenario.requirements.targetSellingPrice.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: 'rgba(52, 152, 219, 0.2)',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(52, 152, 219, 0.3)'
              }}>
                <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                  Servings Required
                </div>
                <div style={{ fontSize: '1.8em', fontWeight: '900', color: '#3498db' }}>
                  {currentScenario.requirements.servings}
                </div>
              </div>

              <div style={{
                background: 'rgba(243, 156, 18, 0.2)',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(243, 156, 18, 0.3)'
              }}>
                <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                  Target Food Cost %
                </div>
                <div style={{ fontSize: '1.8em', fontWeight: '900', color: '#f39c12' }}>
                  {currentScenario.requirements.targetFoodCost.toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '0.95em', marginBottom: '10px' }}>
                <strong style={{ color: '#9b59b6' }}>💡 Hints:</strong>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#95a5a6',
                fontSize: '0.9em',
                lineHeight: '1.8'
              }}>
                {currentScenario.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {mode === 'scenario' && currentScenario && currentRecipe.ingredients.length > 0 && (() => {
          const results = checkScenarioCompletion();
          return (
            <div style={{
              background: results.passed 
                ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1))'
                : 'linear-gradient(135deg, rgba(243, 156, 18, 0.2), rgba(230, 126, 34, 0.1))',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '25px',
              border: `2px solid ${results.passed ? 'rgba(46, 204, 113, 0.5)' : 'rgba(243, 156, 18, 0.5)'}`,
              marginBottom: '30px',
              animation: 'fadeSlideUp 0.6s ease-out'
            }}>
              <h3 style={{
                fontSize: '1.6em',
                color: results.passed ? '#2ecc71' : '#f39c12',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {results.passed ? '✅ Challenge Complete!' : '📊 Progress Check'}
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${results.costMet ? '#2ecc71' : '#e74c3c'}`
                }}>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                    Cost Per Serving
                  </div>
                  <div style={{
                    fontSize: '1.4em',
                    fontWeight: '700',
                    color: results.costMet ? '#2ecc71' : '#e74c3c'
                  }}>
                    ${results.costPerServing.toFixed(2)} / ${results.targetCost.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75em', color: '#7f8c8d', marginTop: '5px' }}>
                    {results.costMet ? '✓ Within budget' : '✗ Over budget'}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${Math.abs(results.foodCostPercentage - results.targetFoodCost) < 3 ? '#2ecc71' : '#f39c12'}`
                }}>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                    Food Cost %
                  </div>
                  <div style={{
                    fontSize: '1.4em',
                    fontWeight: '700',
                    color: Math.abs(results.foodCostPercentage - results.targetFoodCost) < 3 ? '#2ecc71' : '#f39c12'
                  }}>
                    {results.foodCostPercentage.toFixed(1)}% / {results.targetFoodCost.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75em', color: '#7f8c8d', marginTop: '5px' }}>
                    {Math.abs(results.foodCostPercentage - results.targetFoodCost) < 3 ? '✓ On target' : '~ Close'}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${results.hasName && results.hasIngredients && results.hasMethod ? '#2ecc71' : '#f39c12'}`
                }}>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>
                    Requirements
                  </div>
                  <div style={{ fontSize: '0.85em', color: '#bdc3c7', lineHeight: '1.6' }}>
                    {results.hasName ? '✓' : '✗'} Recipe name<br/>
                    {results.hasIngredients ? '✓' : '✗'} 3+ ingredients<br/>
                    {results.hasMethod ? '✓' : '✗'} Method details
                  </div>
                </div>
              </div>

              {results.passed && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(46, 204, 113, 0.2)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.1em',
                    fontWeight: '600',
                    color: '#2ecc71',
                    marginBottom: '10px'
                  }}>
                    🎉 Congratulations! You have successfully completed this scenario!
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#95a5a6' }}>
                    Your recipe meets all cost and quality requirements. Ready for service!
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Fun Scoring System */}
        {mode === 'scenario' && currentScenario && currentRecipe.ingredients.length > 0 && (() => {
          const scoreData = calculateFunScore();
          
          return (
            <div style={{
              background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.2), rgba(243, 156, 18, 0.1))',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '3px solid rgba(241, 196, 15, 0.5)',
              marginBottom: '30px',
              animation: 'fadeSlideUp 0.6s ease-out 0.1s backwards',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.2em',
                color: '#f39c12',
                fontWeight: '700',
                marginBottom: '20px',
                letterSpacing: '1px'
              }}>
                YOUR SCORE
              </div>

              {/* Giant Score Display */}
              <div style={{
                fontSize: '7em',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 50%, #e67e22 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '20px',
                lineHeight: '1',
                textShadow: '0 4px 20px rgba(241, 196, 15, 0.4)'
              }}>
                {scoreData.score}
              </div>

              {/* Star Rating */}
              <div style={{
                fontSize: '3em',
                marginBottom: '20px',
                letterSpacing: '8px'
              }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: i < scoreData.stars ? '#f1c40f' : 'rgba(255, 255, 255, 0.2)',
                    textShadow: i < scoreData.stars ? '0 0 20px rgba(241, 196, 15, 0.8)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    ★
                  </span>
                ))}
              </div>

              {/* Badge */}
              <div style={{
                fontSize: '2em',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '25px',
                padding: '15px 30px',
                background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.3), rgba(243, 156, 18, 0.2))',
                borderRadius: '15px',
                border: '2px solid rgba(241, 196, 15, 0.4)',
                display: 'inline-block'
              }}>
                {scoreData.badge}
              </div>

              {/* Feedback */}
              <div style={{
                fontSize: '1.1em',
                color: '#ecf0f1',
                lineHeight: '1.8',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                {scoreData.feedback}
              </div>

              {/* Score Breakdown */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginTop: '30px'
              }}>
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '2px solid rgba(241, 196, 15, 0.2)'
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '5px' }}>💰</div>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6' }}>Cost Control</div>
                  <div style={{ fontSize: '1.3em', fontWeight: '700', color: '#f39c12' }}>40pts</div>
                </div>

                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '2px solid rgba(241, 196, 15, 0.2)'
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '5px' }}>🎯</div>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6' }}>Food Cost %</div>
                  <div style={{ fontSize: '1.3em', fontWeight: '700', color: '#f39c12' }}>30pts</div>
                </div>

                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '2px solid rgba(241, 196, 15, 0.2)'
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '5px' }}>📝</div>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6' }}>Completeness</div>
                  <div style={{ fontSize: '1.3em', fontWeight: '700', color: '#f39c12' }}>30pts</div>
                </div>

                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '2px solid rgba(241, 196, 15, 0.2)'
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '5px' }}>🎨</div>
                  <div style={{ fontSize: '0.85em', color: '#95a5a6' }}>Complexity</div>
                  <div style={{ fontSize: '1.3em', fontWeight: '700', color: '#f39c12' }}>10pts</div>
                </div>
              </div>

              {/* Achievement Message */}
              {scoreData.score >= 80 && (
                <div style={{
                  marginTop: '25px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.3), rgba(39, 174, 96, 0.2))',
                  border: '2px solid rgba(46, 204, 113, 0.5)',
                  borderRadius: '12px',
                  animation: 'fadeIn 0.6s ease-out'
                }}>
                  <div style={{
                    fontSize: '1.5em',
                    fontWeight: '700',
                    color: '#2ecc71',
                    marginBottom: '8px'
                  }}>
                    🎉 Outstanding Work!
                  </div>
                  <div style={{ fontSize: '1em', color: '#ecf0f1' }}>
                    This recipe would be a hit at The Pavilion!
                  </div>
                </div>
              )}

              {scoreData.score >= 60 && scoreData.score < 80 && (
                <div style={{
                  marginTop: '25px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.3), rgba(41, 128, 185, 0.2))',
                  border: '2px solid rgba(52, 152, 219, 0.5)',
                  borderRadius: '12px',
                  animation: 'fadeIn 0.6s ease-out'
                }}>
                  <div style={{
                    fontSize: '1.5em',
                    fontWeight: '700',
                    color: '#3498db',
                    marginBottom: '8px'
                  }}>
                    👍 Good Job!
                  </div>
                  <div style={{ fontSize: '1em', color: '#ecf0f1' }}>
                    Solid recipe with room to refine your costing
                  </div>
                </div>
              )}

              {scoreData.score < 60 && (
                <div style={{
                  marginTop: '25px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.3), rgba(230, 126, 34, 0.2))',
                  border: '2px solid rgba(243, 156, 18, 0.5)',
                  borderRadius: '12px',
                  animation: 'fadeIn 0.6s ease-out'
                }}>
                  <div style={{
                    fontSize: '1.5em',
                    fontWeight: '700',
                    color: '#f39c12',
                    marginBottom: '8px'
                  }}>
                    💪 Keep Going!
                  </div>
                  <div style={{ fontSize: '1em', color: '#ecf0f1' }}>
                    Try adjusting your costs and adding more detail
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {(mode === 'freeform' || (mode === 'scenario' && currentScenario)) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            animation: 'fadeSlideUp 0.6s ease-out 0.1s backwards'
          }}>
            <h2 style={{
              fontSize: '1.8em',
              marginBottom: '25px',
              color: '#f39c12',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Calculator size={28} />
              Recipe Details
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#bdc3c7',
                fontSize: '0.95em',
                fontWeight: '600'
              }}>Recipe Name</label>
              <input
                type="text"
                value={currentRecipe.name}
                onChange={(e) => setCurrentRecipe({...currentRecipe, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(243, 156, 18, 0.3)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1em',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="e.g., Pan-Seared Barramundi"
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Servings</label>
                <input
                  type="number"
                  value={currentRecipe.servings}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, servings: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(243, 156, 18, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1em'
                  }}
                  min="1"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Category</label>
                <select
                  value={currentRecipe.category}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(243, 156, 18, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1em'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} style={{background: '#1a1a2e'}}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#bdc3c7',
                fontSize: '0.95em',
                fontWeight: '600'
              }}>Dietary Information</label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {dietaryOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      const newDietary = currentRecipe.dietaryInfo.includes(option)
                        ? currentRecipe.dietaryInfo.filter(d => d !== option)
                        : [...currentRecipe.dietaryInfo, option];
                      setCurrentRecipe({...currentRecipe, dietaryInfo: newDietary});
                    }}
                    style={{
                      padding: '8px 16px',
                      background: currentRecipe.dietaryInfo.includes(option) 
                        ? 'linear-gradient(135deg, #f39c12, #e74c3c)'
                        : 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '20px',
                      color: '#e8e8e8',
                      fontSize: '0.85em',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: currentRecipe.dietaryInfo.includes(option) ? '600' : '400'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#bdc3c7',
                fontSize: '0.95em',
                fontWeight: '600'
              }}>Method / Instructions</label>
              <textarea
                value={currentRecipe.method}
                onChange={(e) => setCurrentRecipe({...currentRecipe, method: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(243, 156, 18, 0.3)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1em',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter cooking method and instructions..."
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            animation: 'fadeSlideUp 0.6s ease-out 0.2s backwards'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{
                fontSize: '1.8em',
                margin: 0,
                color: '#3498db',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Plus size={28} />
                Add Ingredients
              </h2>
              <button
                onClick={() => setShowIngredientDB(!showIngredientDB)}
                style={{
                  padding: '8px 16px',
                  background: showIngredientDB ? 'rgba(52, 152, 219, 0.3)' : 'linear-gradient(135deg, #3498db, #2980b9)',
                  border: '2px solid #3498db',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.85em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {showIngredientDB ? 'Hide' : 'Browse'} Database
              </button>
            </div>

            {showIngredientDB && (
              <div style={{
                background: 'rgba(52, 152, 219, 0.1)',
                border: '2px solid rgba(52, 152, 219, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{
                    fontSize: '0.95em',
                    color: '#bdc3c7',
                    fontWeight: '600'
                  }}>
                    📦 Ingredient Database
                  </div>
                  
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Seasonal Filter */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      color: '#e8e8e8'
                    }}>
                      <input
                        type="checkbox"
                        checked={showSeasonalOnly}
                        onChange={(e) => setShowSeasonalOnly(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>🌱 Seasonal Only</span>
                    </label>

                    {/* Supplier Filter */}
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(52, 152, 219, 0.3)',
                        borderRadius: '8px',
                        color: '#e8e8e8',
                        fontSize: '0.9em',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all" style={{background: '#1a1a2e'}}>All Suppliers</option>
                      {allSuppliers.map(supplier => (
                        <option key={supplier} value={supplier} style={{background: '#1a1a2e'}}>
                          {supplier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '12px'
                }}>
                  {getFilteredIngredients().map(([name, data]) => {
                    const cheapestSupplier = data.suppliers.reduce((min, s) => 
                      s.cost < min.cost ? s : min, data.suppliers[0]);
                    
                    return (
                      <div
                        key={name}
                        style={{
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: data.seasonal 
                            ? '2px solid rgba(46, 204, 113, 0.5)' 
                            : '2px solid rgba(52, 152, 219, 0.2)',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '10px'
                        }}>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '0.95em',
                            color: '#e8e8e8',
                            flex: 1
                          }}>
                            {name}
                            {data.seasonal && (
                              <span style={{
                                marginLeft: '6px',
                                fontSize: '0.85em',
                                background: 'rgba(46, 204, 113, 0.2)',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                color: '#2ecc71'
                              }}>
                                🌱 In Season
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{
                          fontSize: '0.85em',
                          color: '#95a5a6',
                          marginBottom: '12px'
                        }}>
                          <div style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#3498db' }}>Best Price:</strong> ${cheapestSupplier.cost}/{cheapestSupplier.unit}
                          </div>
                          <div style={{ fontSize: '0.8em' }}>
                            {cheapestSupplier.name} - {cheapestSupplier.quality}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <button
                            onClick={() => selectFromDatabase(name, data.suppliers.indexOf(cheapestSupplier))}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: 'linear-gradient(135deg, #3498db, #2980b9)',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '0.85em',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Use Best
                          </button>
                          
                          {data.suppliers.length > 1 && (
                            <button
                              onClick={() => showSupplierComparison(name)}
                              style={{
                                padding: '8px 12px',
                                background: 'rgba(241, 196, 15, 0.2)',
                                border: '2px solid rgba(241, 196, 15, 0.4)',
                                borderRadius: '6px',
                                color: '#f1c40f',
                                fontSize: '0.85em',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Compare ({data.suppliers.length})
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getFilteredIngredients().length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#95a5a6',
                    fontSize: '0.95em'
                  }}>
                    No ingredients match your filters. Try adjusting your selection.
                  </div>
                )}
              </div>
            )}

            {/* Supplier Comparison Modal */}
            {compareIngredient && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: '20px',
                  padding: '30px',
                  maxWidth: '700px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  border: '2px solid rgba(241, 196, 15, 0.4)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                  }}>
                    <h3 style={{
                      fontSize: '1.8em',
                      color: '#f39c12',
                      margin: 0
                    }}>
                      Compare Suppliers: {compareIngredient}
                    </h3>
                    <button
                      onClick={() => setCompareIngredient(null)}
                      style={{
                        background: 'rgba(231, 76, 60, 0.2)',
                        border: '2px solid #e74c3c',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: '#e74c3c',
                        fontSize: '0.9em',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ✕ Close
                    </button>
                  </div>

                  {ingredientDatabase[compareIngredient].seasonal && (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(46, 204, 113, 0.2)',
                      border: '2px solid rgba(46, 204, 113, 0.4)',
                      borderRadius: '10px',
                      marginBottom: '20px',
                      fontSize: '0.95em',
                      color: '#2ecc71'
                    }}>
                      🌱 <strong>In Season Now!</strong> Best quality and pricing available.
                    </div>
                  )}

                  <div style={{
                    display: 'grid',
                    gap: '15px'
                  }}>
                    {ingredientDatabase[compareIngredient].suppliers.map((supplier, index) => {
                      const cheapest = ingredientDatabase[compareIngredient].suppliers.reduce((min, s) => 
                        s.cost < min.cost ? s : min);
                      const isCheapest = supplier.cost === cheapest.cost;
                      const savings = ((supplier.cost - cheapest.cost) / cheapest.cost * 100);

                      return (
                        <div
                          key={index}
                          style={{
                            padding: '20px',
                            background: isCheapest 
                              ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1))'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: isCheapest 
                              ? '3px solid rgba(46, 204, 113, 0.5)' 
                              : '2px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            position: 'relative'
                          }}
                        >
                          {isCheapest && (
                            <div style={{
                              position: 'absolute',
                              top: '-12px',
                              right: '20px',
                              background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '0.8em',
                              fontWeight: '700',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(46, 204, 113, 0.4)'
                            }}>
                              💰 Best Price
                            </div>
                          )}

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '20px',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{
                                fontSize: '1.3em',
                                fontWeight: '700',
                                color: '#f39c12',
                                marginBottom: '8px'
                              }}>
                                {supplier.name}
                              </div>
                              <div style={{
                                fontSize: '0.9em',
                                color: '#95a5a6',
                                marginBottom: '4px'
                              }}>
                                Quality: {supplier.quality}
                              </div>
                              <div style={{
                                fontSize: '0.85em',
                                color: '#7f8c8d',
                                marginBottom: '8px'
                              }}>
                                📍 {supplier.contact}
                              </div>
                              {!isCheapest && savings > 0 && (
                                <div style={{
                                  fontSize: '0.85em',
                                  color: '#e74c3c'
                                }}>
                                  +${(supplier.cost - cheapest.cost).toFixed(2)} ({savings.toFixed(1)}% more)
                                </div>
                              )}
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{
                                fontSize: '2em',
                                fontWeight: '900',
                                color: isCheapest ? '#2ecc71' : '#3498db',
                                marginBottom: '8px'
                              }}>
                                ${supplier.cost}
                              </div>
                              <div style={{
                                fontSize: '0.9em',
                                color: '#7f8c8d',
                                marginBottom: '12px'
                              }}>
                                per {supplier.unit}
                              </div>
                              <button
                                onClick={() => {
                                  selectFromDatabase(compareIngredient, index);
                                  setCompareIngredient(null);
                                }}
                                style={{
                                  padding: '10px 20px',
                                  background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  color: 'white',
                                  fontSize: '0.9em',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#bdc3c7',
                fontSize: '0.95em',
                fontWeight: '600'
              }}>Ingredient Name</label>
              <input
                type="text"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(52, 152, 219, 0.3)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1em'
                }}
                placeholder="e.g., Barramundi fillet, Lamb cutlets, King prawns"
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Quantity</label>
                <input
                  type="number"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1em'
                  }}
                  step="0.01"
                  placeholder="200"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Unit</label>
                <select
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1em'
                  }}
                >
                  {units.map(unit => (
                    <option key={unit} value={unit} style={{background: '#1a1a2e'}}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Cost per {newIngredient.unit} ($)</label>
                <input
                  type="number"
                  value={newIngredient.costPerUnit}
                  onChange={(e) => setNewIngredient({...newIngredient, costPerUnit: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1em'
                  }}
                  step="0.01"
                  placeholder="0.05"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Supplier</label>
                <input
                  type="text"
                  value={newIngredient.supplier}
                  onChange={(e) => setNewIngredient({...newIngredient, supplier: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1em'
                  }}
                  placeholder="General"
                />
              </div>
            </div>

            <button
              onClick={addIngredient}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1.1em',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
              }}
            >
              <Plus size={20} />
              Add Ingredient
            </button>
          </div>
        </div>
        )}

        {currentRecipe.ingredients.length > 0 && (mode === 'freeform' || (mode === 'scenario' && currentScenario)) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            marginBottom: '30px',
            animation: 'fadeSlideUp 0.6s ease-out 0.3s backwards'
          }}>
            <h2 style={{
              fontSize: '1.8em',
              marginBottom: '25px',
              color: '#2ecc71',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Scale size={28} />
              Ingredient Breakdown
            </h2>

            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 10px'
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(46, 204, 113, 0.1)',
                    color: '#2ecc71'
                  }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderRadius: '10px 0 0 10px' }}>Ingredient</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Quantity</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Unit</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Cost/Unit</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Total Cost</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Supplier</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderRadius: '0 10px 10px 0' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecipe.ingredients.map((ing, index) => (
                    <tr key={ing.id} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      animation: `fadeIn 0.3s ease-out ${index * 0.05}s backwards`
                    }}>
                      <td style={{ padding: '15px', borderRadius: '10px 0 0 10px', fontWeight: '600' }}>{ing.name}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{ing.quantity}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{ing.unit}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>${ing.costPerUnit.toFixed(2)}</td>
                      <td style={{ 
                        padding: '15px', 
                        textAlign: 'center',
                        color: '#f39c12',
                        fontWeight: '700',
                        fontSize: '1.1em'
                      }}>
                        ${calculateIngredientCost(ing).toFixed(2)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#95a5a6', fontSize: '0.9em' }}>{ing.supplier}</td>
                      <td style={{ padding: '15px', textAlign: 'center', borderRadius: '0 10px 10px 0' }}>
                        <button
                          onClick={() => removeIngredient(ing.id)}
                          style={{
                            background: 'rgba(231, 76, 60, 0.2)',
                            border: '2px solid #e74c3c',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: '#e74c3c',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentRecipe.ingredients.length > 0 && (mode === 'freeform' || (mode === 'scenario' && currentScenario)) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            marginBottom: '30px',
            animation: 'fadeSlideUp 0.6s ease-out 0.4s backwards'
          }}>
            <h2 style={{
              fontSize: '1.8em',
              marginBottom: '25px',
              color: '#e67e22',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <DollarSign size={28} />
              Cost Analysis
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1))',
                border: '2px solid rgba(46, 204, 113, 0.3)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9em', color: '#95a5a6', marginBottom: '8px' }}>Total Recipe Cost</div>
                <div style={{ fontSize: '2.2em', fontWeight: '900', color: '#2ecc71' }}>
                  ${totalCost.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.1))',
                border: '2px solid rgba(52, 152, 219, 0.3)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9em', color: '#95a5a6', marginBottom: '8px' }}>Cost Per Serving</div>
                <div style={{ fontSize: '2.2em', fontWeight: '900', color: '#3498db' }}>
                  ${costPerServing.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(142, 68, 173, 0.1))',
                border: '2px solid rgba(155, 89, 182, 0.3)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9em', color: '#95a5a6', marginBottom: '8px' }}>Number of Servings</div>
                <div style={{ fontSize: '2.2em', fontWeight: '900', color: '#9b59b6' }}>
                  {currentRecipe.servings}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(243, 156, 18, 0.1)',
              border: '2px solid rgba(243, 156, 18, 0.3)',
              borderRadius: '15px',
              padding: '25px',
              marginTop: '25px'
            }}>
              <h3 style={{
                fontSize: '1.4em',
                marginBottom: '20px',
                color: '#f39c12',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Calculator size={22} />
                Pricing & Profitability
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#bdc3c7',
                  fontSize: '0.95em',
                  fontWeight: '600'
                }}>Proposed Selling Price (per serving)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  disabled={mode === 'scenario' && currentScenario}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(243, 156, 18, 0.3)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1.1em',
                    cursor: (mode === 'scenario' && currentScenario) ? 'not-allowed' : 'text'
                  }}
                  step="0.01"
                  placeholder="e.g., 25.00"
                />
              </div>

              {sellingPrice && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  animation: 'fadeIn 0.4s ease-out'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '10px',
                    borderLeft: '4px solid #2ecc71'
                  }}>
                    <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>Markup %</div>
                    <div style={{ fontSize: '1.6em', fontWeight: '700', color: '#2ecc71' }}>
                      {markup.toFixed(1)}%
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '10px',
                    borderLeft: '4px solid #3498db'
                  }}>
                    <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>Food Cost %</div>
                    <div style={{ 
                      fontSize: '1.6em', 
                      fontWeight: '700', 
                      color: foodCostPercentage > 35 ? '#e74c3c' : foodCostPercentage > 28 ? '#f39c12' : '#2ecc71'
                    }}>
                      {foodCostPercentage.toFixed(1)}%
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '10px',
                    borderLeft: '4px solid #9b59b6'
                  }}>
                    <div style={{ fontSize: '0.85em', color: '#95a5a6', marginBottom: '5px' }}>Gross Profit</div>
                    <div style={{ fontSize: '1.6em', fontWeight: '700', color: '#9b59b6' }}>
                      ${(parseFloat(sellingPrice) - costPerServing).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {sellingPrice && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: foodCostPercentage > 35 
                    ? 'rgba(231, 76, 60, 0.1)' 
                    : foodCostPercentage > 28 
                    ? 'rgba(243, 156, 18, 0.1)' 
                    : 'rgba(46, 204, 113, 0.1)',
                  border: `2px solid ${foodCostPercentage > 35 
                    ? 'rgba(231, 76, 60, 0.3)' 
                    : foodCostPercentage > 28 
                    ? 'rgba(243, 156, 18, 0.3)' 
                    : 'rgba(46, 204, 113, 0.3)'}`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'fadeIn 0.4s ease-out'
                }}>
                  {foodCostPercentage > 35 ? (
                    <>
                      <AlertCircle size={24} color="#e74c3c" />
                      <div>
                        <div style={{ fontWeight: '600', color: '#e74c3c', marginBottom: '4px' }}>
                          Food Cost Too High
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#95a5a6' }}>
                          Industry standard is 25-35%. Consider increasing price or reducing ingredient costs.
                        </div>
                      </div>
                    </>
                  ) : foodCostPercentage > 28 ? (
                    <>
                      <AlertCircle size={24} color="#f39c12" />
                      <div>
                        <div style={{ fontWeight: '600', color: '#f39c12', marginBottom: '4px' }}>
                          Food Cost Acceptable
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#95a5a6' }}>
                          Within industry standard range (25-35%). Monitor portion control carefully.
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} color="#2ecc71" />
                      <div>
                        <div style={{ fontWeight: '600', color: '#2ecc71', marginBottom: '4px' }}>
                          Excellent Food Cost
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#95a5a6' }}>
                          Well below industry standard. Good profitability margins.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {currentRecipe.ingredients.length > 0 && (mode === 'freeform' || (mode === 'scenario' && currentScenario)) && (
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            animation: 'fadeSlideUp 0.6s ease-out 0.5s backwards'
          }}>
            <button
              onClick={saveRecipe}
              disabled={!currentRecipe.name}
              style={{
                padding: '16px 40px',
                background: currentRecipe.name 
                  ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                  : 'rgba(149, 165, 166, 0.3)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.1em',
                fontWeight: '600',
                cursor: currentRecipe.name ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: currentRecipe.name ? '0 4px 15px rgba(46, 204, 113, 0.3)' : 'none'
              }}
            >
              <Save size={20} />
              Save Recipe
            </button>

            <button
              onClick={exportRecipe}
              disabled={!currentRecipe.name}
              style={{
                padding: '16px 40px',
                background: currentRecipe.name
                  ? 'linear-gradient(135deg, #3498db, #2980b9)'
                  : 'rgba(149, 165, 166, 0.3)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.1em',
                fontWeight: '600',
                cursor: currentRecipe.name ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: currentRecipe.name ? '0 4px 15px rgba(52, 152, 219, 0.3)' : 'none'
              }}
            >
              <Download size={20} />
              Export Recipe
            </button>
          </div>
        )}

        {recipes.length > 0 && (
          <div style={{
            marginTop: '50px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            animation: 'fadeSlideUp 0.6s ease-out 0.6s backwards'
          }}>
            <h2 style={{
              fontSize: '1.8em',
              marginBottom: '25px',
              color: '#f39c12',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Save size={28} />
              Saved Recipes ({recipes.length})
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {recipes.map((recipe, index) => {
                const recipeTotalCost = recipe.ingredients.reduce((sum, ing) => 
                  sum + (ing.quantity * ing.costPerUnit), 0);
                const recipeCostPerServing = recipeTotalCost / recipe.servings;

                return (
                  <div key={recipe.id} style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '20px',
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s backwards`,
                    transition: 'all 0.3s ease'
                  }}>
                    <h3 style={{
                      fontSize: '1.3em',
                      marginBottom: '10px',
                      color: '#f39c12'
                    }}>
                      {recipe.name}
                    </h3>
                    <div style={{
                      fontSize: '0.9em',
                      color: '#95a5a6',
                      marginBottom: '15px'
                    }}>
                      {recipe.category} • {recipe.servings} servings
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(46, 204, 113, 0.1)',
                      borderRadius: '10px',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#bdc3c7' }}>Total Cost:</span>
                      <span style={{ fontWeight: '700', color: '#2ecc71' }}>
                        ${recipeTotalCost.toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(52, 152, 219, 0.1)',
                      borderRadius: '10px'
                    }}>
                      <span style={{ color: '#bdc3c7' }}>Per Serving:</span>
                      <span style={{ fontWeight: '700', color: '#3498db' }}>
                        ${recipeCostPerServing.toFixed(2)}
                      </span>
                    </div>
                    {recipe.dietaryInfo.length > 0 && (
                      <div style={{
                        marginTop: '15px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {recipe.dietaryInfo.map(info => (
                          <span key={info} style={{
                            padding: '4px 10px',
                            background: 'rgba(155, 89, 182, 0.2)',
                            border: '1px solid rgba(155, 89, 182, 0.3)',
                            borderRadius: '12px',
                            fontSize: '0.75em',
                            color: '#9b59b6'
                          }}>
                            {info}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        input:focus, textarea:focus, select:focus {
          border-color: #f39c12 !important;
          outline: none;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
