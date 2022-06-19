---
title: 5. 语句
order: 5
category:
  - C++
tag:
  - 条件语句
  - 循环语句
  - 跳转语句
article: false
date: 2017-08-30
---

## 5.1 简单语句

C++ 语言的语句以分号结尾，如果表达式以分号结尾就是**表达式语句**。

最简单的语句就是一个单独的分号，它是一个空语句，表示什么也不做，主要用在语法上需要语句而逻辑上不需要执行什么操作的地方。

"**复合语句**" 是指使用花括号包围的所有语句，有时候也称为 "**语句块**"，==一个语句块就是一个作用域，在块中引入的名字只能在块或者其嵌套块中使用==。

> 块并不以分号结尾，同时，空块就是花括号中不包含任何语句，作用与空语句类似。

## 5.2 语句作用域

可以在 _if_ 、_while_、_switch_、_for_ 语句的控制结构中定义变量，这些变量只在相应语句块内部可见，一旦语句块结束，变量就超出了其作用范围，因此不能被语句块外部使用。由于控制结构定义的对象的值马上要被结构本身使用，所以这些变量必须初始化。

```cpp
while(int i = 15) --i;
```

## 5.3 条件语句

条件语句由两种，一种是 _if_ ，另一种是 _switch_。_if_ 语句可以包含 _else_ 或者 _else if_，同时也允许在语句块中嵌套其他条件语句。由于允许嵌套定义，同时也允许包含 _else_、_else if_ 等，那么是如何进行匹配的呢？C++ 使用的是最近匹配原则，它规定 _else_ 与最近的尚未匹配的 _if_ 语句匹配，_我们可以通过将 if_ 后面的语句定义为块以调整 _else_ 的匹配。

```cpp
// if样式
if (condition)
     statement;

// if else 样式
if (condition)
    statement;
else
    statement;

// if else if else 样式
if (condition)
    statement;
else if (condition)
    statement;
else
   statement;

// if 嵌套 if else样式
if (condition) {
    if (condition)
        statement;
    else
        statement;
}

// if 嵌套 if 样式
if (condition) {
    if (condition)
        statement;
} else {
    if (conditon)
        statement;
}
```

_switch_ 语句与 _if_ 语句功能一致，_switch_ 语句与 _case_ 关键字配套使用，==**它首先对 _switch_ 括号中的表达式进行求值，然后匹配 _case_ 中的情况。如果结果与 _case_ 标签中的值匹配成功，那么程序会从该标签之后的第一条语句开始执行，直到到达了 _swich_ 的结尾或者遇到 _break_ 语句为止。**== _case_ 关键字及其后面的表达式一起称为 "**case 标签**"，**表达式的类型只能是常量表达式**。可以在 _switch_ 语句中使用 _default_ 关键字以表示如果没有匹配 case 标签，那么就执行该默认语句。

## 5.4 迭代语句

迭代语句主要包含 _while_、_for_、_range for_、_do-while_ 等形式。

```cpp
// 只要condition为真就重复执行循环体
while (condition)
    statement;

// 传统的for语句,包含三个部分,各部分以分号进行分隔
// 第一部分是变量初始化语句,第二部分是循环条件,第三部分是表达式
// 这三部分都可以为空,如果省略循环条件相当于循环条件一直为true
// for语句执行的顺序是
// 执行init_statement--> 判定condition是否满足 --> 执行表达式语句 --> 执行expression
// init_statement语句中可以定义多个对象，但是只能声明一个类型
for (init_statement;condition;expression)
    statement;

// 范围for语句由C++11引入，可以遍历容器或者其他序列中的所有元素
for (declration : expression)
    statement;
// 范围for语句等价于下面的语句，由于其定义了end，
// 因此不能在范围for语句中对容器的大小进行修改
for (auto begin = v.begin(),end = v.end(); begin != end; ++begin) {
    auto &r = *begin;
}

// do-while语句先执行循环体，后判断条件，这就意味着循环体至少执行一次
// 语句需要以分号结尾，因此while条件后需要添加一个分号进行标识
// do-while语句不允许在条件变量部分进行变量定义
do {
    statement;
} while (condition);
```

## 5.5 跳转语句

1. _break_: 负责终止离它最近的 _while_、_do-while_、_for_ 或者 _switch_ 语句，它只能终止一层循环；
2. _continue_ : 负责终止当前循环，继续开始进行下一次循环;
3. _return_ : 用于函数返回，可直接终止函数内部所有操作；
4. _goto_ : 无条件跳转到另一条语句，现在基本不使用了。

## 5.6 try 语句块和异常处理

异常处理包括：

- _throw_ 表达式：在遇到无法处理的情况下主动抛出异常；
- _try_ 语句块:_try_ 语句块与 _catch_ 语句块配合使用，用于捕获异常;
- 异常类：用于在 _throw_ 表达式和相关的 _catch_ 语句中传递异常信息。

```cpp
// throw表达式
throw std::runtime_error("error!");

// try catch语句块
// exception_declartion表示异常声明
// 对于一个程序如果发生了异常，并且在栈展开过程中都没有使用try语句块进行异常捕获，
// 那么最终程序会转到terminate标准库函数终止程序
try {
    statement;
} catch (exception_declartion) {
    statement;
} catch (exception_declartion) {
    statement;
} catch (...)
```

C++ 标准库中定义一组异常类型，分布在以下头文件中：

- exception 头文件定义的是最通用的异常类，它只报告异常的发生不提供任何额外信息；
- stdexcept 头文件定义定义了以下常见的异常类;

:::center

| 异常类型           | 详细                                           |
| ------------------ | ---------------------------------------------- |
| _exception_        | 最常见的问题                                   |
| _runtime_error_    | 只能在运行时才能检测出的问题                   |
| _range_error_      | 运行时错误：生成的结果超出了有意义的值域范围   |
| _overflow_error_   | 运行时错误：计算上溢                           |
| _underflow_error_  | 运行时错误：计算下溢                           |
| _logic_error_      | 程序逻辑错误                                   |
| _domain_error_     | 逻辑错误：参数对应的结果值不存在               |
| _invalid_argument_ | 逻辑错误：无效参数                             |
| _length_error_     | 逻辑错误：试图创建一个超过该类型最大长度的对象 |
| _out_of_range_     | 逻辑错误：使用一个超出有效范围的值             |

:::

- new 头文件定义的 _bad_alloc_ 异常类型；
- type<span>\_</span>info 头文件定义的 _bad_cast_ 异常类型;

其中，_bad_alloc_ 和 _bad_cast_ 只能以默认初始化的方式进行初始化，不允许提供初始值，而其他异常类型则应该使用 _string_ 对象或者 C 风格字符串初始化，不允许使用默认初始化的方式，必须提供初始值。

异常类型只定义了一个 _what_ 成员函数，该成员函数没有任何参数，返回值是一个指向 C 风格字符串的 const char \*。
