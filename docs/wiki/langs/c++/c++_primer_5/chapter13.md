---
title: 13. 拷贝控制
order: 13
category:
  - C++
tag:
  - 拷贝控制
  - 资源管理
  - 右值引用
  - 移动语义
  - 动态内存管理
article: false
date: 2017-09-25
---

一个类通过一系列操作 (构造函数、拷贝构造函数、拷贝赋值运算符、移动构造函数、移动赋值运算符、析构函数) 来控制类对象的构造、拷贝、移动、赋值和销毁时的行为。

## 13.1 拷贝、赋值与销毁

### 13.1.1 拷贝构造函数

拷贝构造函数的第一个参数是自身类类型的引用，且任何额外的参数都有默认值。通常拷贝构造函数的引用类型为 _const_ 类型，由于拷贝构造函数在很多情况下都会被隐式使用，因此不应声明为 _explicit_。

如果没有为一个类定义拷贝构造函数，那么编译器将会定义一个默认版本的拷贝构造函数。合成的拷贝构造函数会将从给定对象中依次将每个非静态的成员拷贝到正在创建的对象中，每个成员的类型决定了它被如何拷贝，例如类类型的成员，会调用类的拷贝构造函数来拷贝，内置类型的成员直接拷贝，数组类型会被逐元素的拷贝到目标数组中。

```cpp

class Foo {
public:
  Foo (const Foo &); // 拷贝构造函数声明
private:
  int m_int;
  string m_msg;
  static vector<int> m_vec;
};

Foo::Foo(const Foo &foo) : m_msg(foo.m_msg), m_int(foo.m_int) {}
```

类的初始化分为直接初始化和拷贝初始化，直接初始化是利用函数匹配的原则找到最佳匹配的构造函数进行初始化，而拷贝初始化则是通过类的拷贝构造函数或者移动构造函数完成初始化。

拷贝初始化不仅仅在使用 "=" ==定义变量时==发生，在下面情况下也会发生：

- 将一个对象作为实参传递给一个非引用类型的形参
- 从一个返回类型为非引用类型的函数中返回一个对象
- 使用花括号列表初始化一个数组中的元素或者一个聚合类的成员
- 容器内的元素如果是类类型，容器被拷贝时也将对容器内的元素进行拷贝初始化

:::warning

从拷贝初始化的发生情况可以知道为什么拷贝构造函数的参数必须是引用类型，这是由于如果不是引用类型，将一个类对象传递给一个非引用类型的形参时会发生拷贝初始化，而再次进行拷贝初始化依然会调用拷贝构造函数，由此形成了无限的递归操作。

:::

### 13.1.2 拷贝赋值运算符

拷贝赋值运算符本质上是函数重载，其为二元操作符，包含左右两个运算对象。内置类型的赋值运算符的结果是其左侧运算对象，并且结果为一个左值，为了与内置类型的赋值运算符的行为保持一致，类的拷贝赋值运算符通常返回一个指向其左侧运算对象的引用。

与拷贝构造函数类似，如果一个类没有定义自己的拷贝赋值运算符，那么编译器将为类生成一个合成的拷贝赋值运算符，它将右侧运算对象的每个非静态成员拷贝到左侧对象的对应成员。

```cpp
class Foo {
public:
  Foo &operator=(const Foo &rhs);

private:
  int m_int;
  string m_msg;
};

Foo &Foo::operator=(const Foo &rhs) {
  if (this != &rhs) {
    m_int = rhs.m_int;
    m_msg = rhs.m_msg;
  }
  return *this;
}
```

很多时候可能会将拷贝赋值运算符操作和拷贝构造函数操作弄混，例如 `string msg = "hello world";` 和 `msg = "hello world";` 这两个语句，第一个语句是隐式调用拷贝构造函数，第二个语句是拷贝赋值运算符。事实上，拷贝构造函数是构造对象时使用的，而拷贝赋值运算符的左侧运算对象通常已经构造完成。

:::warning

拷贝赋值运算符需要注意对象的自赋值的情况。

:::

### 13.1.3 析构函数

析构函数由 "~" 接类名称组成，没有返回值，也不接受任何参数，无法重载，一个类有且仅有一个析构函数。同样的，如果没有定义析构函数，则编译器为类生成一个合成的析构函数。

类对象被销毁就会调用析构函数。析构函数的作用与构造函数相反：

- 构造函数会初始化对象的非静态成员并进行一些额外的资源分配等，成员的初始化是在构造函数体执行之前完成的，且按照它们在类中出现的顺序进行初始化。
- 在析构函数中，首先会执行析构函数体的语句，然后销毁对象在生存期分配的所有资源，也包括销毁对象的非静态成员，成员按初始化的顺序逆序销毁。

我们可以在构造时指定用什么东西去初始化成员，而析构是隐式的，我们不能控制成员的销毁过程，成员销毁的方式取决于成员自身的类型。==当成员类型为内置指针类型时，销毁该成员并不会 delete 它所指向的对象。==

```cpp
class Foo {
public:
  ~Foo();

private:
  int m_int;
  string m_msg;
};

Foo::~Foo() {}
```

### 13.1.4 三/五法则

C++ 中可以只定义类的拷贝控制中的一个或两个等操作，但是通常情况下拷贝控制的各个操作应该被看作一个整体，在实际使用中通常有两个重要的准则；

- 需要自定义析构函数的类几乎也会需要自定义拷贝构造函数和自定义的拷贝赋值运算符操作
- 需要自定义拷贝构造函数的类，几乎也会需要自定义的拷贝赋值运算符，反之亦然

```cpp
#include <iostream>

using namespace std;

// 使用编译器合成版本的拷贝构造函数和拷贝赋值运算符
class Foo {
public:
  Foo();
  ~Foo();
  void print_address();

private:
  int *m_pdata;
};

Foo::Foo() { m_pdata = new int; }
Foo::~Foo() {
  cout << "deconstructor" << endl;
  delete m_pdata;
}
void Foo::print_address() { cout << m_pdata << endl; }


int main(int argc, char **argv) {

  Foo foo1;

  foo1.print_address();

  {
    Foo foo2 = foo1;
    foo2.print_address();
  } // foo2 离开作用域就会销毁 m_pdata 指向的对象

  foo1.print_address();

  return 0;
} // 程序执行结束，会第二次释放已经被释放的内存空间
```

### 13.1.5 使用 =default

`=default` <Badge text="C++11" type="info" /> 可以显式的要求编译器生成默认的拷贝控制的版本，默认情况下显式声明的合成拷贝控制版本为内联函数，如果要修改此行为只能在类的外部使用 `=default`。

### 13.1.6 阻止拷贝

在有些情况下我们希望定义的类对象不能被拷贝等，此时需要使用某种机制来实现这种需求，在早期的 C++ 版本中可以将拷贝控制的操作声明为 private 成员，并且不对其进行定义就能预先阻止类对象被拷贝。而 C++ 11 引入了 "删除的函数" 来阻止拷贝，即 `=delete` <Badge text="C++11" type="info" />。声明了删除的函数不能以任何方式使用它们。

`=delete` 必须出现在函数第一次声明的时候，可以作用于任何函数。删除的函数通常用来阻止拷贝控制，也可以用于控制函数的匹配过程。尽管 `=delete` 可以作用于任何函数，但是**类的析构函数不能是删除的函数，否者类对象将无法正常销毁对象，编译器也不会允许定义这种类的对象和临时变量**。同样的，如果类的某个成员的析构函数被定义为删除的函数，那么这个类的对象也将无法被正常销毁。

合成的拷贝控制成员也可能是删除的，例如对于具有引用成员的类，其拷贝赋值运算符就被定义为删除的，这是由于引用绑定到一个对象就不能被改变，给引用赋值实际是给引用对象赋值，因此拷贝赋值运算符的行为看起来并不是我们所期望的。

:::tip

本质上，如果一个类有数据成员不能默认构造、拷贝、复制或销毁，那么对应合成版本的成员函数就会被定义为被删除的函数。

:::

:::tabs
@tab =delete 阻止拷贝

```cpp{5,6}
class Foo {
public:
  Foo() = default;
  ~Foo() = default;
  Foo(const Foo &) = delete;
  Foo &operator=(const Foo &) = delete;
};
```

@tab private 阻止拷贝

```cpp{7-9}
class Foo {
public:
  Foo() = default;
  ~Foo() = default;

// 私有化是为了阻止友元和成员函数对其进行拷贝
private:
  Foo(const Foo &);           // 只声明不定义
  Foo &operator=(const Foo &);// 只声明不定义
};
// 只声明不定义保证了类对象被拷贝时将在编译阶段被标记为错误，
// 而私有化则保证在成员函数内部或者友元函数中的拷贝将导致链接错误。
```

:::

## 13.2 拷贝控制和资源管理

管理类外资源的类必须定义拷贝控制成员，一般来说，定义的拷贝控制成员有有两种语义上的区分：

- 使类的行为看起来像一个值，表明其有自己独立的状态，拷贝时副本和原对象完全独立。
- 使类的行为看起来像一个指针，表明其共享状态，拷贝时副本和原对象共享底层的数据。

> 通常，如何拷贝类中的指针成员决定了该类的行为是类值行为还是类指针的行为。

### 13.2.1 定义行为像值的类

为了提供类值行为，每个对象都应该拥有一份自己成员的拷贝。

```cpp
class Foo {
public:
  Foo();
  ~Foo();
  Foo(const Foo &);
  Foo &operator=(const Foo &);

private:
  int m_int;
  string *m_string;
};

Foo::Foo() : m_string(new string()) {}
Foo::~Foo() { delete m_string; }
Foo::Foo(const Foo &rhs) : m_int(rhs.m_int), m_string(new string(*rhs.m_string)) {}
Foo &Foo::operator=(const Foo &rhs) {
  auto temp = new string(*rhs.m_string);// 先创建临时对象，保证自赋值情况下也能正常运行
  delete m_string;                      // 销毁以前的指针指向的对象
  m_int = rhs.m_int;
  m_string = temp;// 拷贝临时对象
  return *this;   // 返回对象自身
}
```

:::tip

实现类值行为的拷贝赋值运算符时，需要额外注意自赋值情况，为了保证拷贝赋值运算符的正确性，建议：

- 先将右侧运算对象的成员拷贝到临时的局部对象中
- 拷贝完成后销毁左侧运算对象
- 左侧运算对象销毁完成就可以将临时的局部对象拷贝到左侧运算对象的成员

:::

### 13.2.2 定义行为像指针的类

行为类似于指针的类也需要自定义的析构函数来释放对应的资源，只不过只能在最后一个指针对象被销毁的时候才会真正的释放资源。shared_ptr 就是一种行为像指针的类，它通过引用计数来决定是否销毁指向的对象。引用计数的工作方式大致如下：

- 构造对象时，创建引用计数并且将计数值初始化为 1
- 拷贝构造时不分配新的计数器，它只递增被拷贝对象的计数器
- 析构函数中递减计数器，如果计数为 0 则销毁指向的对象
- 拷贝赋值运算符递增右侧运算对象的计数器，递减左侧运算对象的计数器

由于引用计数在多个对象之间共享，其必定只能存在动态分配的内存中，即堆中。

:::details 模拟智能指针

```cpp
#include <iostream>
#include <string>

using namespace std;

class SharedPtr {
public:
  SharedPtr();
  SharedPtr(const char *);
  SharedPtr(const SharedPtr &);
  ~SharedPtr();
  SharedPtr &operator=(const SharedPtr &);
  size_t use_count() const;

private:
  string *m_msg;
  mutable size_t *m_useCount;
};

SharedPtr::SharedPtr() : m_msg(new string("")),
                         m_useCount(new size_t{1}) {}
SharedPtr::SharedPtr(const char *msg) : m_msg(new string(msg)),
                                        m_useCount(new size_t{1}) {}
SharedPtr::SharedPtr(const SharedPtr &rhs) : m_msg(rhs.m_msg),
                                             m_useCount(rhs.m_useCount) {
  ++*m_useCount;
}
SharedPtr::~SharedPtr() {
  if (--*m_useCount == 0) {
    delete m_msg;
    delete m_useCount;
  }
}

SharedPtr &SharedPtr::operator=(const SharedPtr &rhs) {
  ++*rhs.m_useCount;
  if (--*m_useCount == 0) {
    delete m_msg;
    delete m_useCount;
  }
  m_msg = rhs.m_msg;
  m_useCount = rhs.m_useCount;
  return *this;
}

size_t SharedPtr::use_count() const { return *m_useCount; }

int main(int argc, char **argv) {

  SharedPtr sp("hello world");
  {
    SharedPtr sp2(sp);
    {
      SharedPtr sp3;
      sp3 = sp2;
      cout << sp.use_count() << " "
           << sp2.use_count() << " "
           << sp3.use_count() << endl;
    }
    cout << sp.use_count() << " " << sp2.use_count() << endl;
  }
  cout << sp.use_count() << endl;

  return 0;
}
```

:::

## 13.3 交换操作

管理资源的类通常会通过定义 "swap" 操作在直接交换类的成员以避免不必要的内存分配。

:::tabs

@tab 普通的交换

```cpp

// 类 Foo 的组成如下：
class Foo {
private:
  string *m_msg;
  int m_num;
};


// ----------------------------------------
// 假设交换类 Foo 的 foo1, 和 foo2

Foo temp = foo1; // 经历一次拷贝构造
foo1 = foo2; // 经历一次拷贝赋值
foo2 = temp; // 经历一次拷贝赋值

```

@tab swap 交换

```cpp
// 类 Foo 的组成如下：
class Foo {
 friend void swap(Foo &lhs, Foo &rhs);
private:
  string *m_msg;
  int m_num;
};

// 定义 swap 操作
void swap(Foo &lhs, Foo &rhs) {
  using std::swap; // swap 的名字查找优先成员内，然后类内最后才是类外
  swap(lhs.m_msg, rhs.m_msg);
  swap(lhs.m_num, rhs.m_num);
}

// ----------------------------------------
// 假设交换类 Foo 的 foo1, 和 foo2

swap(foo1, foo2);
```

:::

:::tip

定义了 "swap" 操作的类在定义它们的赋值运算符时可以通过该操作进行优化，这种优化技术被称为 **拷贝并交换 (copy and swap)**。

```cpp
// 注意参数为值传递，拷贝右侧运算对象就避免了自赋值的情况
Foo& Foo::operator=(Foo rhs) {
  swap(*this, rhs);
  return *this;
}

```

:::

## 13.4 拷贝控制示例

略

## 13.5 动态内存管理类

某些类需要在运行时分配可变大小的内存空间，这种情况下通常使用 _vector_ 来管理元素，但是某些类需要自己进行内存分配时则需要定义自己的拷贝控制成员来管理分配的内存。

标准库引入了 "移动构造函数"<Badge text="C++11" type="info" /> 和 "移动赋值运算符"<Badge text="C++11" type="info" /> 这两个操作来直接 "**移动**" 资源而不是拷贝它们，效率更高。在 utility 头文件中定义了一个 "move" 操作可以显式的移动资源，由于 move 这个词容易跟其他库的同名操作冲突，因此实际使用建议加上命名空间作为限定，即使用 "std::move"。

:::details 模拟存放 string 的 vector

```cpp

#include <iostream>
#include <memory>
#include <string>

using namespace std;

class StrVector {
  friend ostream &operator<<(ostream &os, const StrVector &rhs) {
    for (string *begin = rhs.m_begin; begin != rhs.m_end; ++begin)
      os << *begin << " ";
    return os;
  }

private:
  string *m_end{nullptr};
  string *m_begin{nullptr};
  string *m_cap{nullptr};
  allocator<string> m_alloc;

public:
  StrVector() = default;

  StrVector(const StrVector &rhs) {
    alloc_copy(rhs);
  }

  StrVector &operator=(const StrVector &rhs) {
    if (this != &rhs) {
      free();         // 先释放
      alloc_copy(rhs);// 后拷贝
    }
    return *this;
  }

  ~StrVector() {
    free();
  }

  void push_back(const string &str) {
    check_cap_realloc();
    m_alloc.construct(m_end++, str);
  }

  size_t size() const { return distance(m_begin, m_end); }

  size_t capacity() const { return distance(m_begin, m_cap); }

private:
  void free() {
    if (m_begin) {
      for (string *dest = m_end; dest != m_begin;) m_alloc.destroy(--dest);
      m_alloc.deallocate(m_begin, capacity());
    }
  }

  void realloc() {
    size_t newCapacity = size() ? size() * 2 : 1;
    string *newData = m_alloc.allocate(newCapacity);
    string *dest = newData;
    string *begin = m_begin;
    // 通过 std::move 移动元素
    while (begin != m_end) m_alloc.construct(dest++, std::move(*begin++));
    free();
    m_begin = newData;
    m_end = dest;
    m_cap = newData + newCapacity;
  }

  void alloc_copy(const StrVector &rhs) {
    m_begin = m_alloc.allocate(rhs.size());
    m_cap = m_end = uninitialized_copy_n(rhs.m_begin, rhs.size(), m_begin);
  }

  void check_cap_realloc() {
    if (size() == capacity()) realloc();
  }
};


int main(int argc, char **argv) {
  StrVector sv;
  sv.push_back("hello");
  sv.push_back("world");
  sv.push_back("!");
  sv.push_back("today");
  sv.push_back("is");
  sv.push_back("a");
  sv.push_back("day");
  sv.push_back(".");
  cout << "sv: " << sv << endl;

  StrVector sv2(sv);
  cout << "sv2: " << sv2 << endl;

  StrVector sv3;
  sv2 = sv2;
  sv3 = sv2;
  cout << "sv3: " << sv3 << endl;
  return 0;
}
```

:::

## 13.6 对象移动

对象移动是 C++11 新增特性，它可以移动(而非拷贝)对象。对象移动要解决的问题主要有三个方面：

1. 某些情况下对象被拷贝后又立即销毁了，如果拷贝对象较大或者对象本身就要求分配内存空间，拷贝代价会比较高
2. 某些对象不能被拷贝，例如 _IO_ 或 _unique_ptr_ 对象，这些对象都包含了不能被共享的资源，只能被移动
3. 在旧版本中，容器中的对象必须是可以被拷贝的，在新标准中，容器可以保存不可拷贝的对象类型

> 标准库容器、string 类和 shared_ptr 类既支持拷贝也支持移动，IO 类和 unique_ptr 类可以移动但不能被拷贝。

### 13.6.1 右值引用

- **_==左值引用==_**：必须绑定到左值的上的引用，"**不可以**" 绑定到需要转换的表达式(显示转换或者隐式转换)、字面值常量、返回右值的表达式，通过`&`来定义一个左值引用；

- **_==右值引用==_**：必须绑定到右值的上的引用，"**可以**" 绑定到需要转换的表达式、字面值常量、返回右值的表达式，通过`&&`来定义一个右值引用；而且右值引用只能绑定到一个将要销毁的对象上，并且不能将一个右值直接绑定到左值上。

**返回左值的情况**：

- 返回左值引用的函数
- 赋值运算
- 下标运算
- 解引用运算
- 前置递增/递减运算

**返回右值的情况**：

- 返回非引用类型的函数
- 算术运算
- 关系运算
- 位运算
- 后置递增/递减运算

左值有持久的状态，而右值通常要么是字面常量，要么是在表达式求值过程中创建的临时对象。

```cpp
int i = 42;

// 正确,i是左值，r是对i的左值引用
int &r = i;

// 错误,i是左值，不能将一个右值引用绑定到左值上
int &&rr = i;

// 错误，i * 42是需要转换的表达式，表达式的结果是一个右值，不能绑定一个左值引用到一个右值上
int &r2 = i * 42;

// 正确，对常量的引用可以绑定到一个右值上,
// 非常量的引用不能绑定到右值上的原因是因为可以通过非常量的引用修改引用对象的值，
// 而右值不能被修改，除非右值是class类型对象，因此可以将常量的左值引用绑定到一个右值上
const int &r3 = i * 42;

// 正确，i * 42的结果是右值，可以将右值引用绑定到计算结果上
int &&rr1 = i * 42;

// 正确 42是一个字面值常量，可以将右值引用绑定到42上
int &&rr2 = 42;

// 错误，右值引用本身就是变量，而变量都是左值，不能将右值引用绑定到左值上
int &&rr3 = rr2;
```

:::warning

变量都是左值，不能将右值引用绑定到一个变量上，特别需要注意的是右值引用本身也是一个变量。

:::

==_使用标准库的 "std::move" 函数可以将一个左值显式的转换为对应的右值引用，其位于 utility 头文件中_==

> `int &&rr3 = std::move(rr2);` // 正确，rr2 是对字面值常量 42 的右值引用，本身是个变量，是左值
> std::move 告诉编译器，有一个左值，但是期望像一个右值一样处理它。那么这就意味着移动后的源对象 rr2 除了赋值或销毁外，不能再用作别的用途。换言之，rr2 之前的值不能再使用了，但是可以赋予新的值或者销毁。

### 13.6.2 移动构造函数和移动赋值运算符

与拷贝构造函数类似，移动构造函数 <Badge text="C++11" type="info" /> 的第一个参数是该 _class_ 类型的一个引用，任何额外的参数都必须有默认实参。

与拷贝构造函数不同的是，移动构造函数的第一个是参数是右值引用，而拷贝构造函数的第一个参数是左值引用。

此外，移动构造函数不会分配任何新内存，它直接接管内存资源，==**_因此通常不会抛出任何异常，这就意味着移动构造函数通常会被声明为 noexcept_**==。_noexcept_ <Badge text="C++11" type="info" /> 用以声明一个函数不抛出任何异常的一种方式，位于函数的参数列表之后，该关键字**必须在声明和定义时同时指定**。

```cpp
class StrVec{
  public:
    // 移动构造函数
    StrVec(StrVec &&rsv) noexcept;
    // 移动赋值运算符
    StrVec & operator=(StrVec &&rsv) noexcept;
};

StrVec::StrVec(StrVec &&rsv) noexcept {
    // 移动构造函数体
}
```

指出一个移动构造函数不抛出异常的原因是两个相互关联的事实：

- 移动操作通常不抛出任何异常，但是允许抛出异常
- 标准库容器能对异常发生时的自身行为提供保障。
  > _例如 vector 保证，如果调用 push_back 时出现异常，vector 自身不会发生改变。根据 vector 内部实现，push_back 会检查是否有足够的空间存放新的元素，如果没有空间就会重新分配内存空间。如果重新分配内存的过程中使用了移动构造函数，假设在移动了部分元素(而不是全部元素)后发生异常，那么就会导致源对象发生改变，而新的空间元素不完整，这就不能保证 vector 自身保持不变了。而如果重新分配内存的过程中使用了拷贝构造函数，在复制过程中出现异常，vector 源仍然能够保持不变。基于此，vector 在不清楚元素的移动是否会抛出异常的情况下都是使用的是拷贝构造函数，而不是移动构造函数，但是如果我们显示声明了 vector 在移动元素不会发生异常，那么就可以使用移动构造函数。_

_noexcept_ 声明只是显式的告诉编译器，该函数不抛出任何异常，别的函数或类可以放心使用。

移动赋值运算符执行与析构函数和移动构造函数相同的工作。

移动赋值也必须处理自赋值的情况，是因为移动赋值运算符的右侧运算对象可能是通过 "std::move" 返回的结果，不能在使用右侧运算对象之前就释放左侧运算对象的资源，因为这可能是相同的资源。

> 只有在一个类没有定义自己的任何版本的拷贝控制成员(构造函数、拷贝构造函数或者析构函数等)，并且类的每个非 _static_ 成员都可以移动时，编译器才会为这个类合成移动构造函数和移动赋值运算符。如果一个类没有移动操作，通过正常的函数匹配，类会使用对应的拷贝构造函数代替移动操作。

**与拷贝操作不同，移动操作永远不会被隐式定义为删除的函数。** 但是，如果我们要求编译器生成 _=default_ 的移动操作，且编译器不能移动所有成员，则编译器会将移动操作定义为删除的函数。移动操作定义为删除的函数遵循以下原则：

- 与拷贝构造函数不同，如果有类的成员定义了自己的拷贝构造函数且未定义移动构造函数或者有类成员未定义自己的拷贝构造函数且编译器不能为其合成移动构造函数
- 如果有类的成员的移动构造函数或移动赋值运算符被定义为删除的或者是不可访问的
- 类似拷贝构造函数，如果有类的析构函数被定义为删除的或者是不可访问的
- 类似拷贝赋值运算符，如果有类的成员是 _const_ 的或是引用

> 如果类定义了一个移动构造函数或一个移动赋值运算符，则必须定义自己的拷贝构造函数和拷贝赋值运算符，否则这些合成的拷贝构造函数和合成的拷贝赋值运算符被定义为删除的。

如果一个类同时定义了拷贝构造函数和移动构造函数，那么如果初始化时的对象是左值则调用拷贝构造函数，而右值则根据函数匹配的原则优先使用移动构造函数。如果一个类只定义了拷贝构造函数，没有定义移动构造函数，那么编译器也不会生成合成的移动构造函数，此时无论初始化对象是左值还是右值都会调用拷贝构造函数。

C++11 的标准库中定义了一种 "**移动迭代器**<Badge text="C++11" type="info" />" 适配器，通过改变被传递的迭代器的解引用运算符的行为适配不同的移动迭代器。通常来说，普通迭代器的解引用操作返回一个左值，而移动迭代器则返回一个右值引用。在标准库中，可以通过 "make_move_iterator" 函数将一个普通迭代器转换为一个移动迭代器。

### 13.6.3 右值引用和成员函数

移动/拷贝的成员函数具有与移动/拷贝构造函数类似的参数模板，一个版本的参数类型为 _const_ 的左值引用，另一个版本参数类型为非 _const_ 的右值引用。

```cpp
// 拷贝
void push_back(const X &);
// 移动
void push_back(X &&);

// 当调用push_back时，实参类型决定了新元素是被拷贝还是移动
std::vector<std::string> vec;
std::string s = "hello";
// s是一个string对象，是个左值，调用拷贝是精确匹配
vec.push_back(s);
// 首先创建一个string的临时对象，然后把临时对象添加到容器中
// 这个过程其实是个隐式转换的过程，
// 左值引用不能绑定到需要转换的表达式、字面值常量或者返回右值的表达式上
// 而右值引用的绑定特性与左值引用完全相反，因此调用移动是精确匹配。
vec.push_back("done");
```

通常，我们在对一个对象上调用成员函数时，不会关注该对象是一个左值还是右值。甚至有的时候我们可能会向一个右值进行赋值操作，C++11 标准库为了防止这种问题，可以在赋值运算符后添加一个 "**引用限定符**"。

**引用限定符可以是左值引用符号，表明限制该成员函数只能用于左值；也可以是右值引用符号，表明限制该成员函数只能用于右值。**

与类的 _const_ 成员函数限定符类似，引用限定符只能用于非 _static_ 的成员函数，且**必须同时出现在声明和定义中**。一个函数也可以同时使用 _const_ 和引用限定符，但是**引用限定符必须跟在 _const_ 限定符之后**。

==引用限定符可以区分函数重载==，因此可以结合 _const_ 限定符和引用限定符区分不同的函数重载，但是与 _const_ 不同的是，如果类中定义了两个及以上的 "相同名字" 及 "参数列表" 的函数重载，则必需对所有重载函数都加上引用限定符或者都不加。

```cpp
class Foo{
  public:
    // 成员函数只能用于左值，即左侧运算对象是左值，注意const必须位于&之前
    Foo & operator=(const Foo &) const &;
    // 成员函数只能用于右值，即左侧运算对象是右值，注意const必须位于&&之前
    Foo & operator=(Foo &&) const &&;

    // 成员函数只能用于左值，即左侧运算对象是左值，
    Foo sorted() &;
    Foo sorted() const &;

    // 成员函数只能用于右值，即左侧运算对象是右值，
    Foo sorted() &&;
    Foo sorted() const &&;
};
```

> 注意对于左值通常是拷贝，而右值通常是移动。
