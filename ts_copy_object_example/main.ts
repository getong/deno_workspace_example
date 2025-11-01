// ==================== 对象复制示例 ====================

// 定义一个包含嵌套对象的接口
interface Person {
  name: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
  hobbies: string[];
}

// 原始对象
const originalPerson: Person = {
  name: "张三",
  age: 25,
  address: {
    city: "北京",
    country: "中国",
  },
  hobbies: ["阅读", "游泳"],
};

console.log("========== 1. 浅复制 (Shallow Copy) ==========");

// 方法 1: 使用展开运算符 (Spread Operator)
const shallowCopy1 = { ...originalPerson };
shallowCopy1.name = "李四"; // 修改顶层属性
shallowCopy1.address.city = "上海"; // 修改嵌套对象

console.log("原始对象:", originalPerson);
console.log("浅复制1:", shallowCopy1);
console.log("⚠️  注意: 嵌套对象被共享，原始对象的 city 也变成了", originalPerson.address.city);

// 重置原始对象
originalPerson.address.city = "北京";

// 方法 2: 使用 Object.assign
const shallowCopy2 = Object.assign({}, originalPerson);
shallowCopy2.age = 30;
console.log("\n使用 Object.assign 的浅复制:", shallowCopy2);

console.log("\n========== 2. 深复制 (Deep Copy) ==========");

// 方法 1: 使用 structuredClone (推荐，Deno 原生支持)
const deepCopy1 = structuredClone(originalPerson);
deepCopy1.name = "王五";
deepCopy1.address.city = "广州";
deepCopy1.hobbies.push("编程");

console.log("原始对象:", originalPerson);
console.log("深复制:", deepCopy1);
console.log("✅ 深复制完全独立，原始对象未受影响");

// 方法 2: 使用 JSON (有局限性：不能复制函数、undefined、Symbol等)
const deepCopy2 = JSON.parse(JSON.stringify(originalPerson));
deepCopy2.address.country = "美国";
console.log("\n使用 JSON 的深复制:", deepCopy2);

console.log("\n========== 3. 对象移动 (Move) ==========");

// 在 JavaScript/TypeScript 中，"移动"通常意味着转移引用并清空原对象
interface Resource {
  id: number;
  data: string[];
  metadata?: Record<string, unknown>;
}

function moveObject<T extends Record<string, unknown>>(source: T): T {
  // 创建深复制
  const moved = structuredClone(source);

  // 清空原对象的所有属性
  for (const key in source) {
    delete source[key];
  }

  return moved;
}

const resource: Resource = {
  id: 1,
  data: ["item1", "item2", "item3"],
  metadata: { created: "2025-11-01" },
};

console.log("移动前的资源:", resource);

const movedResource = moveObject(resource);

console.log("移动后的新资源:", movedResource);
console.log("原始资源 (已清空):", resource);
console.log("✅ 资源所有权已转移");

console.log("\n========== 4. 数组的复制和移动 ==========");

const originalArray = [1, 2, 3, 4, 5];

// 浅复制数组
const copiedArray = [...originalArray];
copiedArray.push(6);
console.log("原始数组:", originalArray);
console.log("复制的数组:", copiedArray);

// 移动数组（转移并清空）
const arrayToMove = [10, 20, 30];
const movedArray = [...arrayToMove];
arrayToMove.length = 0; // 清空原数组

console.log("移动后的数组:", movedArray);
console.log("原数组 (已清空):", arrayToMove);

console.log("\n========== 5. 实用工具函数 ==========");

// 深复制工具函数
export function deepCopy<T>(obj: T): T {
  return structuredClone(obj);
}

// 浅复制工具函数
export function shallowCopy<T extends object>(obj: T): T {
  return { ...obj };
}

// 移动工具函数
export function move<T extends Record<string, unknown>>(source: T): T {
  const result = structuredClone(source);
  for (const key in source) {
    delete source[key];
  }
  return result;
}

// 测试工具函数
const testObj = {
  title: "测试对象",
  values: [1, 2, 3],
  nested: { level: 2 },
};

console.log("\n使用工具函数:");
const copied = deepCopy(testObj);
copied.values.push(4);
console.log("原对象:", testObj);
console.log("深复制:", copied);

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("\n✨ Deno 对象复制和移动示例完成！");
}
