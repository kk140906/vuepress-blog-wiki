---
title: 1. 开始
date: 2017-08-16
article: false
category:
  - C++
tag:
  - C++
---

这是一篇在 C++ Primer Edition 5 学习过程中的简单笔记。Part I 和 Part II 主要介绍 C++ 中基本的语言特性和标准库的一些内容，Part III 侧重于面向对象等，Part IV 侧重于异常处理等。

个人认为 Part I 中比较关键的章节是第 2、6、7 章，Part II 中比较关键的章节是第 9、11、12 章，Par III 中几乎所有章节都是重点， Part IV 中的关键章节是第 18、19 章。

## Part I

- [1. 开始](chapter1.md)
- [2. 变量和基本类型](chapter2.md)
  - 基本内置类型
    - 算术类型
    - 类型转换
    - 字面值常量
  - 变量
    - 变量定义
    - 变量声明与定义的关系
    - 标识符
    - 名字的作用域
  - 复合类型
    - 引用(左值引用)
    - 指针
    - 理解复合类型的声明
  - const 限定符
    - const 的引用
    - 指针与 const
    - 顶层 const
    - constexpr 和常量表达式
  - 处理类型
    - 类型别名
    - auto 类型说明符
    - decltype 类型说明符
  - 自定义数据结构
- [3. 字符串、向量与数组](chapter3.md)
- [4. 表达式](chapter4.md)
- [5. 语句](chapter5.md)
- [6. 函数](chapter6.md)
- [7. 类](chapter7.md)

## Part II

- [8. IO 库](chapter8.md)
- [9. 顺序容器](chapter9.md)
- [10. 泛型算法](chapter10.md)
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
  std::cout << "hello world" << std:: endl;
  return 0;
}

```
