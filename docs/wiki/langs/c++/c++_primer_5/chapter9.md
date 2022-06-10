---
title: 9. 顺序容器
order: 9
category:
  - C++
tag:
  - vector
  - list
  - string
article: false
date: 2017-09-15
---

## 9.1 顺序容器概述

通常的容器指的是某种特定类型对象的集合，顺序容器提供了顺序访问容器元素的能力。顺序容器主要包括以下几类：

- _vector_: 动态数组，支持随机访问，通常在尾部插入和删除元素
- _deque_: 双端队列，支持随机访问，通常在尾部和头部插入和删除元素，从效率上讲相对较慢，慎用
- _list_: 双向链表，不支持随机访问，但是插入和删除元素非常方便
- _forward_list_ <Badge text="c++11" type="info" /> : 单向链表，不支持随机访问，但是插入和删除元素都非常方便
- _array_ <Badge text="c++11" type="info" /> : 定长数组，支持随机访问，不能增删元素
- _string_: 类似于 _vector_，但专门用于保存字符，支持随机访问，在尾部插入和删除字符很快

## 9.2 容器库概览

容器库的中每一个容器都有定义在对应的头文件，所有容器都是模板类，使用时需要指定元素类型。标准库给所有容器都提供一组通用的操作和特性

:::center

| 类型别名               | 说明                             | 类型别名         | 说明                                         |
| :--------------------- | :------------------------------- | :--------------- | :------------------------------------------- |
| iterator               | 容器迭代器                       | const_iterator   | 常迭代器，无法用于更改元素                   |
| size_type              | 无符号整数，通常表示容器大小类型 | difference_type  | 带符号整数类型，通常表示两个迭代器之间的距离 |
| value_type             | 元素类型                         | reference        | 元素的左值类型                               |
| const_reference        | _const_ 限定的元素左值类型       | reverse_iterator | 逆序寻址的迭代器                             |
| const_reverse_iterator | 逆序寻址的常迭代器               |

| 构造/赋值/swap                                 | 说明                                                       |
| :--------------------------------------------- | :--------------------------------------------------------- |
| C c                                            | 默认构造函数，创建一个空容器                               |
| C c2(c1)                                       | 拷贝构造函数，创建一个 c1 容器，其元素通过 c2 拷贝得到     |
| C c(begin, end)<sub> (不支持 array) </sub>     | 创建一个容器，使用迭代器 begin 和 end 之间的元素进行初始化 |
| C c{a, b, c,....}                              | 列表初始化                                                 |
| c1 = c2                                        | 将容器 c2 中的元素拷贝给 c1                                |
| c1 = {a, b, c, ...}<sub> (不支持 array) </sub> | 将列表元素拷贝给容器 c1                                    |
| c1.swap(c2) <br> swap(c1, c2)                  | 交换容器 c1 和 c2 的元素                                   |

| 常用操作                                                | 说明                                       |
| :------------------------------------------------------ | :----------------------------------------- |
| c.size() <sub>(不支持 forward_list)</sub>               | 获取容器中元素的个数                       |
| c.max_size()                                            | 容器中可保存的最大元素数目                 |
| c.empty()                                               | 判断容器是否为空                           |
| c.begin(), c.end()                                      | 获取容器的首元素迭代器和尾后元素迭代器     |
| c.cbegin(), c.cend()                                    | 获取容器的首元素和尾后元素的常迭代器       |
| c.rbegin(), c.rend() <sub>(不支持 forward_list)</sub>   | 获取容器的尾元素迭代器和首元素之前的迭代器 |
| c.crbegin(), c.crend() <sub>(不支持 forward_list)</sub> | 获取容器的尾元素和首元素之前的常迭代器     |

:::

### 9.2.1 迭代器

迭代器有一些通用的操作，例如递增迭代器、解引用迭代器等，当然也有一些例外，例如 _forward_list_ 就不支持 "--" 运算。

指向同一容器的两个迭代器可以组成一个迭代器范围，迭代器范围通常采用 **左闭右开，即 [begin, end)** 的形式，迭代器范围可以表示出以下含义:

- 如果 begin 和 end 相等，则迭代器范围为空
- 如果 begin 和 end 不相等，则迭代器范围中至少包含一个元素
- 通过多次递增 begin，最终可以保证 begin == end

### 9.2.2 容器的类型成员

容器的类型成员在 [9.2 容器库概览](#92-容器库概览) 中有详细的说明，其中反向迭代器的逻辑与正向迭代器完全相反，递增反向迭代器会得到前一个元素的迭代器，而容器中的类型别名在泛型编程中非常有用。

### 9.2.3 begin 和 end 成员

除了 _array_ 外，begin 和 end 都是容器的成员函数，这两个函数是获取容器首元素和尾后元素迭代器的重要方法，从而形成迭代器范围。

### 9.2.4 容器定义和初始化

[9.2 容器库概览](#92-容器库概览) 介绍了容器通用的构造和初始化操作，但是对于顺序容器，还有另外两种构造方式：

- `C c(n)`: 创建包含了 n 个元素的容器，元素进行值初始化，仅适用于元素类型为内置类型和具有==默认构造函数==的类，如果元素类型属于类则调用默认的构造函数
- `C c(n, value)`: 创建包含了 n 个元素的容器，元素的初始值为 value

要将一个容器的元素全部拷贝另一个容器中，有两种实现方法：

- 调用容器的拷贝构造或者拷贝赋值函数，此时需要容器和容器中元素的类型均相同
- 调用迭代器版本的构造函数，此时只要拷贝的元素类型可以转换为目标容器中的元素类型即可，使用上更加灵活

_array_ 作为一种特殊的顺序容器，在容器定义时与其他通用顺序容器不用的是它需要 2 个模板参数，需要同时指定元素的类型和元素的个数，例如 `array<int, 10> arr;`。此外，由于 _array_ 的大小不可改变，因此 _array_ 构造时会对元素进行值初始化，整个容器默认也不会是空容器。

_array_ 与内置的数组类型不同的是它支持整个容器的拷贝赋值，但是大小必须一致，因为大小是 _array_ 类型的一部分。

### 9.2.5 赋值和 swap

在顺序容器中，可以通过 "assign" 方法实现容器的赋值，但是该方法不适用于 _array_ 及关联式容器。

- `c.assign(begin, end)` : 使用迭代器范围 [begin, end) 中的元素替换容器 c 的元素，迭代器不能指向 c
- `c.assign(initializer_list` : 使用初始化列表对象中的元素替换容器 c 的元素
- `c.assign(n, value)`: 使用 n 个值为 value 的元素替换容器 c 的元素

:::warning

常规的赋值运算会实际更改容器的元素，因此大多数指向赋值前的容器的迭代器都将失效，而使用 "swap" 操作交换的迭代器并没有真的修改容器元素，它只交换了两个容器内部的数据结构，因此迭代器不会失效。但是在 _string_ 中使用 "swap" 会导致迭代器失效。而且在 _array_ 中 "swap" 会真正交换它们的元素。C++ 11 后推荐统一使用非成员函数版本的 "swap", 即 "std::swap" <Badge text="C++11" type="info" />。

:::

### 9.2.6 容器大小操作

通常， 容器包含三个与容器大小相关的成员函数: "size", "empty", "max<span>\_</span>size"，但是在 _forward_list_ 中，其不支持 "size"。

### 9.2.7 关系运算符

关系运算符的左右两侧的运算对象必须是具有相同类型且具有相同元素类型，每个容器都支持相等性运算，但是只有 ==<u>无序的关联容器</u>== 不支持 "&gt;", ">&ge;", "&lt;", "&le;" 关系运算。总体而言，容器中关系运算符的比较过程类似于 _string_ 的比较过程。

## 9.3 顺序容器操作

### 9.3.1 向顺序容器中添加元素

除了 _array_ 外的容器都有非常灵活的内存管理，可以在运行时动态的给容器添加或者删除元素。以下是一些通用的操作，其中 _forward_list_ 是一个特殊的容器，它拥有自己版本的 "insert" 和 "emplace" 操作:

:::center

| 操作                                                    | 说明                                                                                                              |
| :------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------- |
| c.push_back(element) <sub>(forward_list 不支持)</sub>   | 将元素添加到容器末尾                                                                                              |
| c.emplace_back(args) <sub>(forward_list 不支持)</sub>   | 调用构造函数将元素添加到容器末尾                                                                                  |
| c.push_front(element) <sub>(vector/string 不支持)</sub> | 将元素添加到容器头部                                                                                              |
| c.emplace_front(args) <sub>(vector/string 不支持)</sub> | 调用构造函数将元素添加到容器头部                                                                                  |
| c.insert(it, element)                                   | 在迭代器 it 之前插入元素                                                                                          |
| c.emplace(it, args)                                     | 在迭代器 it 之前使用构造函数插入元素                                                                              |
| c.insert(it, n, element                                 | 在迭代器 it 之前插入 n 个元素，<br>返回第一个新加入的元素所在位置的迭代器 , <br> n 为 0 则返回 it                 |
| c.insert(it, begin, end)                                | 在迭代器 it 之前插入 [begin, end) 内所有元素， <br> 返回第一个新加入的元素所在位置的迭代器，<br>范围为空则返回 it |
| c.insert(it, initializer_list)                          | 在迭代器 it 之前插入元素值列表，<br> 返回第一个新加入的元素所在位置的迭代器，<br>范围为空则返回 it                |

:::

```cpp
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Person {
  friend ostream& operator<<(ostream& os, const Person& rhs) {
    os << rhs.m_name << " " << rhs.m_age;
    return os;
  }

 public:
  Person(const std::string& name, int age) : m_name(name), m_age(age) {}

 private:
  std::string m_name;
  int m_age;
};

// 以最常用的 vector 为例进行说明
int main(int argc, char** argv) {
  Person p1("tony", 12);

  vector<Person> v;
  //  ["tony"]
  v.push_back(p1);
  // ["tony", "jery"]
  v.emplace_back("jery", 16);
  // ["sandy", "tony", "jery"]
  v.insert(v.begin(), Person("sandy", 13));
  // ["hony","sandy", "tony", "jery"]
  v.emplace(v.begin(), "hony", 10);
  //["hony", "sandy", "tony", "jery", "allen", "allen", "allen"]
  v.insert(v.end(), 3, Person("allen", 22));
  // ["tom", "jack", "hony", "sandy", "tony", "jery", "allen", "allen", "allen"]
  v.insert(v.begin(), {Person("tom", 18), Person("jack", 18)});
  cout << "---------------vector------------------" << endl;
  for (auto& element : v) cout << element << endl;

  return 0;
}
```

### 9.3.2 访问元素

通过以下方式可以访问顺序容器中的元素：

:::center

| 操作                                      | 说明                                                                     |
| :---------------------------------------- | :----------------------------------------------------------------------- |
| c.front()                                 | 返回容器 c 首元素的引用                                                  |
| c.back() <sub>(forward_list 不支持)</sub> | 返回容器 c 尾元素的引用                                                  |
| c[n]                                      | 返回容器 c 中下标为 n 的元素的引用，如果下标越界则是未定义行为           |
| c\.at(n)                                  | 返回容器 c 中下标为 n 的元素的引用，如果下标越界则抛出 out_of_range 异常 |

:::

:::note
获取容器元素的几个方法返回都是引用类型，如果容器是 _const_ 类型，那么返回的引用类型也是 _const_ 的。
:::

### 9.3.3 删除元素

标准库也提供了一组操作来删除容器中的元素， 其中 _forward_list_ 有特殊版本的 "erase"。

:::center

| 操作                                           | 说明                                                                           |
| :--------------------------------------------- | :----------------------------------------------------------------------------- |
| c.pop_back()<sub>(forward_list 不支持)</sub>   | 删除容器 c 的最后一个元素                                                      |
| c.pop_front()<sub>(vector/string 不支持)</sub> | 删除容器 c 的第一个元素                                                        |
| c.erase(it)                                    | 删除容器 c 中指定迭代器位置的元素，<br> 返回下一个有效元素位置的迭代器         |
| c.erase(begin, end)                            | 删除容器 c 中迭代器范围 [begin, end) 中的元素，<br> 返回下一个有效元素的迭代器 |
| c.clear()                                      | 删除容器中的所有元素                                                           |

:::

:::danger

删除元素的操作并不检查操作是否合法，因此调用删除操作必须保证元素一定存在。

:::

```cpp
#include <iostream>
#include <list>

using namespace std;

// 以最常用的 list 为例进行说明
int main(int argc, char** argv) {
  list<int> int_list{1, 2, 3, 4, 5, 6, 7};

  // 1, 2, 3, 4, 5, 6
  int_list.pop_back();
  for (auto& element : int_list) cout << element << " ";
  cout << endl;
  // 2, 3, 4, 5, 6
  int_list.pop_front();
  for (auto& element : int_list) cout << element << " ";
  cout << endl;
  // 3, 4, 5, 6
  auto begin = int_list.begin();
  int_list.erase(begin++);
  for (auto& element : int_list) cout << element << " ";
  cout << endl;
  // 6
  auto end = int_list.end();
  int_list.erase(begin, --end);
  for (auto& element : int_list) cout << element << " ";
  cout << endl;
  // empty
  int_list.clear();
  for (auto& element : int_list) cout << element << " ";
  cout << "empty" << endl;

  return 0;
}

```

### 9.3.4 特殊的 forward_list 操作

_forward_list_ 是单向链表，因此在添加和删除元素时是在指定位置的后面添加或删除，标准库为 _forward_list_ 提供了特殊版本的插入与删除操作。

:::center

| 操作                                                                                                                                          | 说明                                                         |
| :-------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
| l.before_begin() <br> l.cbefore_begin()                                                                                                       | 首元素之前的迭代器/常迭代器                                  |
| l.insert_after(it, element) <br> l.insert_after(it, n, element) <br> l.insert_after(it, begin, end) <br> l.insert_after(it, initializer_list) | 在迭代器 it 之后插入元素                                     |
| emplace_after(it, args)                                                                                                                       | 在迭代器 it 后插入使用构造函数创建元素                       |
| l.erase_after(it)                                                                                                                             | 删除迭代器 it 之后的元素，返回下一个有效的迭代器             |
| l.erase_after(begin, end)                                                                                                                     | 删除迭代器范围 [begin, end) 中的元素，返回下一个有效的迭代器 |

:::

### 9.3.5 改变容器大小

通过 "resize" 操作可以扩大或者缩小容器，"resize" 并不改变容器的大小，它只是改变容器中实际的元素数量。

:::center

| 操作                                        | 说明                                                                                                                                        |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| c.resize(n)<sub>(array 不支持)</sub>        | 调整容器 c 的元素个数为 n 个，<br>如果调整前元素个数 &gt; n， 则删除多余元素；<br>如果调整前元素个数 &lt; n，则以值初始化形式添加新的元素   |
| c.resize(n, value)<sub>(array 不支持)</sub> | 调整容器 c 的元素个数为 n 个，<br>如果调整前元素个数 &gt; n，则删除多余元素 <br>如果调整前元素个数; &lt; n，则以 value 为初始值添加新的元素 |

:::

### 9.3.6 容器操作可能导使迭代器失效

容器的迭代器并非一直有效，当容器内元素发生真的变化后，其迭代器可能发生不同程度的失效。借用 zh.cppreference.com/w/cpp/container 中的表格，其中的关联容器和无序关联容器在后面的章节会进一步介绍。

<table class="wikitable" style="font-size:0.8em; line-height:1em; text-align: center;">

<tbody><tr style="border: .3px solid #e9e9e9 ;">
<th rowspan="2"> 类别
</th>
<th rowspan="2"> 容器
</th>
<td colspan="2"> <b>插入</b>后
</td>
<td colspan="2"> <b>擦除</b>后
</td>
<th rowspan="2"> 条件
</th></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<td> <b>迭代器</b>合法？
</td>
<td> <b>引用</b>合法？
</td>
<td> <b>迭代器</b>合法？
</td>
<td> <b>引用</b>合法？
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th rowspan="8"> 顺序容器
</th>
<th> array
</th>
<td colspan="2" style="background: #ececec; color: grey; vertical-align: middle; text-align: center;" class="table-na"> <small>N/A</small>
</td>
<td colspan="2" style="background: #ececec; color: grey; vertical-align: middle; text-align: center;" class="table-na"> <small>N/A</small>
</td>
<td>
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th rowspan="3"> vector
</th>
<td colspan="2" style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td colspan="2" style="background: #ececec; color: grey; vertical-align: middle; text-align: center;" class="table-na"> <small>N/A</small>
</td>
<td> 插入更改容量
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<td colspan="2" style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td> 被修改元素前
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<td colspan="2" style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td colspan="2" style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td> 于被修改元素或其后
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th rowspan="2"> deque
</th>
<td rowspan="2" style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #ffff90; color: black; vertical-align: middle; text-align: center;" class="table-maybe">是，除了被擦除元素
</td>
<td> 修改首或尾元素
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<td style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td colspan="2" style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td> 仅修改中部
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th> list
</th>
<td colspan="2" style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #ffff90; color: black; vertical-align: middle; text-align: center;" class="table-maybe">是，除了被擦除元素
</td>
<td>
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th> forward_list
</th>
<td colspan="2" style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #ffff90; color: black; vertical-align: middle; text-align: center;" class="table-maybe">是，除了被擦除元素
</td>
<td>
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th> 关联容器
</th>
<th> set
<p>multiset
</p><p>map
</p><p>multimap
</p>
</th>
<td colspan="2" style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #ffff90; color: black; vertical-align: middle; text-align: center;" class="table-maybe">是，除了被擦除元素
</td>
<td rowspan="1">
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<th rowspan="2"> 无序关联容器
</th>
<th rowspan="2"> unordered_set
<p>unordered_multiset
</p><p>unordered_map
</p><p>unordered_multimap
</p>
</th>
<td style="background:#ff9090; color:black; vertical-align: middle; text-align: center;" class="table-no"> 否
</td>
<td rowspan="2" style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #ececec; color: grey; vertical-align: middle; text-align: center;" class="table-na"> <small>N/A</small>
</td>
<td> 插入导致重哈希
</td></tr>
<tr style="border: .3px solid #e9e9e9 ;">
<td style="background: #90ff90; color: black; vertical-align: middle; text-align: center;" class="table-yes">是
</td>
<td colspan="2" style="background: #ffff90; color: black; vertical-align: middle; text-align: center;" class="table-maybe">是，除了被擦除元素
</td>
<td> 无重哈希
</td></tr></tbody></table>

:::danger

使用失效的迭代器、指针或引用是严重的运行时错误！由于向容器中增加或者删除元素可能会导致迭代器失效，因此必须保证每次改变容器的操作后更新迭代器。特别地，无论增加还是删除元素 end 迭代器总是会失效。

:::

```cpp{11,15,19}
#include <iostream>
#include <vector>

using namespace std;

int main(int argc, char** argv) {
  vector<int> v{1, 2, 3, 4};
  auto it = v.begin();
  // 删除第二个元素后的迭代器都失效, 但是 erase
  // 返回下一个有效的迭代器，因此可以直接更新 it
  it = v.erase(++it);
  std::cout << *it << std::endl;  // 3
  vector<int> v1{66, 77, 88};
  // insert 在指定迭代器之前插入，返回新插入的第一个元素的迭代器
  it = v.insert(it, v1.begin(), v1.end());
  std::cout << *it << std::endl;  // 66
  // 包含 3 个新增元素，由于在指定迭代器之前插入，因此只有递增 4
  // 次才能访问到原容器中下一个待处理的元素
  ++ ++ ++ ++it;
  std::cout << *it << std::endl;  // 4
  return 0;
}

```

## 9,4 vector 对象是如何增长的

vector 支持随机访问，容器内的元素在内存中连续存储。当增加新的元素时，如果容器中没有空间容纳这个新的元素，因此必须将容器进行扩容。扩容的方式是按照容器现有容量的 1.5 倍或 2 倍开辟新的空间，然后将所有元素拷贝到新的内存中。

:::center

| 操作                                                        | 说明                               |
| :---------------------------------------------------------- | :--------------------------------- |
| c.shrink_to_fit() <sub>(仅适用于 vector/string/deque)</sub> | 将容器的 capacity 调整为 size 一样 |
| c.capacity() <sub>(仅适用于 vector/string)</sub>            | 获取容器的容量大小                 |
| c.reserve(n) <sub>(仅适用于 vector/string)</sub>            | 提前分配至少 n 个元素的内存空间    |

:::

size 表明容器已经存在的元素个数，而 capacity 则表明容器最大可以容纳多少个元素。只有在以下情况下会重新分配空间：

- 插入元素时，原有空间无法容纳新的元素
- 调用 "resize" 或者 "reserve" 操作时，指定的大小超过了容器原有的容量

重新分配空间取决于编译器实现，尽管分配策略有所不同，但是所有实现基本都保证了容器的 "push<span>\_</span>back" 操作是 O(1) 的平均时间复杂度，即通过初始化一个空 _vector_ 后通过调用 n 次 "push<span>\_</span>back" 创建 n 个元素所花费的时间不能超过 n 的常数倍。

## 9.5 额外的 string 操作

C++ Primer 5 中写了这么一句话：

> 由于函数过多，本节初次阅读可能会令人心烦。

我能说整本书初看时都会令人心烦吗？🤣

### 9.5.1 构造 string 的其他方法

第三章介绍了 [定义和初始化 string 对象](chapter3.md/#321-定义和初始化-string-对象) 的基本方法，本节介绍一些其他方法，这些构造函数还接受一个 _const char \*_ 参数：

:::center

| 操作                 | 说明                                                                                                                            |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| string s(p, n)       | 使用字符数组 p 的前 n 个字符初始化，<br> p 至少保证 n 个字符                                                                    |
| string s(s2, pos)    | 使用字符串 s2 的下标为 pos 开始的字符串构造字符串 s，<br>如果下标越界则该行为未定义，默认拷贝到字符串 s2 结尾                   |
| string s(s2, pos, n) | 使用字符串 s2 的下标为 pos 开始的 n 个字符构造字符串 s，<br>如果下标越界则该行为未定义，同时最多只能拷贝 s2.size() - pos 个字符 |
| s.substr(pos, n)     | 获取 _string_ 的子串，子串由从 pos 开始的 n 个字符组成                                                                          |

:::

当接受 _const char \*_ 参数时，如果没有指定拷贝多个字符，则指针指向的数组必须以空字符结尾，否者将是未定义的行为。

### 9.5.2 改变 string 的其他方法

:::center

| 操作                   | 说明                                                                                                                                        |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| s.insert(pos, args)    | 在 pos 之前插入 args 指定的字符，pos 可以是下标或迭代器。<br>如果是下标则返回指向 s 的引用；<br>如果是迭代器则返回第一个插入字符的迭代器    |
| s.erase(pos, n)        | 删除从 pos 开始的 n 个字符，返回指向 s 的引用                                                                                               |
| s.assign(args)         | 将 s 的内容替换为 args 指定的字符，返回指向 s 的引用                                                                                        |
| s.append(args)         | 在 s 末尾追加 args，返回指向 s 的引用                                                                                                       |
| s.replace(range, args) | 删除 s 中范围 range 中的字符，<br> 替换为 args 指定的字符，返回指向 s 的引用。<br>range 可以是一个下标 + 长度 或者是一个指向 s 的迭代器范围 |

:::

### 9.5.3 string 搜索操作

_string_ 的搜索函数操作都返回一个 _string::size_type_ 值，表示匹配发生时的下标位置，如果搜索失败，则返回一个静态成员 _string::npos_ (==初始值为 -1，且类型为 _const string::size_type_==)。

:::center

| 操作                      | 说明                                                |
| :------------------------ | :-------------------------------------------------- |
| s.find(args               | 查找 s 中指定 args 第一次出现的位置                 |
| s.rfind(args)             | 查找 s 中指定 args 最后一次出现的位置               |
| s.find_first_of(args)     | 查找 s 中指定 args 中任何一个字符第一次出现的位置   |
| s.find_last_of(args)      | 查找 s 中指定 args 中任何一个字符最后一次出现的位置 |
| s.find_fisst_not_of(args) | 查找 s 第一个不存在于 args 中的字符                 |
| s.find_last_not_of(args)  | 查找 s 中最后一个不存在于 args 中的字符             |

:::

### 9.5.4 compare 函数

标准库提供了一组字符串的比较操作，类似于 "strcmp"，根据 s 是否 "等于"，"大于", "小于" 指定的参数而返回 0, 正数和负数。

:::center

| 操作                                                | 说明                                                                                              |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| s.compare(s2)                                       | 比较 s 和 s2                                                                                      |
| s.compare(pos, n, s2)                               | 将 s 从 pos 开始的 n 个字符与 s2 进行比较                                                         |
| s.compare(pos, n, s2, s2_pos, s2_n)                 | 将 s 从 pos 开始的 n 个字符与 s2 从 s2_pos 开始的 s2_n 个字符进行比较                             |
| s.compare(const_char_ptr)                           | 将 s 与 const_char_ptr 指向的字符数组比较                                                         |
| s.compare(pos, n, const_char_ptr)                   | 将 s 从 pos 开始的 n 个字符与 const_char_ptr 指向的字符数组比较                                   |
| s.compare(pos, n, const_char_ptr, const_char_ptr_n) | 将 s 从 pos 开始的 n 个字符与 const_char_ptr 指向的字符数组开始的 const_char_ptr_n 个字符进行比较 |

:::

### 9.5.5 数值转换

新标准库中引入了一些可以轻松实现数值类型与字符串类型相互转换的函数 <Badge text="C++11" type="info" />。要转换为数值，要求 _string_ 中第一个非空白字符必须是数值类型中可能出现的字符，例如 +, -, 0x, 0X .等。

:::center

| 操作                                                                                                                  | 说明                                                                               |
| :-------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| to_string(value)                                                                                                      | 转换为 value 对应的字符串                                                          |
| stoi(s, ptr, base) <br>stol(s, ptr, base) <br> stoul(s, ptr, base) <br> stoll(s, ptr, base) <br> stoull(s, ptr, base) | 将字符串 s 转换为以 base 为基数的整型数值，<br> ptr 用于保存第一个非数值字符的下标 |
| stof(s, ptr) <br> stod(s, ptr) <br> stold(s, ptr)                                                                     | 将字符换 s 转换为对应的浮点数类型，<br> ptr 用于保存第一非数值字符的下标           |

:::

## 9.6 容器适配器

标准库定义三个顺序容器的适配器: _stack_, _queue_, _priority<span>\_</span>queue_。以下为所有容器都支持的操作

:::center
|操作|说明|
|:---|:----|
|a.empty()|判断适配器是否为空|
|a.size()|返回适配器中元素个数|
|swap(a,b) <br> a.swap(b)|交换两个适配器中元素，<br>a 和 b 的适配器类型、容器类型、元素类型必须相同|

:::

_stack_ 表示栈，先入后出, 基于 _deque_ 顺序容器实现。

:::center
|操作|说明|
|:----|:---|
|s.pop()| 删除栈顶元素|
|s.push(item) <br> s.emplace(args)| 创建一个元素 item 压入栈顶|
|s.top()| 返回栈顶元素|

:::

_queue_ 表示队列，先入先出，基于 _deque_ 顺序容器实现，_priority_queue_ 表示优先队列，基于 _vector_ 的二叉堆实现。

:::center

| 操作                                         | 说明                                                |
| :------------------------------------------- | :-------------------------------------------------- |
| q.pop()                                      | 删除队首的元素或者堆顶的元素                        |
| q.push(item) <br> q.emplace(args)            | 在队列末尾添加元素 item 或者往堆里添加一个元素 item |
| q.top() <sub>(只适用于 priority_queue)</sub> | 返回堆顶的元素                                      |
| q.front() <sub>(只适用于 queue)</sub>        | 返回队首元素                                        |
| q.back() <sub>(只适用于 queue)</sub>         | 返回队尾元素                                        |

:::
