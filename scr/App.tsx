import React, { useState } from 'react';
import { 
  Calendar, Search, Home, BarChart3, User, Plus, Minus, 
  ChevronRight, Coffee, Sun, Moon, Cookie, ArrowLeft
} from 'lucide-react';

// 简易UI组件内联实现，无需额外安装shadcn-ui
const Button = ({ children, className = "", variant = "default", onClick, size = "default" }: any) => (
  <button 
    onClick={onClick}
    className={`rounded-lg font-medium transition-colors ${
      variant === "ghost" ? "bg-transparent hover:bg-gray-100" : "bg-green-500 hover:bg-green-600 text-white"
    } ${size === "icon" ? "w-10 h-10 flex items-center justify-center" : "px-4 py-2"} ${className}`}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChange, className = "" }: any) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 ${className}`}
  />
);

const Card = ({ children, className = "", onClick }: any) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`px-4 pt-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`font-bold text-lg ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

const Avatar = ({ children, className = "" }: any) => (
  <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>
);

const AvatarImage = ({ src, alt }: any) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" />
);

const AvatarFallback = ({ children }: any) => (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center">{children}</div>
);

const Tabs = ({ defaultValue, children }: any) => <div>{children}</div>;
const TabsList = ({ children, className = "" }: any) => <div className={`grid ${className}`}>{children}</div>;
const TabsTrigger = ({ value, children, className = "" }: any) => <div className={`p-2 text-center cursor-pointer ${className}`}>{children}</div>;
const TabsContent = ({ value, children }: any) => <div>{children}</div>;

// 类型定义
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
  // 状态管理
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'search' | 'progress' | 'profile'>('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [dailyGoal] = useState(1200);
  
  // 食物数据库
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

  const dailyTotal = meals.reduce(
    (sum, meal) => sum + (meal.food.calories * meal.quantity), 0
  );

  const nutrientTotals = meals.reduce(
    (totals, meal) => {
      const quantity = meal.quantity;
      return {
        carbs: totals.carbs + (meal.food.carbs * quantity),
        protein: totals.protein + (meal.food.protein * quantity),
        fat: totals.fat + (meal.food.fat * quantity)
      };
    },
    { carbs: 0, protein: 0, fat: 0 }
  );

  const progressPercentage = Math.min(100, (dailyTotal / dailyGoal) * 100);

  const addMeal = (food: FoodItem, time: 'breakfast' | 'lunch' | 'dinner' | 'snack', quantity: number = 1) => {
    setMeals([...meals, { food, quantity, time }]);
    setSelectedFood(null);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
  };

  // 圆环进度组件
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="relative flex items-center justify-center w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 80 80)" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{dailyTotal}</span>
          <span className="text-sm text-gray-500">/ {dailyGoal} 千卡</span>
        </div>
      </div>
    );
  };

  // 食物详情页
  const renderFoodDetail = () => {
    if (!selectedFood) return null;
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="p-4 border-b flex items-center sticky top-0 bg-white">
          <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-semibold">食物详情</h2>
        </div>
        
        <div className="p-4">
          <div className="flex justify-center mb-4">
            <img src={selectedFood.image} alt={selectedFood.name} className="w-48 h-48 rounded-lg object-cover" />
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">{selectedFood.name}</h3>
            <p className="text-gray-500">{selectedFood.servingSize}</p>
          </div>
          
          <Card className="mb-6">
            <CardHeader><CardTitle>营养信息</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">热量</p>
                  <p className="text-xl font-bold text-green-600">{selectedFood.calories} 千卡</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">碳水化合物</p>
                  <p className="text-xl font-bold text-blue-600">{selectedFood.carbs} g</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">蛋白质</p>
                  <p className="text-xl font-bold text-purple-600">{selectedFood.protein} g</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">脂肪</p>
                  <p className="text-xl font-bold text-yellow-600">{selectedFood.fat} g</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <p className="font-medium">添加到餐食</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => addMeal(selectedFood, 'breakfast')} className="bg-green-100 text-green-800 hover:bg-green-200">
                <Coffee size={18} className="mr-2" /> 早餐
              </Button>
              <Button onClick={() => addMeal(selectedFood, 'lunch')} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Sun size={18} className="mr-2" /> 午餐
              </Button>
              <Button onClick={() => addMeal(selectedFood, 'dinner')} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                <Moon size={18} className="mr-2" /> 晚餐
              </Button>
              <Button onClick={() => addMeal(selectedFood, 'snack')} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                <Cookie size={18} className="mr-2" /> 零食
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 仪表板
  const renderDashboard = () => (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">健康饮食</h1>
          <p className="text-gray-500">{formatDate(selectedDate)}</p>
        </div>
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://picsum.photos/id/64/100/100" alt="用户头像" />
          <AvatarFallback>用户</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center mb-6">
        <CircularProgress percentage={progressPercentage} />
        <p className="text-gray-600 mt-2">今日热量摄入</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="bg-blue-50 border-none">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">碳水化合物</p>
            <p className="text-xl font-bold text-blue-800">{nutrientTotals.carbs.toFixed(1)}g</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-none">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-purple-600 font-medium">蛋白质</p>
            <p className="text-xl font-bold text-purple-800">{nutrientTotals.protein.toFixed(1)}g</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-none">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-yellow-600 font-medium">脂肪</p>
            <p className="text-xl font-bold text-yellow-800">{nutrientTotals.fat.toFixed(1)}g</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">今日餐食</h2>
          <Button variant="ghost" className="text-green-600 text-sm p-0" onClick={() => setCurrentPage('search')}>
            添加食物 <ChevronRight size={16} />
          </Button>
        </div>

        <Tabs defaultValue="breakfast">
          <TabsList className="w-full grid grid-cols-4 rounded-lg bg-gray-100 p-1">
            <TabsTrigger value="breakfast"><Coffee size={14} className="mr-1 inline" /> 早餐</TabsTrigger>
            <TabsTrigger value="lunch"><Sun size={14} className="mr-1 inline" /> 午餐</TabsTrigger>
            <TabsTrigger value="dinner"><Moon size={14} className="mr-1 inline" /> 晚餐</TabsTrigger>
            <TabsTrigger value="snack"><Cookie size={14} className="mr-1 inline" /> 零食</TabsTrigger>
          </TabsList>
          
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(time => (
            <TabsContent key={time} value={time}>
              <Card className="mt-2">
                <CardContent className="p-3">
                  {meals.filter(m => m.time === time).length > 0 ? (
                    <div className="space-y-2">
                      {meals.filter(m => m.time === time).map((meal, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div className="flex items-center">
                            <img src={meal.food.image} alt={meal.food.name} className="w-10 h-10 rounded-md object-cover mr-2" />
                            <div>
                              <p className="font-medium">{meal.food.name}</p>
                              <p className="text-xs text-gray-500">{meal.quantity} × {meal.food.calories} 千卡</p>
                            </div>
                          </div>
                          <p className="font-semibold">{(meal.food.calories * meal.quantity).toFixed(0)} 千卡</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-400">暂无记录</p>
                      <Button variant="ghost" className="text-green-600 mt-2" onClick={() => setCurrentPage('search')}>
                        <Plus size={16} className="mr-1 inline" /> 添加食物
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );

  // 搜索页面
  const renderSearch = () => (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">食物搜索</h1>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <Input 
          placeholder="搜索食物..." 
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredFoods.map(food => (
          <Card key={food.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedFood(food)}>
            <img src={food.image} alt={food.name} className="w-full h-32 object-cover" />
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{food.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">{food.servingSize}</p>
                <p className="text-green-600 font-semibold">{food.calories}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // 进度页面
  const renderProgress = () => (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">进度追踪</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>本周进度</CardTitle>
          <CardDescription>目标完成情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">热量目标</span>
                <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">连续打卡</p>
                <p className="font-bold text-green-700">5 天</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">营养均衡</p>
                <p className="font-bold text-blue-700">良好</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">运动指数</p>
                <p className="font-bold text-purple-700">一般</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>营养摄入</CardTitle>
          <CardDescription>今日营养素分布</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">碳水化合物</span>
                <span className="text-sm font-medium">{nutrientTotals.carbs.toFixed(0)}g</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (nutrientTotals.carbs / 300) * 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">蛋白质</span>
                <span className="text-sm font-medium">{nutrientTotals.protein.toFixed(0)}g</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, (nutrientTotals.protein / 150) * 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">脂肪</span>
                <span className="text-sm font-medium">{nutrientTotals.fat.toFixed(0)}g</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, (nutrientTotals.fat / 65) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 个人资料页面
  const renderProfile = () => (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">个人资料</h1>
      
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage src="https://picsum.photos/id/64/200/200" alt="用户头像" />
          <AvatarFallback>用户</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">健康用户</h2>
        <p className="text-gray-500">坚持健康饮食第5天</p>
      </div>
      
      <Card className="mb-4">
        <CardHeader><CardTitle>个人目标</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>每日热量目标</span>
              <span className="font-medium">{dailyGoal} 千卡</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>当前体重</span>
              <span className="font-medium">65 kg</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>目标体重</span>
              <span className="font-medium">62 kg</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>本周统计</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">平均每日摄入</p>
              <p className="text-xl font-bold text-green-600">986 千卡</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">达标天数</p>
              <p className="text-xl font-bold text-blue-600">4/7 天</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <main>
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'search' && renderSearch()}
        {currentPage === 'progress' && renderProgress()}
        {currentPage === 'profile' && renderProfile()}
        {selectedFood && renderFoodDetail()}
      </main>
      
      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t p-2">
        <div className="flex justify-around">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('dashboard')}
            className={`flex flex-col items-center ${currentPage === 'dashboard' ? 'text-green-600' : 'text-gray-500'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">首页</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('search')}
            className={`flex flex-col items-center ${currentPage === 'search' ? 'text-green-600' : 'text-gray-500'}`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">搜索</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('progress')}
            className={`flex flex-col items-center ${currentPage === 'progress' ? 'text-green-600' : 'text-gray-500'}`}
          >
            <BarChart3 size={20} />
            <span className="text-xs mt-1">进度</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-green-600' : 'text-gray-500'}`}
          >
            <User size={20} />
            <span className="text-xs mt-1">我的</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default App;
