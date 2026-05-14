import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Home, ChartPie, User, ChevronRight, Plus, Minus, 
  ArrowLeft, Filter, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 类型定义
interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  image: string;
  servingSize: string;
  isCustom?: boolean;
}

interface MealEntry {
  id: string;
  food: FoodItem;
  quantity: number;
  date: string;
}

type PageType = 'dashboard' | 'search' | 'progress' | 'profile';

// 初始内置食物数据库
const DEFAULT_FOOD_DATABASE: FoodItem[] = [
  {
    id: '1',
    name: '全麦面包',
    category: 'breakfast',
    calories: 250,
    carbs: 45,
    protein: 9,
    fat: 3,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '1片(40g)'
  },
  {
    id: '2',
    name: '水煮鸡蛋',
    category: 'breakfast',
    calories: 78,
    carbs: 0.6,
    protein: 6,
    fat: 5,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '1个(50g)'
  },
  {
    id: '3',
    name: '鸡胸肉沙拉',
    category: 'lunch',
    calories: 320,
    carbs: 12,
    protein: 35,
    fat: 12,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '1份(250g)'
  },
  {
    id: '4',
    name: '三文鱼',
    category: 'dinner',
    calories: 208,
    carbs: 0,
    protein: 22,
    fat: 13,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '100g'
  },
  {
    id: '5',
    name: '苹果',
    category: 'snack',
    calories: 52,
    carbs: 14,
    protein: 0.3,
    fat: 0.2,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '1个(182g)'
  },
  {
    id: '6',
    name: '香蕉',
    category: 'snack',
    calories: 96,
    carbs: 23,
    protein: 1.2,
    fat: 0.3,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '1根(118g)'
  },
  {
    id: '7',
    name: '糙米饭',
    category: 'lunch',
    calories: 112,
    carbs: 23,
    protein: 2.6,
    fat: 0.4,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '100g'
  },
  {
    id: '8',
    name: '西兰花',
    category: 'dinner',
    calories: 34,
    carbs: 7,
    protein: 2.8,
    fat: 0.4,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '100g'
  },
  {
    id: '9',
    name: '酸奶',
    category: 'breakfast',
    calories: 100,
    carbs: 12,
    protein: 5,
    fat: 3,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '100g'
  },
  {
    id: '10',
    name: '坚果混合',
    category: 'snack',
    calories: 160,
    carbs: 6,
    protein: 4,
    fat: 14,
    image: 'https://picsum.photos/id/292/300/300',
    servingSize: '20g'
  }
];

// 主应用组件
const CalorieTrackerApp: React.FC = () => {
  // 页面状态
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // 自定义食物弹窗
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  // 自定义食物表单
  const [newFood, setNewFood] = useState({
    name: '',
    category: '' as 'breakfast' | 'lunch' | 'dinner' | 'snack' | '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    servingSize: ''
  });

  // 食物数据库（本地持久化）
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>([]);

  // 初始化：读取本地存储
  useEffect(() => {
    const savedCustom = localStorage.getItem('customFoods');
    const savedMeals = localStorage.getItem('mealEntries');

    const customFoods: FoodItem[] = savedCustom ? JSON.parse(savedCustom) : [];
    setFoodDatabase([...DEFAULT_FOOD_DATABASE, ...customFoods]);

    if (savedMeals) setMealEntries(JSON.parse(savedMeals));
  }, []);

  // 数据变动自动保存到本地
  useEffect(() => {
    const custom = foodDatabase.filter(item => item.isCustom);
    localStorage.setItem('customFoods', JSON.stringify(custom));
  }, [foodDatabase]);

  useEffect(() => {
    localStorage.setItem('mealEntries', JSON.stringify(mealEntries));
  }, [mealEntries]);
  
  // 计算每日营养摄入
  const calculateDailyNutrition = () => {
    const dailyEntries = mealEntries.filter(entry => entry.date === selectedDate);
    
    const totalCalories = dailyEntries.reduce((sum, entry) => sum + (entry.food.calories * entry.quantity), 0);
    const totalCarbs = dailyEntries.reduce((sum, entry) => sum + (entry.food.carbs * entry.quantity), 0);
    const totalProtein = dailyEntries.reduce((sum, entry) => sum + (entry.food.protein * entry.quantity), 0);
    const totalFat = dailyEntries.reduce((sum, entry) => sum + (entry.food.fat * entry.quantity), 0);
    
    return {
      calories: totalCalories,
      carbs: totalCarbs,
      protein: totalProtein,
      fat: totalFat
    };
  };
  
  const dailyNutrition = calculateDailyNutrition();
  const calorieGoal = 1200;
  const caloriePercentage = Math.min(100, Math.round((dailyNutrition.calories / calorieGoal) * 100));
  
  // 过滤食物
  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 按餐食分类记录
  const getMealsByCategory = (category: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    return mealEntries.filter(
      entry => entry.date === selectedDate && entry.food.category === category
    );
  };
  
  // 添加餐食
  const addMeal = (food: FoodItem) => {
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      food,
      quantity,
      date: selectedDate
    };
    
    setMealEntries([...mealEntries, newEntry]);
    setSelectedFood(null);
    setQuantity(1);
  };

  // 新增自定义食物
  const handleAddCustomFood = () => {
    if (!newFood.name || !newFood.category || !newFood.calories) return;

    const item: FoodItem = {
      id: 'custom_' + Date.now(),
      name: newFood.name,
      category: newFood.category,
      calories: Number(newFood.calories),
      carbs: Number(newFood.carbs) || 0,
      protein: Number(newFood.protein) || 0,
      fat: Number(newFood.fat) || 0,
      image: 'https://picsum.photos/id/292/300/300',
      servingSize: newFood.servingSize || '1份',
      isCustom: true
    };

    setFoodDatabase(prev => [...prev, item]);
    setShowAddFoodModal(false);
    // 清空表单
    setNewFood({
      name: '',
      category: '',
      calories: '',
      carbs: '',
      protein: '',
      fat: '',
      servingSize: ''
    });
  };
  
  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
  };
  
  // 圆形进度条
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#e5e7eb" 
            strokeWidth="8" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="8" 
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{dailyNutrition.calories}</span>
          <span className="text-sm text-gray-500">/ {calorieGoal} 千卡</span>
        </div>
      </div>
    );
  };
  
  // 食物详情弹窗
  const renderFoodDetailModal = () => {
    if (!selectedFood) return null;
    
    return (
      <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedFood.name}</DialogTitle>
            <DialogDescription>营养信息</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={selectedFood.image} 
              alt={selectedFood.name} 
              className="w-32 h-32 rounded-full object-cover"
            />
            
            <div className="text-center">
              <p className="text-sm text-gray-500">份量: {selectedFood.servingSize}</p>
              <p className="text-2xl font-bold text-gray-800">{selectedFood.calories} 千卡</p>
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">数量</h3>
                  <p className="text-sm text-gray-500">x{quantity} 份</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="font-medium">{quantity}</span>
                  <Button 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">碳水</p>
                  <p className="text-lg font-bold text-blue-600">{selectedFood.carbs * quantity}g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">蛋白质</p>
                  <p className="text-lg font-bold text-purple-600">{selectedFood.protein * quantity}g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">脂肪</p>
                  <p className="text-lg font-bold text-amber-600">{selectedFood.fat * quantity}g</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => addMeal(selectedFood)}
          >
            添加到餐食
          </Button>
        </DialogContent>
      </Dialog>
    );
  };

  // 自定义新增食物弹窗
  const renderAddFoodModal = () => {
    return (
      <Dialog open={showAddFoodModal} onOpenChange={setShowAddFoodModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>添加我的自定义食物</DialogTitle>
            <DialogDescription>输入食物营养信息，保存到食物库</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>食物名称</Label>
              <Input 
                value={newFood.name}
                onChange={e => setNewFood({...newFood, name: e.target.value})}
                placeholder="例如：麻辣烫、奶茶、炒饭"
              />
            </div>

            <div>
              <Label>所属分类</Label>
              <Select 
                value={newFood.category} 
                onValueChange={val => setNewFood({...newFood, category: val as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择餐食分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">早餐</SelectItem>
                  <SelectItem value="lunch">午餐</SelectItem>
                  <SelectItem value="dinner">晚餐</SelectItem>
                  <SelectItem value="snack">零食</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>热量(千卡)</Label>
                <Input type="number" value={newFood.calories} onChange={e => setNewFood({...newFood, calories: e.target.value})} />
              </div>
              <div>
                <Label>份量说明</Label>
                <Input value={newFood.servingSize} onChange={e => setNewFood({...newFood, servingSize: e.target.value})} placeholder="1碗/100g" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>碳水(g)</Label>
                <Input type="number" value={newFood.carbs} onChange={e => setNewFood({...newFood, carbs: e.target.value})} />
              </div>
              <div>
                <Label>蛋白质(g)</Label>
                <Input type="number" value={newFood.protein} onChange={e => setNewFood({...newFood, protein: e.target.value})} />
              </div>
              <div>
                <Label>脂肪(g)</Label>
                <Input type="number" value={newFood.fat} onChange={e => setNewFood({...newFood, fat: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddFoodModal(false)}>取消</Button>
            <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={handleAddCustomFood}>保存添加</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // 营养卡片
  const renderNutrientCard = (
    title: string, 
    value: number, 
    unit: string, 
    color: string
  ) => {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className={`text-xl font-bold ${color}`}>{value}<span className="text-sm font-normal"> {unit}</span></p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // 餐食区域
  const renderMealSection = (
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    title: string
  ) => {
    const meals = getMealsByCategory(category);
    const totalCalories = meals.reduce((sum, entry) => sum + (entry.food.calories * entry.quantity), 0);
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="font-medium flex-1">{title}</h3>
          <span className="text-gray-600">{totalCalories 千卡}</span>
        </div>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            {meals.length > 0 ? (
              <div className="space-y-3">
                {meals.map(entry => (
                  <div key={entry.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={entry.food.image} 
                        alt={entry.food.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="font-medium">{entry.food.name}</p>
                        <p className="text-xs text-gray-500">x{entry.quantity} 份</p>
                      </div>
                    </div>
                    <p className="font-medium">{entry.food.calories * entry.quantity} 千卡</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p>暂无记录，点击添加食物</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-3 rounded-b-lg">
            <Button 
              variant="ghost" 
              className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => setCurrentPage('search')}
            >
              <Plus size={18} className="mr-1" /> 添加食物
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // 页面渲染
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="flex flex-col pb-20">
            <div className="flex justify-between items-center p-4">
              <div>
                <h1 className="text-2xl font-bold">健康饮食</h1>
                <p className="text-gray-500">{formatDate(selectedDate)}</p>
              </div>
              <Avatar>
                <AvatarImage src="https://picsum.photos/id/64/100/100" alt="用户头像" />
                <AvatarFallback>用户</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex flex-col items-center my-4">
              <CircularProgress percentage={caloriePercentage} />
              <p className="text-gray-600 mt-2">今日热量摄入</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 px-4 mb-6">
              {renderNutrientCard("碳水化合物", dailyNutrition.carbs, "g", "text-blue-600")}
              {renderNutrientCard("蛋白质", dailyNutrition.protein, "g", "text-purple-600")}
              {renderNutrientCard("脂肪", dailyNutrition.fat, "g", "text-amber-600")}
            </div>
            
            <div className="px-4">
              <h2 className="text-xl font-bold mb-4">今日餐食</h2>
              {renderMealSection('breakfast', '早餐')}
              {renderMealSection('lunch', '午餐')}
              {renderMealSection('dinner', '晚餐')}
              {renderMealSection('snack', '零食')}
            </div>
          </div>
        );
        
      case 'search':
        return (
          <div className="flex flex-col pb-20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">食物搜索</h1>
                <Button 
                  className="bg-green-500 hover:bg-green-600 rounded-full"
                  onClick={() => setShowAddFoodModal(true)}
                >
                  <Plus size={18} className="mr-1" /> 我的食物
                </Button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <Input 
                  placeholder="搜索食物..." 
                  className="pl-10 pr-4 py-2 rounded-full border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <Card 
                      key={food.id} 
                      className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${food.isCustom ? 'border-green-400' : ''}`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={food.image} 
                          alt={food.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium truncate">{food.name}</h3>
                        <p className="text-sm text-gray-500">{food.calories} 千卡</p>
                        {food.isCustom && <span className="text-xs text-green-600">自定义</span>}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p>未找到相关食物</p>
                  </div>
                )}
              </div>
            </div>
            {renderFoodDetailModal()}
            {renderAddFoodModal()}
          </div>
        );
        
      case 'progress':
        return (
          <div className="flex flex-col pb-20 px-4">
            <h1 className="text-2xl font-bold mt-4 mb-6">进度追踪</h1>
            
            <Card className="mb-6 shadow-sm">
              <CardHeader>
                <CardTitle>本周进度</CardTitle>
                <CardDescription>热量目标完成情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">总体完成率</span>
                      <span className="text-sm font-medium">{caloriePercentage}%</span>
                    </div>
                    <Progress value={caloriePercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 mt-6">
                    {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                          ${index === 4 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {index < 5 ? '✓' : ''}
                        </div>
                        <span className="text-xs">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500">连续打卡</h3>
                  <p className="text-2xl font-bold">5 天</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500">平均每日</h3>
                  <p className="text-2xl font-bold">{Math.round(dailyNutrition.calories * 0.8)} 千卡</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>营养指标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">碳水化合物</span>
                    <span className="text-sm font-medium">{dailyNutrition.carbs}/250g</span>
                  </div>
                  <Progress value={(dailyNutrition.carbs / 250) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">蛋白质</span>
                    <span className="text-sm font-medium">{dailyNutrition.protein}/150g</span>
                  </div>
                  <Progress value={(dailyNutrition.protein / 150) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">脂肪</span>
                    <span className="text-sm font-medium">{dailyNutrition.fat}/65g</span>
                  </div>
                  <Progress value={(dailyNutrition.fat / 100) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'profile':
        return (
          <div className="flex flex-col pb-20 px-4">
            <h1 className="text-2xl font-bold mt-4 mb-6">个人资料</h1>
            
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://picsum.photos/id/64/200/200" alt="用户头像" />
                <AvatarFallback>用户</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">健康用户</h2>
              <p className="text-gray-500">坚持记录 5 天</p>
            </div>
            
            <Card className="shadow-sm mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center py-2">
                  <span>每日热量目标</span>
                  <div className="flex items-center text-gray-500">
                    <span>1200 千卡</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span>个人信息</span>
                  <div className="flex items-center text-gray-500">
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span>饮食偏好</span>
                  <div className="flex items-center text-gray-500">
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span>提醒设置</span>
                  <div className="flex items-center text-gray-500">
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button className="bg-green-500 hover:bg-green-600 mt-4">
              导出数据报告
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {renderCurrentPage()}
      {renderAddFoodModal()}
      {renderFoodDetailModal()}
      
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`flex flex-col items-center p-2 ${currentPage === 'dashboard' ? 'text-green-500' : 'text-gray-500'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">首页</span>
          </button>
          <button 
            onClick={() => setCurrentPage('search')}
            className={`flex flex-col items-center p-2 ${currentPage === 'search' ? 'text-green-500' : 'text-gray-500'}`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">搜索</span>
          </button>
          <button 
            onClick={() => setCurrentPage('progress')}
            className={`flex flex-col items-center p-2 ${currentPage === 'progress' ? 'text-green-500' : 'text-gray-500'}`}
          >
            <ChartPie size={20} />
            <span className="text-xs mt-1">进度</span>
          </button>
          <button 
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center p-2 ${currentPage === 'profile' ? 'text-green-500' : 'text-gray-500'}`}
          >
            <User size={20} />
            <span className="text-xs mt-1">我的</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalorieTrackerApp;
