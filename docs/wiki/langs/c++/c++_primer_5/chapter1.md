---
title: 1. 开始
date: 2017-08-16
article: false
category:
  - C++
tag:
  - C++
order: 1
---

这是一篇在 C++ Primer Edition 5 学习过程中的简单笔记。Part I 和 Part II 主要介绍 C++ 中基本的语言特性和标准库的一些内容，Part III 侧重于面向对象等，Part IV 侧重于异常处理等。

个人认为 Part I 中比较关键的章节是第 2、6、7 章，Part II 中比较关键的章节是第 9、11、12 章，Par III 中几乎所有章节都是重点， Part IV 中的关键章节是第 18、19 章。

## Part I

- [1. 开始](chapter1.md)
- [2. 变量和基本类型](chapter2.md)
  - [2.1 基本内置类型](chapter2.md/#_2-1-基本内置类型)
    - [2.1.1 算术类型](chapter2.md/#_2-1-1-算术类型)
    - [2.1.2 类型转换](chapter2.md/#_2-1-2-类型转换)
    - [2.1.3 字面值常量](chapter2.md/#_2-1-3-字面值常量)
  - [2.2 变量](chapter2.md/#_2-2-变量)
    - [2.2.1 变量定义](chapter2.md/#_2-2-1-变量定义)
    - [2.2.2 变量声明与定义的关系](chapter2.md/#_2-2-2-变量声明与定义的关系)
    - [2.2.3 标识符](chapter2.md/#_2-2-3-标识符)
    - [2.2.4 名字的作用域](chapter2.md/#_2-2-4-名字的作用域)
  - [2.3 复合类型](chapter2.md/#_2-3-复合类型)
    - [2.3.1 引用(左值引用)](chapter2.md/#_2-3-1-引用-左值引用)
    - [2.3.2 指针](chapter2.md/#_2-3-2-指针)
      - [2.3.3 理解复合类型的声明](chapter2.md/#_2-3-3-理解复合类型的声明)
  - [2.4 const 限定符](chapter2.md/#_2-4-const-限定符)
    - [2.4.1 const 的引用](chapter2.md/#_2-4-1-const-的引用)
    - [2.4.2 指针与 const](chapter2.md/#_2-4-2-指针与-const)
    - [2.4.3 顶层 const](chapter2.md/#_2-4-3-顶层-const)
    - [2.4.4 constexpr 和常量表达式](chapter2.md/#_2-4-4-constexpr-和常量表达式)
  - [2.5 处理类型](chapter2.md/#_2-5-处理类型)
    - [2.5.1 类型别名](chapter2.md/#_2-5-1-类型别名)
    - [2.5.2 auto 类型说明符](chapter2.md/#_2-5-2-auto-类型说明符)
    - [2.5.3 decltype 类型说明符](chapter2.md/#2_5-3-decltype-类型说明符)
  - [2.6 自定义数据结构](chapter2.md/#_2-6-自定义数据结构)
- [3. 字符串、向量与数组](chapter3.md)
  - [3.1 命名空间的 using 声明](chapter3.md/#_3-1-命名空间的-using-声明)
  - [3.2 标准库类型 string](chapter3.md/#_3-2-标准库类型-string)
    - [3.2.1 定义和初始化 string 对象](chapter3.md/#_3-2-1-定义和初始化-string-对象)
    - [3.2.2 string 对象的操作](chapter3.md/#_3-2-2-string-对象的操作)
    - [3.2.3 处理 string 对象中的字符](chapter3.md/#_3-2-3-处理-string-对象中的字符)
  - [3.3 标准库类型 vector](chapter3.md/#_3-3-标准库类型-vector)
    - [3.3.1 定义和初始化 vector 对象](chapter3.md/#_3-3-1-定义和初始化-vector-对象)
    - [3.3.2 向 vector 对象中添加元素](chapter3.md/#_3-3-2-向-vector-对象中添加元素)
    - [3.3.3 其他 vector 操作](chapter3.md/#_3-3-3-其他-vector-操作)
  - [3.4 迭代器介绍](chapter3.md/#_3-4-迭代器介绍)
    - [3.4.1 使用迭代器](chapter3.md/#_3-4-1-使用迭代器)
    - [3.4.2 迭代器运算](chapter3.md/#_3-4-2-迭代器运算)
  - [3.5 数组](chapter3.md/#_3-5-数组)
    - [3.5.1 定义和初始化内置数组](chapter3.md/#_3-5-1-定义和初始化内置数组)
    - [3.5.2 访问数组元素](chapter3.md/#_3-5-2-访问数组元素)
    - [3.5.3 指针和数组](chapter3.md/#_3-5-3-指针和数组)
    - [3.5.4 C 风格的字符串](chapter3.md/#_3-5-4-c-风格的字符串)
    - [3.5.5 与旧代码的接口](chapter3.md/#_3-5-5-与旧代码的接口)
  - [3.6 多维数组](chapter3.md/#_3-6-多维数组)
- [4. 表达式](chapter4.md)
- [5. 语句](chapter5.md)
- [6. 函数](chapter6.md)
- [7. 类](chapter7.md)

## Part II

- [8. IO 库](chapter8.md)
  - [8.1 IO 类](chapter8.md/#_8-1-io-类)
    - [8.1.1 IO 对象无拷贝或赋值](chapter8.md/#_8-1-1-io-对象无拷贝或赋值)
    - [8.1.2 条件状态](chapter8.md/#_8-1-2-条件状态)
    - [8.1.3 管理输出缓冲](chapter8.md/#_8-1-3-管理输出缓冲)
  - [8.2 文件输入输出](chapter8.md/#_8-2-文件输入输出)
    - [8.2.1 使用文件流对象](chapter8.md/#_8-2-1-使用文件流对象)
    - [8.2.2 文件模式](chapter8.md/#_8-2-2-文件模式)
  - [8.3 string 流](chapter8.md/#_8-3-string-流)
    - [8.3.1 使用 istringstream](chapter8.md/#_8-3-1-使用-istringstream)
    - [8.3.2 使用 ostringstream](chapter8.md/#_8-3-2-使用-ostringstream)
- [9. 顺序容器](chapter9.md)
  - [9.1 顺序容器概述](chapter9.md/#_9-1-顺序容器概述)
  - [9.2 容器库概览](chapter9.md/#_9-2-容器库概览)
    - [9.2.1 迭代器](chapter9.md/#_9-2-1-迭代器)
    - [9.2.2 容器的类型成员](chapter9.md/#_9-2-2-容器的类型成员)
    - [9.2.3 begin 和 end 成员](chapter9.md/#_9-2-3-begin-和-end-成员)
    - [9.2.4 容器定义和初始化](chapter9.md/#_9-2-4-容器定义和初始化)
    - [9.2.5 赋值和 swap](chapter9.md/#_9-2-5-赋值和-swap)
    - [9.2.6 容器大小操作](chapter9.md/#_9-2-6-容器大小操作)
    - [9.2.7 关系运算符](chapter9.md/#_9-2-7-关系运算符)
  - [9.3 顺序容器操作](chapter9.md/#_9-3-顺序容器操作)
    - [9.3.1 向顺序容器中添加元素](chapter9.md/#_9-3-1-向顺序容器中添加元素)
    - [9.3.2 访问元素](chapter9.md/#_9-3-2-访问元素)
    - [9.3.3 删除元素](chapter9.md/#_9-3-3-删除元素)
    - [9.3.4 特殊的 forward_list 操作](chapter9.md/#_9-3-4-特殊的-forward_list-操作)
    - [9.3.5 改变容器大小](chapter9.md/#_9-3-5-改变容器大小)
    - [9.3.6 容器操作可能导使迭代器失效](chapter9.md/#_9-3-6-容器操作可能导使迭代器失效)
  - [9,4 vector 对象是如何增长的](chapter9.md/#_9-4-vector-对象是如何增长的)
  - [9.5 额外的 string 操作](chapter9.md/#_9-5-额外的-string-操作)
    - [9.5.1 构造 string 的其他方法](chapter9.md/#_9-5-1-构造-string-的其他方法)
    - [9.5.2 改变 string 的其他方法](chapter9.md/#_9-5-2-改变-string-的其他方法)
    - [9.5.3 string 搜索操作](chapter9.md/#_9-5-3-string-搜索操作)
    - [9.5.4 compare 函数](chapter9.md/#_9-5-4-compare-函数)
    - [9.5.5 数值转换](chapter9.md/#_9-5-5-数值转换)
  - [9.6 容器适配器](chapter9.md/#_9-6-容器适配器)
- [10. 泛型算法](chapter10.md)
  - [10.1 概述](chapter10.md/#_10-1-概述)
    - [10.2 初始泛型算法](chapter10.md/#_10-2-初始泛型算法)
    - [10.2.1 只读算法](chapter10.md/#_10-2-1-只读算法)
    - [10.2.2 写容器的算法](chapter10.md/#_10-2-2-写容器的算法)
    - [10.2.3 重排容器的算法](chapter10.md/#_10-2-3-重排容器的算法)
  - [10.3 定制操作](chapter10.md/#_10-3-定制操作)
    - [10.3.1 向算法传递函数](chapter10.md/#_10-3-1-向算法传递函数)
    - [10.3.2 lambda 表达式](chapter10.md/#_10-3-2-lambda-表达式)
    - [10.3.3 lambda 捕获和返回](chapter10.md/#_10-3-3-lambda-捕获和返回)
    - [10.3.4 参数绑定](chapter10.md/#_10-3-4-参数绑定)
  - [10.4 再探迭代器](chapter10.md/#_10-4-再探迭代器)
    - [10.4.1 插入迭代器](chapter10.md/#_10-4-1-插入迭代器)
    - [10.4.2 iostream 迭代器](chapter10.md/#_10-4-2-iostream-迭代器)
    - [10.4.3 反向迭代器](chapter10.md/#_10-4-3-反向迭代器)
  - [10.5 泛型算法结构](chapter10.md/#_10-5-泛型算法结构)
    - [10.5.1 5 类迭代器](chapter10.md/#_10-5-1-5-类迭代器)
    - [10.5.2 算法形参模式](chapter10.md/#_10-5-2-算法形参模式)
    - [10.5.3 算法命名规范](chapter10.md/#_10-5-3-算法命名规范)
  - [10.6 特定容器算法](chapter10.md/#_10-6-特定容器算法)
- [11. 关联容器](chapter11.md)
- [12. 动态内存](chapter12.md)

## Part III

- [13. 拷贝控制](chapter13.md)
- [14. 重载运算与类型转换](chapter14.md)
- [15. 面向对象程序设计](chapter15.md)
- [16. 模板与泛型编程](chapter16.md)

## Part IV

- [17. 标准库特殊设施](chapter17.md)
- [18. 用于大型程序的工具](chapter18.md)
- [19. 特殊工具与技术](chapter19.md)

## 1. 开始

原书中该章节主要介绍了 C++ 的基本情况，简述了如何编写一个简单的 C++ 程序，以及如何进行输入输出等。

```cpp
#include <iostream>

int main(int argc, char **argv) {
  std::cout << "hello world" << std::endl;
  return 0;
}

```
