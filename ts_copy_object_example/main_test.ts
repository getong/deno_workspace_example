import { assertEquals, assertNotEquals } from "@std/assert";
import { deepCopy, shallowCopy, move } from "./main.ts";

Deno.test("deepCopy - 深复制测试", () => {
  const original = {
    name: "测试",
    nested: { value: 42 },
    array: [1, 2, 3],
  };

  const copied = deepCopy(original);

  // 修改复制的对象
  copied.name = "修改后";
  copied.nested.value = 100;
  copied.array.push(4);

  // 原对象应该保持不变
  assertEquals(original.name, "测试");
  assertEquals(original.nested.value, 42);
  assertEquals(original.array.length, 3);

  // 复制的对象应该被修改
  assertEquals(copied.name, "修改后");
  assertEquals(copied.nested.value, 100);
  assertEquals(copied.array.length, 4);
});

Deno.test("shallowCopy - 浅复制测试", () => {
  const original = {
    name: "测试",
    nested: { value: 42 },
  };

  const copied = shallowCopy(original);

  // 修改顶层属性
  copied.name = "修改后";

  // 顶层属性应该独立
  assertEquals(original.name, "测试");
  assertEquals(copied.name, "修改后");

  // 修改嵌套对象
  copied.nested.value = 100;

  // 嵌套对象是共享的
  assertEquals(original.nested.value, 100);
  assertEquals(copied.nested.value, 100);
});

Deno.test("move - 对象移动测试", () => {
  const original = {
    id: 1,
    data: "test",
    nested: { value: 42 },
  };

  const moved = move(original);

  // 移动后的对象应该包含所有数据
  assertEquals(moved.id, 1);
  assertEquals(moved.data, "test");
  assertEquals(moved.nested.value, 42);

  // 原对象应该被清空
  assertEquals(Object.keys(original).length, 0);
  assertEquals(original.id, undefined);
  assertEquals(original.data, undefined);
});

Deno.test("move - 移动后的对象应该独立", () => {
  const original = {
    array: [1, 2, 3],
  };

  const moved = move(original);

  // 修改移动后的对象
  moved.array.push(4);

  // 验证原对象已被清空
  assertEquals(original.array, undefined);

  // 验证移动后的对象可以独立修改
  assertEquals(moved.array.length, 4);
});

Deno.test("数组深复制测试", () => {
  const original = [{ id: 1 }, { id: 2 }];
  const copied = deepCopy(original);

  copied[0].id = 999;
  copied.push({ id: 3 });

  assertEquals(original[0].id, 1);
  assertEquals(original.length, 2);
  assertEquals(copied[0].id, 999);
  assertEquals(copied.length, 3);
});
