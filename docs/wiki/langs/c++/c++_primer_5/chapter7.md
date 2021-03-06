---
title: 7. 类
order: 7
category:
  - C++
tag:
  - 类
  - 类的权限
  - 构造函数
  - 静态成员
article: false
date: 2017-09-07
---

## 7.1 定义抽象数据类型

类的基本思想是数据抽象和封装，数据抽象使一种依赖于接口和实现分离的编程技术。通过定义抽象数据类型可以实现类的数据抽象和封装。

类的所有成员必须在类中进行声明，成员函数可以定义在类内部或者类外部。

每一个类都有一个名为 _this_ 的**隐式常量指针**，指向调用成员函数的对象。因为这个特性，我们在**成员函数内部**，可以直接使用调用这个函数的对象的成员。

:::note

类的成员函数的形参列表之后可以添加 <i>const</i> 关键字，这种成员函数被称为 "<b>常成员函数</b>"。<b>成员函数是否是常成员函数可以作为函数重载的判断依据。</b><i>const</i> 关键字实际限定的是 <i>this</i> 指针的类型，==默认情况下，<i>this</i> 指针是指向非常量版本的常量指针==，例如 Sales_data 的成员函数中的 <i>this</i> 指针的类型实际等价于 <i>Sales_data const \* </i> 。这个 <i>const</i> 是顶层 <i>const</i> ，表示对象本身( <i>this</i> 指针本身)不能被修改，我们不能把 <i>this</i> 指针指向一个常量对象，因此不能在常量对象上调用普通的成员函数。 如果在函数内部不会改变 <i>this</i> 所指向的对象，那么将成员函数设置为常成员函数可以提高函数的适用范围。

:::

如果 _const_ 关键字放置在成员函数的前面，那么 _const_ 关键字实际限定的成员函数的返回值。

类中成员函数可以在任何时候随意访问成员变量，这是因为编译器在处理类的时候首先编译的是类的成员变量的声明，然后才会处理成员函数。

如果在类的外部成员函数，那么成员函数的定义必须与它的声明匹配，即返回类型、参数列表、函数名和 _const_ 属性都必须要与类内部的声明一致。

在类里面有几类特殊的函数，其中之一就是构造函数，它的名字与类名相同，没有返回值，可以具有多个重载函数。它的任务是初始化类对象的成员变量，无论何时只要类的对象被创建，就会执行构造函数。需要注意的是：**构造函数不能被声明为 _const_ 类型，也不能声明为虚函数。** 当创建 _const_ 对象时，直到构造函数的初始化完成，对象才拥有真正意义上的常量属性，在构造过程中可以给对象写值。

类通过默认的构造函数来控制类成员的默认初始化过程，默认的构造函数不需要任何实参。**如果类没有显式的定义任何构造函数，编译器会隐式的定义一个合成的默认构造函数**，合成的默认构造函数的初始化过程如下：

- 如果存在类内初始值，那么就用这个类内初始值初始化成员
- 如果不存在类内初始值，那么对类内成员执行默认初始化

对于某些类不能依赖合成的默认构造函数，这是因为：

- 只有当没有显式定义任何构造函数时，编译器才会自动生成默认的构造函数
- 定义在类中的内置类型或者复合类型的对象被默认初始化，它们的值是未定义的
- 如果类中包含其他类类型的成员，而这个成员没有默认构造函数，那么编译器就无法对其进行初始化

如果一个构造函数为所有参数都提供了默认的实参，那么它实际上相当于定义了默认构造函数。

C++ 11 新标准规定，如果需要编译器生成默认构造函数可以使用 `=default` 进行声明。`=default`出现的位置既可以在类内部的函数声明处，则该构造函数是默认内联的；也可以出现在类的外部，则该构造函数不是内联的。

构造函数可以具有初始值列表，**初始值被包围在圆括号或者花括号中**，不同成员的初始值通过逗号分隔，没有出现在构造函数初始值列表的成员首先使用类内初始值，没有则执行默认初始化。

有的类除了构造函数外，还需要控制对象在拷贝、赋值和销毁时的行为，如果不显式定义这些操作，编译器将自动合成这些操作，但是对于某些类，编译器合成的版本经常无法正常工作。

## 7.2 访问控制与封装

在 C++语言中，有三种类型的访问说明符：

1. _public_ : 定义在 _public_ 之后的成员在整个程序中可被访问，主要用于定义类的接口
2. _private_ : 定义在 _private_ 之后的成员只能被类内部的成员函数访问
3. _protected_ : 定义在 _protected_ 之后的成员可以被类内部的成员函数访问，也可以被其派生类内部的成员函数访问

每个访问说明符指定了接下来的成员访问级别，其有效范围直到出现下一个访问说明符或者到达类的结尾处。

使用 _class_ 和 _struct_ 定义类唯一的区别就是默认的访问权限，_class_ 默认的访问权限是 _private_，_struct_ 默认的访问权限是 _public_。

可以将其他类或者函数声明为类的友元，这样其他类或者函数就可以访问类内部的非公有成员。

- 友元声明是通过 _friend_ 关键字实现，后面紧跟其他类或者函数的声明。
- 友元的声明只能出现在类的内部，通常定义在类的开始或者结束位置。
- 友元的声明只指定了访问的权限，并非通常意义上的函数声明，如果希望类的用户能够调用某个友元函数，则必须在友元声明之外再专门对函数进行一次声明。

## 7.3 类的其他特性

### 7.3.1 类成员再探

类中除了定义数据和函数成员外，还可以自定义某种类型在类中的别名，该别名与其他成员一样具有访问限制，用来定义类型的成员必须先定义后使用。

```cpp
class Screen {
public:
    // 自定义类型别名
    typedef std::string::size_type pos;
    using pos = std::string::size_type;
};
```

在类中定义的成员函数是自动 _inline_ 的，位于类外部的成员函数可以显式的使用 _inline_ 关键字声明成员函数为内联函数。

类的成员可以使用 _mutable_ 声明为可变的，这样数据成员就成为了可变数据成员，可以修改在常成员函数中修改数据成员的值，一个可变数据成员永远不会是 _const_。

对于类内初始值必须使用 = 的初始化形式或者是花括号括起来的直接初始化形式，类内初始化绝对不能使用圆括号进行初始化。

### 7.3.2 返回 \* this 的成员函数

对于需要返回类对象的成员函数，其返回值通常是引用类型，否则其返回值是 `*this` 的副本，后续对这个对象的修改只能改变临时的副本。而如果成员函数是常成员函数，那么 _this_ 指针的类型是 `const A const *`,返回的类对象是常量对象。

### 7.3.3 类类型

每个类定义了唯一的类型，使用类创建对象的时候可以直接使用类名，也可以在跟在关键字 _class_ 和 _struct_ 后创建对象。

```cpp
class A {};
A a;
class A a; // 等价的定义
```

类可以进行前向声明，在定义前使用前向声明的类是一个不完全类型，不完全类型的使用场景有限，但是可以定义这种类类型的指针或者引用，也可以声明(**注意不能定义**)以不完全类型作为参数或者返回类型的函数。在创建一个类对象前必须保证类已经被定义，而不仅仅是声明，否则编译器不能知道该对象需要多少存储空间。

### 7.3.4 友元再探

类的友元可以是函数也可以是其他类，如果是其他类，那么其他类的所有的成员函数都可以访问这个类的所有成员。每个类负责控制自己的友元类或者友元函数，友元关系不存在传递性。

除了将整个类声明为某个类的友元外，还可以将类的某个成员函数声明为类的友元。当把一个成员函数声明为友元时，必须明确指出该成员属于哪个类。

```cpp
class Screen {
  friend void Window_mgr::clear(ScreenIndex);
};
```

如果要让某个成员函数作为友元，需要仔细组织程序的结构以满足声明和定义彼此之间的依赖关系。在上面这个示例中需要按照下面的方式组织结构：

- 首先定义类的友元类，在友元类中声明 _clear_ 函数，但是不能定义它
- 然后定义 _Screen_ 类
- 最后定义 _clear_ 函数

如果要将一组重载函数声明为类的友元，则需要将所有重载函数都声明为类的友元。

相同类的各个对象互为友元关系，这意味着在成员函数中可以访问到同一个类的其他对象中的私有成员。

```cpp
class A {
    public:
    bool compare(const A &a) {
        return i_ < a.i_; // 访问对象a中的i_
    }
    void set(int i) {
        i_ = i;
    }
    private:
    int i_;
};
int main() {
    A a1,a2;
    a1.set(10);
    a2.set(15);
    std::cout << a1.compare(a2) << std::endl;
    return 0;
}
```

## 7.4 类的作用域

类具有作用域，在作用域外，普通的数据和函数成员只能由对象、引用或者指针使用成员访问运算符访问，对于类类型成员则使用作用域运算符访问。

类成员的名字查找通常首先在最近的作用域中查找，如果没找到则继续在外层作用域中查找，如果最终都未找到匹配的声明，则程序报错。

类的定义分两步处理，首先编译成员的声明，直到类全部可见后才编译函数体。

```cpp
string bal;

class Account {
  public:
    // 根据类定义的处理过程以及名字查找的优先级
    // 函数体内部返回的 bal 是类中的私有成员，而非类外定义的对象
    double balance() { return bal; }
  private:
    double bal;
};
```

通常内层作用域可以重新定义外层作用域中的名字，但是在类中，如果外层作用域中使用的某个名字代表一种类型，那么在类中就不能重新定义该名字。

## 7.5 构造函数再探

### 7.5.1 构造函数初始值列表

类可以使用构造函数初始值列表，如果没有在构造函数的初始值列表中显式的初始化成员，那么该成员在构造函数体之前执行默认初始化。而如果成员是 _const_ 或者是引用的话，则必须将其初始化。如果成员是某种类类型且该类没有定义默认构造函数时，那么也必须初始化该成员。

当构造函数的函数体开始执行时，初始化过程就完成了，初始化常量或者引用数据成员的唯一机会是通过构造函数初始值。

初始化和赋值在底层效率上稍有不同，初始化直接初始化数据成员，而赋值则是先初始化然后赋值。构造函数的初始值列表只是说明初始化成员的值，初始值列表并没有限定初始化的具体执行顺序，成员的初始化顺序与它们在类定义时出现的顺序一致。

#### 7.5.2 委托构造函数

C++11 可以定义委托构造函数，一个委托构造函数使用它所属于的类的其他构造函数执行初始化过程。换言之，一个构造函数将它的一些或者全部职责委托给了同一个类中的其他构造函数。当一个构造函数的职责委托给另外一个构造函数时，受委托的构造函数的初始值列表和函数体被依次执行。

```cpp
class A {
  public:
    A(int i = 0, int j = 0,string s = "") {}
    A(int i) : A(i) {}
    A(int i, int j) : A(i,j) {}
    A(string s) : A(0,0,s) {}
};
```

### 7.5.3 默认构造函数的作用

当对象被默认初始化或者值初始化时会自动执行默认构造函数。

默认初始化的发生情况：

- 在块作用域中不使用任何初始值定义非静态变量或者数组时
- 当一个类本身含有其他类类型的成员且使用合成的默认构造函数时
- 当类的成员没有在构造函数初始值列表中显式地初始化时

值初始化发生的情况：

- 在数组初始化过程中提供的初始值数量少于数组个数时
- 不使用初始值定义一个局部静态变量时
- 在定义时使用带括号的表达式，如 _T( )_ 。

### 7.5.4 隐式的类类型转换

如果构造函数只接受**一个**实参，那么该类实际定义了一个隐式转换机制，允许将实参类型转换为该类类型，这种构造函数称为**“转换构造函数”**。

编译器只会 **自动** 执行一步类型转换，如果表达式中需要进行两步以上的类型转换，那么则该表达式是错误的。

```cpp
class A {
  public:
    A() = default;
    A(string s) : s_(s) {}
    void Print(const A &a) {
        std::cout << a.s_ << std::endl;
    }
  private:
    string s_;
};

string s = "hello world";

A a;
// string类型转换为A类类型
a.Print(s);
// 显式的将字符串字面值常量转换为string类型，然后string类型隐式转换为A类类型
a.Print(string("hello world"));
// 字符串字面值常量隐式转换成string类型
a.Print(A("hello world"));
// 错误的转换，字面值字符串常量需要先隐式转换成string类型，然后再隐式转换为A类类型
// a.Print("hello world");
```

隐式类类型转换有时候并不是我们想要的，这时候可以使用关键字 _explicit_ 将类中某个**单一实参的构造函数**声明为显式的。只能在类中声明构造函数时使用 _explicit_ 关键字，而使用 _explicit_ 声明的构造函数只能用于直接初始化，不能用在拷贝初始化中。

### 7.5.5 聚合类

聚合类的定义：

- 所有成员都是 _public_
- 没有定义任何构造函数
- 没有类内初始值
- 没有基类，也没有虚函数

聚合类可以提供花括号括起来的成员初始值列表，初始值的顺序必须与声明的顺序一致，而且如果初始值列表中的元素个数少于类的成员数量，那么不足的成员执行值初始化，初始值列表的元素个数绝对不能操作类的成员数量。

### 7.5.6 字面值常量类

数据成员都是字面值类型的聚合类是字面值常量类，如果类不是聚合类，但是满足下面要求仍然是字面值常量类：

- 数据成员都是字面值类型
- 类必须至少包含一个 _constexpr_ 构造函数
- 如果一个数据成员含有类内初始值，则内置类型成员的初始值必须是常量表达式，如果成员是某种类类型，则初始值必须使用成员自己的 _constexpr_ 构造函数
- 类必须使用析构函数的默认定义

构造函数不能是 _const_ 的，但是字面值常量类的构造函数可以是 _constexpr_ 函数，实际上，一个字面值常量类必须至少提供一个 _constexpr_ 的构造函数。_constexpr_ 可以声明为 `=default` 或者 `=delete` 。

_constexpr_ 构造函数必须初始化所有数据成员，初始值要么使用 _constexpr_ 构造函数，要么是一条常量表达式。

_constexpr_ 构造函数用于生成 _constexpr_ 对象、_constexpr_ 函数的参数或返回类型。

## 7.6 类的静态成员

在成员的声明之前加上 _static_ 关键字可以让成员称为静态成员，它可以是公有的或者私有的，静态成员的类型可以是常量、引用、指针及其他类类型等。类的静态成员存在任何对象之外，静态的成员函数也不与任何对象绑定在一起，它不包含 _this_ 指针，因此静态的成员函数不能是常成员函数。

可以使用类的对象、引用或者指针访问静态成员，除此之外还可以使用作用域运算符访问静态成员，而成员函数则可以直接使用静态成员。

静态成员的声明只能出现在类内部，但是可以在类内部或者外部进行定义，在外部定义时不能包含 _static_ 关键字。由于静态的数据成员不属于类的对象，所以在初始化时不能在类内部，必须在外部定义和初始化每个静态成员，而且只能被定义一次。

可以为 _constexpr_ 类型的静态成员提供 _const_ 整数类型的类内初始值，初始值必须是常量表达式。而如果在类的内部提供了类内初始值，通常也需要在类的外部定义一下这个成员，但是定义时不能再提供初始值。

静态成员可以是不完全类型，即可以创建属于当前类类型的静态数据成员，而非静态的成员则只能定义指针或者引用。静态成员和非静态成员的另一区别就是可以使用静态成员作为默认实参，而非静态的数据成员则不能作为默认实参。

以上简单总结如下：

类的静态成员包括静态成员变量和静态成员函数。类的静态成员为类的所有对象共享，访问方式通常包含两种：

1. 通过对象访问
2. 通过类名访问

类的静态成员包含有以下特性：

- 类的静态成员变量需要类内声明，类外定义；
- 类的静态成员函数没有 _this_ 指针；
- 类的静态成员函数内部只能访问类的静态成员变量。

```cpp
#include<iostream>
using namespace std;

class A {
    private:
    int m_age{99}; // 非静态成员变量
    static int m_num; // 静态成员变量类内声明
    public:
    // 静态成员函数只能访问静态成员变量
    static void show() {
            cout << m_num << endl;
        }
};

int A::m_num = 10; // 静态成员变量的类外定义

int main() {
    A a;
    a.show(); // 通过类对象访问静态成员函数
    A::show(); // 通过类名访问静态成员函数
    return 0;
}
```
