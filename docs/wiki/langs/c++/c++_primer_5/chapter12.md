---
title: 12. 动态内存
order: 12
category:
  - C++
tag:
  - 动态内存
  - 智能指针
  - 动态数组
article: false
date: 2017-09-22
---

## 12.1 动态内存与智能指针

在 C++ 中，动态内存的管理通过 _new_ 和 _delete_ 运算符实现，由于动态内存的管理容易出错，C++ 11 以后标准库的 memory 头文件中提供了两种智能指针 <Badge text="C++11" type="info" />。

- **shared_ptr**：允许多个智能指针指向同一个对象
- **unique_ptr**：只允许一个智能指针指向同一个对象

同时，为了监控智能指针的状态引入了 **weak_ptr**，它是一种弱引用，指向的是 shared_ptr 所管理的对象。

### 12.1.1 shared_ptr 类

智能指针属于模板类，使用时必须指明其指向的对象类型，默认初始化的智能指针保存着一个空指针，智能指针的使用方式与普通指针类似。

shared_ptr 允许多个指针共享同一个对象，它基于引用计数，每个 shared_ptr 都会记录有多个其他 shared_ptr 指向该对象。以下为常见的引用计数变化方式：

- 拷贝一个 shared_ptr 会递增被拷贝的 shared_ptr 的引用计数；
- shared_ptr 被赋予一个新的值或者其离开作用域时会递减引用计数。

==**shared_ptr 的析构函数会递减其所指向的对象的引用计数，一旦一个 shared_ptr 的引用计数变为 0，这个 shared_ptr 就会在其析构函数中销毁其所管理的对象，从而释放这个对象所占据的内存。**==

:::center

| 操作                                                        | 说明                                                                                 |
| :---------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| shared_ptr&lt;T&gt; sp <br> unique_ptr&lt;T&gt; up          | 创建一个空智能指针                                                                   |
| \*p                                                         | 解引用智能指针，得到其管理的对象                                                     |
| p->mem                                                      | 访问智能指针 p 的成员 mem                                                            |
| p.get()                                                     | 返回智能指针 p 中保存的对象的内置指针，<br> 返回的指针可能会指向一个已经被销毁的对象 |
| swap(p, q) <br> p.swap(q)                                   | 交换智能指针 q 和智能指针 q 的指针                                                   |
| make_shared&lt;T&gt;(args) <sub>(仅适用于 shared_ptr)</sub> | 使用 args ==构造==一个智能指针                                                       |
| shared_ptr&lt;T&gt; sp(sq) <sub>(仅适用于 shared_ptr)</sub> | 创建一个智能指针 sp，sp 是智能指针 sq 的拷贝，<br> 该操作递增 sq 的计数              |
| sp = sq <sub>(仅适用于 shared_ptr)</sub>                    | 将智能指针 sp 指向智能指针 sq，<br>该操作递增 sq 的计数，递减 sp 的计数              |
| sp.unique() <sub>(仅适用于 shared_ptr)</sub>                | sp 的计数为 1，则返回 true，否者返回 false                                           |
| sp.use_count() <sub>(仅适用于 shared_ptr)</sub>             | 返回 sp 共享的智能指针的数量，该操作很慢                                             |

:::

:::warning

由于 shared_ptr 基于引用计数来自动管理对象，所以在使用 shared_ptr 时需要额外注意引用计数的变化情况。以防止在某些不该递增引用计数的地方因为错误使用导致了引用计数的递增；同时，当某个对象不再被需要时，应该保证指向这个对象的 shared_ptr 可以正常递减引用计数，否者可能导致对象永远无法被销毁。以下几种是 shared_ptr 使用中的常见错误：

- 循环引用，例如 a 引用了 b, b 引用了 a, 最终导致 a 和 b 都不会被正常销毁
- 多次释放，例如 a 引用了一个对象，然后获取这个对象的原生指针，并将其交于另一个智能指针 b 进行管理，则 a, b 最终被释放时将会导致其指向的对象被释放两次
- 忘记删除容器中的 shared_ptr，如果容器中不再使用某个 shared_ptr 应该调用容器的 "erase" 操作删除，否者该 shared_ptr 管理的对象将不会被删除

:::

在程序中使用动态内存通常出于下面三个原因：

1. 程序不知道自己需要使用多少对象
2. 程序不知道所需对象的准确类型
3. 程序需要在多个对象之间共享数据

### 12.1.2 直接管理内存

_new_ 和 _delete_ 是用于直接管理内存的两个操作符，_new_ 负责分配内存，_delete_ 负责销毁由 _new_ 分配的内存空间。

_new_ 操作返回一个指向分配对象的指针，默认情况下，动态分配的对象执行默认初始化。我们可以在动态分配内存的时候执行初始化操作：

- `int *pi = new int;` ：执行默认初始化，其值未定义
- `int *pi = new int();` ：执行值初始化，其值为 0
- `int *pi = new int(1024);` ：使用构造方式进行初始化，其值为 1024
- `int *pi = new int{999};` ：使用列表进行初始化，其值为 999
- `auto pi = new auto(obj);` <Badge text="C++11" type="info" /> ：使用 _auto_ 自动推断，但括号内只能提供单一初始化对象
- `const *pi = new const int(1024);`：动态分配的 _const_ 对象，必须进行初始化
- `int *pi = new int[10];` ：动态分配包含 10 个 _int_ 类型的内存空间 (更多详见 [new 和数组](#_12-2-1-new-和数组))
- `int *pi = new int[10]();` ：动态分配包含 10 个 _int_ 类型的内存空间，执行值初始化 (更多详见 [new 和数组](#_12-2-1-new-和数组))
- `int *pi = new int[10]{1, 2, 3, 4};` ：动态分配包含 10 个 _int_ 类型的内存空间，执行列表初始化 (更多详见 [new 和数组](#_12-2-1-new-和数组))
- `int *pi = new int[0];` ：动态分配一个包含 0 个 _int_ 类型的内存空间，该操作是合法的，返回的指针可看做尾后指针，行为类似于尾后迭代器 (更多详见 [new 和数组](#_12-2-1-new-和数组))

"定位 new (placement new)" 允许给 _new_ 表达式传递额外的参数，而使用 _new_ 进行内存分配时可能由于内存被耗尽而抛出 bad<span>\_</span>alloc 异常，因此可以通过定位 _new_ 传递一个 nothrow 对象给 _new_ 以告知该 _new_ 操作不抛出异常，例如 `int *pi = new (nothrow) int;`，该表达式不会抛出异常，一旦分配失败，则返回的是空指针。

_delete_ 操作销毁给定的指针指向的对象，释放对应的内存空间。

- `delete pi;` ：销毁 pi 指向的动态分配的对象；
- `delete []pi;` ：销毁 pi 指向的动态分配的对象数组 (更多详见 [new 和数组](#_12-2-1-new-和数组))

:::danger

注意 _delete_ 表达式接受一个动态分配的对象指针或者一个空指针，释放一个并非 _new_ 分配的内存或者将相同的指针值释放多次的行为都是未定义的。虽然不能修改 _const_ 动态分配的对象，但是却可以通过 _delete_ 销毁这个动态分配的对象。

此外，由内置指针直接管理的动态内存在被显式 _delete_ 前会一直存在内存中。

:::

直接管理动态内存非常容易出错，常见的错误如下：

- 忘记调用 _delete_ 释放动态分配的内存，导致内存泄漏；
- _delete_ 一个指针后，该指针就变成了空悬指针，此时如果继续使用已经释放掉的指针将会导致错误，通常在 _delete_ 后立即将指针置空可以避免这个错误；
- 两次释放同一块内存。

:::note

直接管理动态内存最大的问题是可能有多个指针指向相同的内存，在 _delete_ 某个指针后，还存在其他指针指向被释放的内存，而实际使用中查找这样的指针异常困难。

:::

### 12.1.3 shared_ptr 和 new 结合使用

通常，定义时如果不初始化智能指针，它将是一个空指针。我们可以使用 _new_ 返回的内置指针初始化智能指针，这些接受内置指针的构造函数都是显式的，这就意味着不能隐式的将内置指针转换为智能指针 (例如不能直接返回内置指针给智能指针等)，必须在创建时使用直接初始化形式来初始化一个智能指针。

默认情况下用于初始化智能指针的内置指针必须指向由 _new_ 动态分配的内存空间，这是由于智能指针的析构函数中默认使用 _delete_ 来释放其关联的对象。为了让智能指针可以绑定到一个不是由 _new_ 分配的内存上通常需要使用自定义的 "_delete_" 操作来替换内置的 _delete_ 操作。下面定义了智能指针的一些操作：

:::center

| 操作                                                         | 说明                                                                                                                                                             |
| :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shared_ptr&lt;T&gt; sp(new_q)                                | 使用内置指针 new_q 来初始化 shared_ptr sp                                                                                                                        |
| shared_ptr&lt;T&gt; sp(up)                                   | 使用 unique_ptr up 来初始化 shared_ptr sp，<br> 此操作会接管 up 所指向对象的所有权，并将 up 置空                                                                 |
| shared_ptr&lt;T&gt; sp(new_q, deleter)                       | 使用内置指针 new_q 来初始化 shared_ptr sp，<br> 同时使用 deleter 代替默认的 delete 操作                                                                          |
| shared_ptr&lt;T&gt; sp(sp2, deleter)                         | 使用 shared_ptr sp2 来初始化 shared_ptr sp，<br> 同时使用 deleter 代替默认的 delete 操作                                                                         |
| sp.reset() <br> sp.reset(new_q) <br>sp.reset(new_q, deleter) | 如果 sp 的引用计数为 1 ，则该操作会释放该对象。<br>如果传递了 new_q 则将其绑定到 sp，否者将 sp 置空，<br>如果还传递了自定义的 deleter 则会替换默认的 delete 操作 |

:::

```cpp
// 下面为几种常见创建 shared_ptr 的方式

shared_ptr<int> sp1; // 创建了一个空指针
shared_ptr<int> sp2(sp1); // 使用智能指针 sp1 初始化智能指针 sp2
auto sp3 = make_shared<int>(); // 使用 make_shared 构造智能指针
shared_ptr<int> sp4(new int); // 使用内置指针初始化 sp4
```

### 12.1.4 智能指针和异常

智能指针的析构函数保证了即使程序由于抛出异常时也会正常释放已经被分配的内存空间，而使用内置指针的动态内存在抛出异常时并不会被释放。

存在某些为 C 和 C++ 两种语言共同设计的类，这些类分配了资源，但是没有定义析构函数来释放这些资源。在实际使用时也会经常存在忘记主动释放资源的情况，为了解决这种情况可以使用 shared<span>\_</span>ptr 来管理，但是 shared<span>\_</span>ptr 的析构函数默认调用 _delete_ 操作来销毁对象，而 _delete_ 操作只能销毁由 _new_ 分配的内存空间，因此针对这种情况通常需要我们在初始化 shared<span>\_</span>ptr 时传递一个 deleter(删除器)。

```cpp{24,28}
#include <iostream>
#include <memory>

using namespace std;

class NetWork {
 public:
  NetWork() {
    cout << "assign memory" << endl;
    m_data = new int(1024);
  }
  // 默认的析构函数并没有释放这个动态分配的空间
  void disconnect() {
    cout << "delete memory" << endl;
    delete m_data;
  }

 private:
  int* m_data;
};

// 自定义 deleter, 注意这里为指针类型
// 由于该 deleter 将被用于 sp 的初始化，deleter 需要配合内置指针使用
void deleter(NetWork* p) { p->disconnect(); }

int main(int argc, char** argv) {
  NetWork net;
  shared_ptr<NetWork> sp(&net, deleter);
  return 0;
}
```

:::tip

智能指针存在很多使用陷阱，为了正确使用智能指针，建议遵循下面的基本规范：

- 不使用相同的内置指针初始化或者 "reset" 多个智能指针
- 不通过 delete 销毁 "get" 操作获取的内置指针
- 通过 "get" 操作获取的内置指针不能用于初始化或者 "reset" 另一个智能指针
- 通过 "get" 操作获取的内置指针可能会变成空悬指针
- 使用智能指针管理不是由 new 分配的资源时需要传递给它一个删除器

:::

### 12.1.5 unique_ptr

shared_ptr 允许对象被共享，unique_ptr 却独占其指向的对象，在某一时刻永远只有一个 unique_ptr 指向一个给定对象，因此其不支持普通的拷贝或者赋值等操作。同样的，一个 unique_ptr 被销毁，其指向的对象也将被释放。

:::center

| 操作                                | 说明                                                                                            |
| :---------------------------------- | :---------------------------------------------------------------------------------------------- |
| unique_ptr&lt;T&gt; up1             | 创建一个空的 unique_ptr,<br> 默认使用 delete 操作销毁对象                                       |
| unique_ptr&lt;T, D&gt; up2          | 创建一个空的 unique_ptr，<br>使用类型为 D 的可调用对象代替 delete 操作销毁对象                  |
| unique_ptr&lt;T, D&gt; up3(d)       | 创建一个空的 unique_ptr，<br>使用类型为 D 的对象 d 代替 delete 操作销毁对象                     |
| unique_ptr&lt;T&gt; up4(new_q)      | 创建一个 unique_ptr，并使用 new_q 初始化，<br> 默认使用 delete 操作销毁对象                     |
| unique_ptr&lt;T, D&gt; up2(new_q)   | 创建一个 unique_ptr，并使用 new_q 初始化，<br>使用类型为 D 的可调用对象代替 delete 操作销毁对象 |
| unique_ptr&lt;T, D&gt; up3(new_q,d) | 创建一个 unique_ptr，并使用 new_q 初始化，<br>使用类型为 D 的对象 d 代替 delete 操作销毁对象    |
| up = nullptr                        | 释放 up 指向的对象，并将 up 置空                                                                |
| up.release()                        | up 放弃控制权，返回 up 的内置指针，并将 up 置空                                                 |
| up.reset()                          | 释放 up 指向的对象                                                                              |
| up.reset(new_q)                     | 释放 up 指向的对象，重新指向 new_q                                                              |
| up.reset(nullptr)                   | 释放 up 指向的对象，并将 up 置空                                                                |

:::

```cpp
unique_ptr<int> up(new int);
unique_ptr<int> up2(up.release()); // 将 up 的指针权限转移给 up2

```

一个 unique_ptr 不能被拷贝或者赋值，但是当一个 unique_ptr 将被销毁时，则可以通过 "移动" 的方式实现 unique_ptr 的转移。

unique_ptr 接受自定义删除器的方式与 shared_ptr 有所不同，这是由设计权衡的，shared_ptr 为了使用的灵活性在运行时绑定删除器，而 unique_ptr 为了效率在编译期就绑定了删除器。

### 12.1.6 weak_ptr

weak_ptr 利用其 "弱" 共享对象的特点，它指向一个 shared_ptr 管理的对象，当一个 weak_ptr 绑定到一个 shared_ptr 后，并不会改变 shared_ptr 的引用计数。当最后一个 shared_ptr 被销毁后，其管理的对象也将被销毁。

:::center

| 操作                     | 说明                                                                                 |
| :----------------------- | :----------------------------------------------------------------------------------- |
| weak_ptr&lt;T&gt; wp     | 创建一个空的 weak_ptr                                                                |
| weak_ptr&lt;T&gt; wp(sp) | 创建一个 weak_ptr，并使用 shared_ptr sp 进行初始化                                   |
| wp = sp                  | 将 weak_ptr wp 与 shared_ptr sp 进行绑定                                             |
| wp.reset()               | 将 wp 置空                                                                           |
| wp.use_count()           | 与 wp 共享的 shared_ptr 的数量                                                       |
| wp.expired()             | wp.use_count() 计数为 0 则返回 true，否者返回 false                                  |
| wp.lock()                | expired 为 true，返回一个空的 shared_ptr，<br> 否者返回一个指向 wp 对象的 shared_ptr |

:::

weak_ptr 的一个用法示例就是用于解决错误使用 shared_ptr 导致的循环引用问题。

:::tabs

@tab shared_ptr 导致循环引用

```cpp{10,16,27,29}
#include <iostream>
#include <memory>

using namespace std;
class B;

struct A {
  void count() { cout << "count b: " << m_b.use_count() << endl; }
  void show() { cout << "A" << endl; }
  shared_ptr<B> m_b;
};

struct B {
  void count() { cout << "count a: " << m_a.use_count() << endl; }
  void show() { cout << "B" << endl; }
  shared_ptr<A> m_a;
};


int main(int argc, char **argv) {
  {
    auto a = make_shared<A>();
    auto b = make_shared<B>();
    cout << "count a: " << a.use_count() << endl;
    cout << "count b: " << b.use_count() << endl;
    a->m_b = b; // a 中成员引用 b, b 的引用计数加 1
    a->count(); // 2
    b->m_a = a; // b 中成员引用 a，a 的引用计数加 1
    b->count(); // 2
  }
  cout << endl;
  return 0;
}
```

@tab weak_ptr 解决循环引用

```cpp{10,16,27,29}
#include <iostream>
#include <memory>

using namespace std;
class B;

struct A {
  void count() { cout << "count b: " << m_b.use_count() << endl; }
  void show() { cout << "A" << endl; }
  weak_ptr<B> m_b;
};

struct B {
  void count() { cout << "count a: " << m_a.use_count() << endl; }
  void show() { cout << "B" << endl; }
  weak_ptr<A> m_a;
};


int main(int argc, char **argv) {
  {
    auto a = make_shared<A>();
    auto b = make_shared<B>();
    cout << "count a: " << a.use_count() << endl;
    cout << "count b: " << b.use_count() << endl;
    a->m_b = b; // a 中成员引用 b, b 的引用计数加 1
    a->count(); // 1
    b->m_a = a; // b 中成员引用 a，a 的引用计数加 1
    b->count(); // 1
  }
  cout << endl;
  return 0;
}

```

:::

## 12.2 动态数组

前面介绍的基本都是一次只分配一个元素的内存空间，通过 _new_ 和 _delete_ 可以一次性分配多个元素的内存空间。

:::tip
大多数情况都应该直接使用容器，而不是动态分配的数组。
:::

### 12.2.1 new 和数组

使用 _new_ 分配一个对象数组需要在类型名称之后添加一对方括号，在其中指明要分配的对象个数，==个数必须是整型，但不必是常量==。使用 _new_ 分配的对象数组并不是所谓的 "动态数组"，**它不是真的数组，而是一个指针，指向的是一个数组类型**。

默认情况下，只要是动态分配的内存都是执行默认初始化，我们可以进行值初始化，对动态分配的数组空间也不例外。当初始化时提供的元素个数超过设定的对象个数时，则 _new_ 分配空间会失败，同时会抛出 bad_array_new_length 的异常。需要谨记的是，我们可以是空的圆括号对数组元素进行值初始化，但是不能在圆括号中给出指定的初始化值。

我们不能定义长度为 0 的数组，但是却可以分配一个长度为 0 的空数组。这是合法的，因为使用 _new_ 分配长度为 0 的数组时返回的是一个指针，该指针是合法的，且值非空，该指针可执行的操作类似于尾后指针，例如指针的减法等。

```cpp

int *pi1 = new int[3]; // 默认初始化

int size = 3;
int *pi2 = new int [size]; // 默认初始化

typedef int arrT1[3];
using arrT2 = int[3];
// 使用类型别名，编译器最终仍然调用 new int[3]
int *pi3 = new arrT1;
int *pi4 = new arrT2;

int *pi5 = new int[3](); // 值初始化，均为 0
// 错误用法，无法通过该方式进行值初始化
// int *pi6 = new int[3](66);

int *pi7 = new int[3]{1, 2}; // 列表初始化，剩余元素执行值初始化

int *pi8 = new int[0]; // 分配一个长度为 0 的数组

```

==动态分配的数组空间释放必须在要删除的指针前面添加一对空的方括号以表示删除的是动态分配的数组。==数组中的元素按照 **逆序** 销毁。

:::danger

删除一个动态分配的数组时如果忘记使用 "[]"，则该删除操作是未定义的行为，具体行为如何取决于编译器，通常只会删除第一个元素，导致内存泄漏。

```cpp
#include <iostream>
#include <memory>

using namespace std;

struct A {
  ~A() { cout << "call destructor" << endl; }
};

using arrT = struct A[5];

int main(int argc, char **argv) {

  {
    auto p = new arrT;
    delete[] p;// 调用 5 次析构函数
  }

  cout << "------------------" << endl;

  {
    auto p = new arrT;
    delete p;// 调用 1 次 析构函数
  }
  return 0;
}
```

:::

可以使用 unique_ptr 直接管理动态分配的数组空间，此时需要在对象的类型后面跟一对空方括号，例如 `unique_ptr <int[]> up;`。当 unique_ptr 销毁时会自动使用 "delete[]" 操作销毁对象。unique_ptr 支持下标操作符，可以直接获取到下标对应位置的对象。shared_ptr 不能直接管理动态分配的数组，需要提供自己定义的删除器，同时也不支持下标运算符，需要使用 "get" 操作获取内置指针。

### 12.2.2 allocator 类

后面有章节进一步介绍 _new_ 的本质，它将内存分配与对象初始化绑定在一起。因此灵活性和效率就大大降低了，例如分配了一块较大的内存，但只要其中一部分空间，此时仍然会将剩余空间进行初始化就显得有点浪费。

标准库定义的 allocator 类可以将内存分配与对象初始化分离，当一个 allocator 对象分配内存时，它会根据给定的对象类型来确定合适的内存大小和对齐位置。支持以下操作：

:::center

| 操作                   | 说明                                                                                                                |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------ |
| allocator&lt;T&gt; a   | 创建一个 allocator 对象 a                                                                                           |
| auto p = a.allocate(n) | 分配 n 个原始的、未初始化的内存，返回内存起始地址指针                                                               |
| a.deallocate(p, n)     | 释放指针 p 开始的 n 个对象内存，<br> p 由 allocate 返回，n 必须与 allocate 分配的数量一致 <br> 释放前需要先销毁对象 |
| a.construct(p, args)   | 在指针 p 指向的内存中通过 args 构造一个对象                                                                         |
| a.destroy(p)           | 销毁指针 p 指向的对象                                                                                               |

:::

:::tip

allocator 类的使用流程大致如下：

1. 创建 allocator 对象；
2. 利用 "allocate" 操作分配原始内存空间
3. 利用 "construct" 操作在指定的原始内存空间中构造对象
4. 使用完毕后利用 "destroy" 操作销毁给定指针指向的对象
5. 利用 "deallocate" 操作释放之前分配的内存空间

:::

allocator 定义了几个伴随算法，用于在未初始化的内存中构造对象。

- `unintialized_copy(begin, end, begin2)`: 从迭代器范围 [begin, end) 中拷贝元素到 begin2 开始的位置
- `unintialized_copy_n(begin, n, begin2)`: 从迭代器 begin 开始拷贝 n 个元素到 begin2 开始的位置
- `unintialized_fill(begin, end, value)`: 在迭代器范围 [begin, end) 的位置均使用 value 进行初始化
- `unintialized_fill_n(begin, n, value)`: 从迭代器 begin 开始的 n 个元素均用 value 进行初始化
