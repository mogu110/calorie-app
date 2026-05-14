import React, { useState } from 'react';
import { 
  Calendar, Search, Home, BarChart3, User, Plus, Minus, 
  ChevronRight, Coffee, Sun, Moon, Cookie, ArrowLeft
} from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  category: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  image: string;
  servingSize: string;
}

interface MealEntry {
  food: FoodItem;
  quantity: number;
  time: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'search' | 'progress' | 'profile'>('dashboard');
  const [selectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const dailyGoal = 1200;

  const foodDatabase: FoodItem[] = [
    { id: 1, name: '全麦面包', category: '谷物', calories: 250, carbs: 45, protein: 9, fat: 3, image: 'https://picsum.photos/id/292/300/300', servingSize: '1片(40g)' },
    { id: 2, name: '鸡胸肉', category: '肉类', calories: 165, carbs: 0, protein: 31, fat: 3.6, image: 'https://picsum.photos/id/1088/300/300', servingSize: '100g' },
    { id: 3, name: '西兰花', category: '蔬菜', calories: 34, carbs: 7, protein: 2.8, fat: 0.4, image: 'https://picsum.photos/id/102/300/300', servingSize: '100g' },
    { id: 4, name: '鸡蛋', category: '蛋类', calories: 155, carbs: 1.1, protein: 13, fat: 11, image: 'https://picsum.photos/id/944/300/300', servingSize: '1个(50g)' },
    { id: 5, name: '香蕉', category: '水果', calories: 96, carbs: 23, protein: 1.2, fat: 0.3, image: 'https://picsum.photos/id/1092/300/300', servingSize: '1根(118g)' },
    { id: 6, name: '燕麦', category: '谷物', calories: 389, carbs: 66, protein: 17, fat: 7, image: 'https://picsum.photos/id/1327/300/300', servingSize: '100g' },
    { id: 7, name: '三文鱼', category: '肉类', calories: 208, carbs: 0, protein: 22, fat: 13, image: 'https://picsum.photos/id/493/300/300', servingSize: '100g' },
    { id: 8, name: '牛油果', category: '水果', calories: 160, carbs: 8.5, protein: 2, fat: 15, image: 'https://picsum.photos/id/506/300/300', servingSize: '1个(100g)' }
  ];

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dailyTotal = meals.reduce((sum, meal) => sum + (meal.food.calories * meal.quantity), 0);
  const nutrientTotals = meals.reduce((totals, meal) => {
    const q = meal.quantity;
    return {
      carbs: totals.carbs + meal.food.carbs * q,
      protein: totals.protein + meal.food.protein * q,
      fat: totals.fat + meal.food.fat * q
    };
  }, { carbs: 0, protein: 0, fat: 0 });

  const progress = Math.min(100, (dailyTotal / dailyGoal) * 100);

  const addMeal = (food: FoodItem, time: any, q = 1) => {
    setMeals([...meals, { food, quantity: q, time }]);
    setSelectedFood(null);
  };

  const formatDate = (d: Date) => d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative">
      {selectedFood && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          <button onClick={() => setSelectedFood(null)} className="mb-4 p-2">
            <ArrowLeft size={20} />
          </button>
          <img src={selectedFood.image} className="w-48 h-48 rounded-lg mx-auto" />
          <h2 className="text-center text-xl font-bold mt-4">{selectedFood.name}</h2>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={() => addMeal(selectedFood, 'breakfast')} className="p-3 bg-green-100 rounded-lg">早餐</button>
            <button onClick={() => addMeal(selectedFood, 'lunch')} className="p-3 bg-blue-100 rounded-lg">午餐</button>
            <button onClick={() => addMeal(selectedFood, 'dinner')} className="p-3 bg-purple-100 rounded-lg">晚餐</button>
            <button onClick={() => addMeal(selectedFood, 'snack')} className="p-3 bg-yellow-100 rounded-lg">零食</button>
          </div>
        </div>
      )}

      {currentPage === 'dashboard' && (
        <div className="p-4 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">健康饮食</h1>
            <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-full" />
          </div>

          <div className="flex justify-center my-6">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle cx="80" cy="80" r="70" stroke="#22c55e" strokeWidth="12" fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">{dailyTotal}</div>
                <div className="text-gray-500">/ {dailyGoal} 千卡</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg text-center">碳⽔{nutrientTotals.carbs.toFixed(0)}g</div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">蛋白{nutrientTotals.protein.toFixed(0)}g</div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">脂肪{nutrientTotals.fat.toFixed(0)}g</div>
          </div>

          <button onClick={() => setCurrentPage('search')} className="text-green-600 mb-2">
            + 添加食物
          </button>
        </div>
      )}

      {currentPage === 'search' && (
        <div className="p-4 pb-24">
          <h1 className="text-xl font-bold mb-4">食物搜索</h1>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索食物..."
            className="w-full p-2 border rounded-lg mb-4"
          />
          <div className="grid grid-cols-2 gap-3">
            {filteredFoods.map(f => (
              <div key={f.id} onClick={() => setSelectedFood(f)} className="border rounded-lg overflow-hidden">
                <img src={f.image} className="w-full h-32 object-cover" />
                <div className="p-2">
                  <div>{f.name}</div>
                  <div className="text-green-600">{f.calories} 千卡</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'progress' && (
        <div className="p-4 pb-24">
          <h1 className="text-xl font-bold mb-4">进度</h1>
          <div className="p-4 border rounded-lg mb-4">
            <div>热量进度 {progress.toFixed(0)}%</div>
            <div className="h-2 bg-gray-100 rounded-full mt-2">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="p-4 pb-24">
          <h1 className="text-xl font-bold mb-4">我的</h1>
          <div className="p-4 border rounded-lg">
            <p>每日目标：1200 千卡</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
        <button onClick={() => setCurrentPage('dashboard')} className={`p-2 ${currentPage === 'dashboard' ? 'text-green-600' : ''}`}><Home size={20} /></button>
        <button onClick={() => setCurrentPage('search')} className={`p-2 ${currentPage === 'search' ? 'text-green-600' : ''}`}><Search size={20} /></button>
        <button onClick={() => setCurrentPage('progress')} className={`p-2 ${currentPage === 'progress' ? 'text-green-600' : ''}`}><BarChart3 size={20} /></button>
        <button onClick={() => setCurrentPage('profile')} className={`p-2 ${currentPage === 'profile' ? 'text-green-600' : ''}`}><User size={20} /></button>
      </div>
    </div>
  );
};

export default App;
