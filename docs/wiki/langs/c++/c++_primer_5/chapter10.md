---
title: 10. 泛型算法
order: 10
category:
  - C++
tag:
  - algorithm
  - 算法
  - lambda
  - bind
  - 迭代器
article: false
date: 2017-09-20
---

## 10.1 概述

标准库定义的大多数算法都在 algorithm 头文件中，还有少部分数值相关的算法定义在 numeric 头文件中。这些算法属于泛型算法，通常不直接操作容器，而是通过迭代器来实现通用的操作。尽管如此，大多数算法都使用了依赖于元素类型的操作，例如元素的 "==" 和 "&lt;" 比较符等。

:::tip

标准库提供的算法永远不会改变容器的大小，也不会直接的添加或者删除元素，但是可能在容器内移动元素。
:::

### 10.2 初始泛型算法

> 理解算法的最基本的方法就是了解它们是否读取元素、改变元素或者重排元素顺序。

### 10.2.1 只读算法

只读算法只会读取其输入范围内的元素，而不会改变元素。例如 "find" 等。

在 numeric 中定义了一个只读的 accumulate 算法，它接受三个参数，前两个参数指出需要求和的元素的范围，然后第三个参数是求和的初始值。==这个初始值的类型决定了函数中使用哪个加法运算符及返回值的类型，需要保证容器内的元素类型与初始值的类型可执行加法操作==。

还有的只读算法可以操作两个序列的算法，例如 "equal" 算法可以确定两个序列是否相同，它将第一个序列中每个元素于第二个序列中对应元素进行比较，对应元素都相等则返回 _true_。对于类似这种只接受单一迭代器表示第二序列的算法，都假定第二个序列至少与第一个序列一样长。

```cpp{10,13,17}
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

int main(int argc, char** argv) {
  vector<int> v{3, 4, 5, 6, 7};
  auto it = find(v.begin(), v.end(), 5);
  cout << distance(v.begin(), it) << endl;

  int result = accumulate(v.begin(), v.end(), 0);
  cout << result << endl;

  vector<int> v2{3, 4, 5, 6, 7};
  cout << equal(v.begin(), v.end(), v2.begin()) << endl;
  return 0;
}
```

### 10.2.2 写容器的算法

即使是写容器的算法也不会直接操作容器，因此容器的底层容量并不会被改变，因此这些算法本质上最多写入与指定序列一样多的元素。

"fill_n" 操作用于将一个新的值赋给容器中指定位置的元素，必须保证指定位置在容器中是有效的。

"copy" 操作是向目的容器中拷贝数据的算法，最终返回目的容器的下一个位置的迭代器。

"replace" 操作读入一个序列，然后将序列内所有与给定数值相等的元素替换为新的值。"replace_copy" 不会修改原有序列，转而拷贝到新的容器。

```cpp{15,19,22,26}
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

void print(const vector<int>& v) {
  for_each(v.cbegin(), v.cend(), [](int value) { cout << value << " "; });
  cout << endl;
}

int main(int argc, char** argv) {
  vector<int> v{3, 4, 5, 6, 7};
  fill_n(v.begin(), 2, 0);
  print(v);  // 0 0 5 6 7

  vector<int> v2(5);
  copy(v.begin(), v.end(), v2.begin());
  print(v2);  // 0 0 5 6 7

  replace(v.begin(), v.end(), 0, 66);
  print(v);  // 66 66 5 6 7

  vector<int> v3(5);
  replace_copy(v.begin(), v.end(), v3.begin(), 66, 99);
  print(v3);  // 99 99 5 6 7

  return 0;
}
```

### 10.2.3 重排容器的算法

"sort" 操作利用元素的 &lt; 运算符实现对元素的排序，元素排序会引起容器的重排。

"unique" 操作将==相邻的重复项== "消除"，返回的是最后一个不重复值元素后面的迭代器，该操作并不删除任何元素，只是将重复的。

```cpp{15,18}
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

void print(const vector<int>& v) {
  for_each(v.cbegin(), v.cend(), [](int value) { cout << value << " "; });
  cout << endl;
}

int main(int argc, char** argv) {
  vector<int> v{3, 6, 5, 6, 6, 2, 7, 5, 7, 7};
  sort(v.begin(), v.end());
  print(v);  // 2 3 5 5 6 6 6 7 7 7

  auto end = unique(v.begin(), v.end());
  print(v);  // 2 3 5 6 7 6 6 7 7 7
  cout << "最后一个不重复元素后面的迭代器对应的索引: "
       << distance(v.begin(), end) << endl;
  return 0;
}
```

## 10.3 定制操作

### 10.3.1 向算法传递函数

很多算法都提供了可以接收函数参数的重载版本，通常称这个参数为谓词。本质上，谓词就是可以调用的表达式，返回一个能用作条件判断的值。标准库算法接受的谓词分为：一元谓词和二元谓词。

- 一元谓词：只接受单一参数
- 二元谓词：接受两个参数

:::tip

谓词表达式作用于输入序列的元素，必须保证输入序列的元素类型与谓词的参数类型可兼容。

:::

### 10.3.2 lambda 表达式

谓词让算法的适用范围性得到了一定的扩展，但是谓词只能接收一个或两个参数，如果希望接受更多参数则可以通过 lambda 表达式实现。lambda 表达式是一个可调用的对象，可理解为一个未命名的内联函数，本质上是一个匿名的重载了函数调用运算符的类。

标准的 lambda 表达式的组成结构如下所示：

"**[捕获列表] (参数列表) -> 返回值类型 { 函数体 }**"

一个 lambda 表达式的组成与函数类似，但是额外包含了一个捕获列表，在捕获列表内的成员可以直接在 lambda 表达式的函数体内使用。捕获列表只用于捕获非静态的局部变量，如果是静态局部变量、全局变量等均可以直接在 lambda 表达式的函数体内使用。

lambda 表达式必须使用尾置返回的形式，但是可以省略参数列表和返回类型，如果省略参数列表则说明该 lambda 表达无需额外参数；如果省略了返回值类型，则返回值类型根据函数体中的 _return_ 语句自动推断，一旦出现多个 _return_ 语句则返回类型为 _void_。

lambda 表达式的参数列表中不能有默认参数，捕获列表为空时表明其不需要 lambda 表达式所在作用域中的局部变量。

```cpp {10-11,19-21,26-29}
#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

using namespace std;

void print(const vector<string>& words) {
  for_each(words.cbegin(), words.cend(),
           [](const string& word) { cout << word << " "; });
  cout << endl;
}

int main(int argc, char** argv) {
  vector<string> words{"hello", "word", "today", "is", "a", "good", "day"};

  // 按字符串长度排序
  sort(words.begin(), words.end(), [](const string& lhs, const string& rhs) {
    return lhs.size() < rhs.size();
  });
  print(words);

  int wordSize = 3;

  auto it = find_if(
      words.cbegin(), words.cend(),
      // 捕获 wordSize
      [wordSize](const string& word) { return word.size() > wordSize; });
  cout << "第一个长度大于 " << wordSize << " 的单词是：" << *it << endl;
  return 0;
}
```

### 10.3.3 lambda 捕获和返回

lambda 的捕获变量的方式：

- **显式值捕获**：采用值拷贝形式，要求捕获的变量必须可拷贝。创建 lambda 时就已经完成值拷贝。
- **显式引用捕获**：与普通引用类似，要求在 lambda 执行期间，引用对象必须一直有效。
- **隐式捕获**：在捕获列表内添加 "="(值捕获) 或 "&"(引用捕获)，可以由编译器推断捕获的成员。

:::tip

一般来说，我们应该尽可能减少捕获的变量数目，以避免某些潜在的由捕获导致的问题。同时也应该避免捕获指针或引用，以避免在 lambda 执行时捕获变量的值并非我们期望的值。

:::

对于隐式捕获，值捕获和引用捕获无法同时使用，如果混用隐式捕获和显式捕获，那么隐私捕获必须处于捕获列表的第一个位置，而且隐式捕获与显式捕获必须属于不同的捕获方式，即隐式捕获是值捕获时，显式捕获必须是引用捕获；相反，如果隐式捕获是引用捕获，那么显式捕获则必须是值捕获。

默认情况下，值捕获的变量在 lambda 表达式的函数体中是不可变的，可以使用 _mutable_ 关键字进行修饰。

```cpp{15-18,25,30,35-38,43-46,51-54}
#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

using namespace std;

int main(int argc, char** argv) {
  vector<string> words{"hello", "word", "today", "is", "a", "good", "day"};

  int wordSize = 3;
  string wordString;
  // 显式的值捕获和引用捕获
  auto lambda1 = [wordSize, &wordString](const string& word) {
    wordString = word.size() > wordSize ? word : "";
    return word.size() > wordSize;
  };

  auto it = find_if(words.begin(), words.end(), lambda1);
  cout << wordString << endl;

  int a = 10, b = 33;
  // 隐式的值捕获，创建 lambda 表达式时就已经完成值拷贝
  auto lambda2 = [=] { cout << "a = " << a << " b = " << b << endl; };
  a = 0, b = 0;  // 置 0，不影响 lambda 的结果
  lambda2();

  // 隐式的引用捕获
  auto lambda3 = [&] { a = 66, b = 99; };
  lambda3();
  cout << "a = " << a << " b = " << b << endl;

  // 混用隐式值捕获和显式引用捕获
  auto lambda4 = [=, &a] {
    a = 10;
    cout << "b = " << b << endl;
  };
  lambda4();
  cout << "a = " << a << endl;

  // 混用隐式引用捕获和显式值捕获
  auto lambda5 = [&, a] {
    cout << "a = " << a << endl;
    b = 55;
  };
  lambda5();
  cout << "b = " << b << endl;

  // 使用 mutable 修饰值捕获
  auto lambda6 = [a]() mutable {
    a = 123;
    cout << "a = " << a << endl;
  };
  lambda6();
  cout << "a = " << a << endl;

  return 0;
}
```

lambda 表达式的函数体中只能出现一条 _return_ 语句，否则表达式的返回值类型将被自动推断为 _void_，含有多条 _return_ 语句的函数体需要显式指定返回值类型。

"transform" 操作是将输入序列中的每个元素替换为执行可调用操作后得到的结果。

```cpp{12,15-20,23}
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

int main(int argc, char** argv) {
  vector<int> v{1, -1, 2, -3, -4, 5};

  // 自动推断返回值类型
  auto lambda1 = [](int value) { return value < 0 ? -value : value; };

  // 需要使用尾置返回显式指定返回值类型
  auto lambda2 = [](int value) -> int {
    if (value < 0)
      return -value;
    else
      return value;
  };

  // 前两个迭代器构成一个迭代器范围，第三个表示目的容器中写入数据的起始迭代器
  transform(v.begin(), v.end(), v.begin(), lambda2);
  for (int i : v) cout << i << " ";
  cout << endl;

  return 0;
}
```

### 10.3.4 参数绑定

前面提到的 lambda 表达式可以解决多个参数与谓词参数不匹配的问题，但是其通常应用在比较简单的场景，如果在复杂场景中，则更多的是使用函数。

标准库的 "bind" 操作则可以实现类似于 lambda 表达式中使用捕获列表传递多个参数给函数体的效果，近而降低参个数、变换参数位置等 。

"bind" <Badge text="C++11" type="info" /> 操作是 C++ 11 引入的标准库函数，定义在 functional 头文件中，可以看做一个函数适配器，接受一个可调用对象，生成一个新的可调用对象，新生成的可调用对象通常与使用该对象的函数中要求的参数列表相符。

:::tip

`auto newCallable = bind(callable, args);` 为 "bind" 操作的一般使用形式，创建一个新的可调用对象 newCallable, 每次调用 newCallable 时都会以给定的参数 args 调用另一个可调用对象 callable。

:::

=="bind" 通常需要配合占位符一起使用，所谓占位符只是一个定义在 _std::placeholders_ 命名空间中的一些特殊名字，表明其在 newCallable 这个可调用对象中的参数位置，例如 _std::placeholders::\_1_ 表示的是 newCallable 的第一个参数，所有外部传递给 newCallable 第一个参数的值都会绑定到这个名字上。==

由于 newCallable 对象会将给定的 args 传递给 callable 对象，因此可以通过调整 args 的顺序以实现参数位置重排等功能。

默认情况下，"bind" 中不是占位符的参数将被拷贝到 newCallable 对象中，如果期望以引用形式传递对象则需要通过标准库的 "ref" 操作。

```cpp{10,26-27,31-32}
#include <algorithm>
#include <functional>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

using namespace std;

void print(int a, string b, vector<int>& c) {
  cout << a << " " << b << " ";
  for (int i : c) cout << i << " ";
  cout << endl;
  c.clear();
}

int main(int argc, char** argv) {
  vector<int> v{1, 2, 3};
  // 返回的 newCallable 接受两个参数：
  // 传递给 print 的第一个参数是 newCallable 的第二个参数，
  // 因此 newCallable 的第二个参数类型是 int 类型
  // 传递给 print 的第二个参数是 newCallable 的第一个参数，
  // 因此 newCallable 的第一个参数类型是 string 类型
  // 传递给 print 的第三个参数是容器 v，默认以拷贝形式传递给 newCallable
  // 因此即使 print 的第三个是引用，函数内部做了 clear 对外部也无影响
  auto newCallable = bind(print, placeholders::_2, placeholders::_1, v);
  newCallable("abc", 666);                        // 666 abc 1 2 3
  cout << "容器 v 的大小：" << v.size() << endl;  // 3

  // 调整 newCallable2 的参数顺序，同时通过 ref 传递引用到 newCallable2
  auto newCallable2 = bind(print, placeholders::_1, placeholders::_2, ref(v));
  newCallable2(999, "def");                       // 999 def 1 2 3
  cout << "容器 v 的大小：" << v.size() << endl;  // 0

  return 0;
}
```

## 10.4 再探迭代器

标准库的 iterator 头文件中定义几个额外的迭代器：

1. **插入迭代器**：绑定到容器，向容器中插入元素
2. **流迭代器**：绑定到输入输出流，用来遍历关联的 IO 流
3. **反向迭代器**：反向移动的迭代器
4. **移动迭代器**：用于移动元素的迭代器

### 10.4.1 插入迭代器

插入迭代器是迭代器适配器，接受一个容器生成一个迭代器。插入迭代器包括：

- back_inserter：创建一个使用 "push_back" 的迭代器，容器必须具备 "push_back" 操作
- front_inserter：创建一个使用 "push_front" 的迭代器，容器必须具备 "push_front" 操作
- inserter：额外接受第二个参数，表示在指定迭代器位置之前插入元素。

```cpp{9,11,15}
#include <iostream>
#include <iterator>
#include <list>

using namespace std;

int main(int argc, char** argv) {
  list<int> v{1, 2, 3};
  auto backIter = back_inserter(v);
  *backIter = 4;
  auto frontIter = front_inserter(v);
  *frontIter = 66;
  auto it = v.begin();
  advance(it, 3);
  auto iter = inserter(v, it);
  *iter = 99;

  // 66 1 2 99 3 4
  for (int i : v) cout << i << " ";
  cout << endl;
  return 0;
}
```

### 10.4.2 iostream 迭代器

_iostream_ 类型不是容器类型，标准库定义了可以专门用于 IO 对象的迭代器:

- istream_iterator：从输入流读取数据
- ostrem_iterator：向输入流写数据

:::center

| 操作                                   | 说明                                                                                                    |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| istream_iterator&lt;T&gt; in(is)       | 创建一个输入流迭代器 in，从输入流 is 读取类型为 T 的值                                                  |
| istream_iterator&lt;T&gt; eof          | 创建一个类型为 T 的尾后迭代器，表示 IO 错误或 IO 流结束                                                 |
| \*in                                   | 解引用输入流迭代器，表示读取从输入流中返回的值                                                          |
| ostream_iterator&lt;T&gt; out(os)      | 创建一个输入流迭代器 out，向输出流 os 中写入类型为 T 的值                                               |
| ostream_iterator&lt;T&gt; out(os, str) | 创建一个输入流迭代器 out，<br> 向输出流 os 中写入类型为 T 的值，<br>每个值后面都输出一个 C 风格的字符串 |
| out = value                            | 将 value 写入到 out 所绑定的输出流中，<br> value 必须可兼容 T 类型                                      |

:::

```cpp
#include <algorithm>
#include <iostream>
#include <iterator>
#include <vector>

using namespace std;

int main(int argc, char** argv) {
  istream_iterator<int> in(cin);
  istream_iterator<int> eof;  // 遇到 IO 错误或者非指定类型时的迭代器
  vector<int> v(in, eof);  // 从输入流读取 int 数据存入 vector 中
  ostream_iterator<int> out(cout, " ");
  copy(v.begin(), v.end(), out);
  return 0;
}
```

### 10.4.3 反向迭代器

反向迭代器是从尾元素向首元素移动的迭代器，递增 (++) 一个反向迭代器会移动到前一个元素，递减 (--) 一个反向迭代器会移动到后一个元素。除了 _forward_list_ 外都支持反向迭代器。反向迭代器通过成员的 "base" 操作可以获取其对应的正向普通迭代器。
下图展示了反向迭代器与正向迭代器之间的对应关系：

![reverse_iterator](./images/chapter10_reverse_iterator.png)

## 10.5 泛型算法结构

### 10.5.1 5 类迭代器

迭代器按其操作进行分类，分为以下 5 大类：

:::center

| 类别           | 说明                                 |
| :------------- | :----------------------------------- |
| 输入迭代器     | 只读，不写，单次扫描，只能递增       |
| 输出迭代器     | 只写，不读，单次扫描，只能递增       |
| 前向迭代器     | 可读写，多次扫描，只能递增           |
| 后向迭代器     | 可读写，多次扫描，可递增递减         |
| 随机访问迭代器 | 可读写，多次扫描，支持全部迭代器运算 |

:::

### 10.5.2 算法形参模式

大多数标准库提供的算法其函数签名形式大致如下：

1. alg(begin, end, other_args);
2. alg(begin, end, dest, other_args);
3. alg(begin, end, begin2, other_args);
4. alg(begin, end, begin2, end2, other_args);

其中 alg 表示标准库的算法名字，[begin, end) 通常构成输入序列的迭代器范围，dest, [begin2, end2) 表示目标容器的迭代器或者第二序列的迭代器范围等。

### 10.5.3 算法命名规范

标准库提供的算法遵循一套命名和重载规范，一些算法会使用重载的方式传递一个谓词，而一些算法则通过定义一个带 \_if 后缀名的版本接受谓词。

为了区分拷贝与不拷贝的版本，通常会定义一个带 \_copy 后缀名的版本。

## 10.6 特定容器算法

_list_ 和 _forward_list_ 由于其数据结构为链表形式，使用通用版本的算法代价太高，因此它提供了一些独有的成员函数。对于链表结构的容器，优先使用的应该是容器内置的算法而不是通用的算法。

:::center

| 操作                                                                        | 说明                                                                                                            |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| lst.merge(lst2 <br> lst.merge(lst2, comp)                                   | 将 lst2 的元素合并到 lst, <br>lst 和 lst2 必须是有序的，合并后 lst2 变为空                                      |
| lst.remove(val) <br> lst.remove_if(pred)                                    | 调用 erase 删除与给定值相等或 pred 返回 true 的元素                                                             |
| lst.reverse()                                                               | 反转 lst 中的元素                                                                                               |
| lst.sort() <br> lst.sort(comp)                                              | 使用 &lt; 或者 comp 比较操作排序元素                                                                            |
| lst.unique() <br> lst.unique(pred)                                          | 使用 erase 删除连续的值                                                                                         |
| lst.splice(p, lst2) <br> flst.splice_after(p, lst2)                         | p 是指向 lst 的迭代器, <br>将 lst2 的元素添加到 lst 的迭代器 p 之前,<br>将 lst2 的元素添加 flst 的迭代器 p 之后 |
| lst.splice(p, lst2, p2) <br> flst.splice_after(p, lst2, p2)                 | p 是指向 lst 的迭代器, p2 是指向 lst2 的迭代器。<br>将 p2 移动到 lst 中,<br> 将 p2 之后的元素移动到 flst 中     |
| lst.splice(p, lst2, begin, end) <br> flst.splice_after(p, lst2, begin, end) | p 是指向 lst 的迭代器, p2 是指向 lst2 的迭代器。<br>将 lst2 中的 [begin, end) 范围元素移动到 lst 或 flst 中     |

:::

```cpp{10,18,27}
#include <algorithm>
#include <iostream>
#include <iterator>
#include <list>

using namespace std;

int main(int argc, char** argv) {
  list<int> lst{1, 2, 3}, lst2{7, 8, 9};
  lst.splice(lst.begin(), lst2);
  ostream_iterator<int> out(cout, " ");
  cout << "lst: ";
  copy(lst.begin(), lst.end(), out);  // 7 8 9 1 2 3
  cout << endl;

  auto it = lst.begin();
  advance(it, 3);
  lst2.splice(lst2.begin(), lst, it);
  cout << "lst2: ";
  copy(lst2.begin(), lst2.end(), out);  // 1
  cout << endl << "lst: ";
  copy(lst.begin(), lst.end(), out);  // 7 8 9 2 3
  cout << endl;

  it = lst.begin();
  advance(it, 3);
  lst2.splice(lst2.begin(), lst, lst.begin(), it);
  cout << "lst2: ";
  copy(lst2.begin(), lst2.end(), out);  // 7 8 9 1
  cout << endl << "lst: ";
  copy(lst.begin(), lst.end(), out);  // 2 3
  cout << endl;

  return 0;
}
```
