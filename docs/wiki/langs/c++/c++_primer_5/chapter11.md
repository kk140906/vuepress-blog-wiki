---
title: 11. 关联容器
order: 11
category:
  - C++
tag:
  - map
  - set
  - unordered_map
  - unordered_set
article: false
date: 2017-09-21
---

## 11.1 使用关联容器

关联容器主要划分为两大类：_map_ 和 _set_，而其中又分为有序关联容器和无序关联容器，进一步又划分为是否允许重复元素。总体而言关联容器主要包含以下几个：

- map: 有序关联数组，键值对(key-value)，key 不可重复
- multimap: key 可重复的有序关联数组
- set: 有序集合, 关键字就是值，key 不可重复
- multiset: key 可重复的有序集合
- unordered_map: 无序关联数组, key 不可重复
- unordered_multimap: key 可重复的无序关联数组
- unordered_set: 无序集合, key 不可重复
- unordered_multiset: key 可重复的无序集合

有序关联容器底层数据结构为红黑树，而无序关联容器底层数据结构为哈希表。

## 11.2 关联容器概述

### 11.2.1 定义关联容器

定义一个 _map_ 时必须既指明关键字类型又指明值类型，初始化一个 _map_ 时需要将 key-value 包裹在花括号中，而定义一个 _set_ 时只需指明关键字类型即可。

```cpp
map<string, int> wordCounts = {
  {"hello", 13},
  {"world", 23}
};

set<string> words = {"hello", "world"};
```

### 11.2.2 关键字类型的要求

关联容器的关键字都有一定的限制，对于有序关联容器，_map_, _set_, _multimap_, _multiset_ 必须定义元素比较的方法，默认情况下，标准库使用 &lt; 运算符来比较两个 key。可以在定义的时候提供自己定义的操作来代替 key 的比较运算。所提供的操作在 key 的比较上必须是 "严格弱序 (类似于小于等于运算符)"，需要具备以下性质：

- 两个 key 不能同时 "小于等于" 对方；
- 如果 key1 "小于等于" key2，且 key2 "小于等于" key3，那么 key1 "小于等于" key3；
- 如果存在两个 key，任何一个都不 "小于等于" 另一个，那么这两个 key 是等价的。

```cpp

bool comp (int lhs, int rhs) { return lhs < rhs; }

// 自定义比较函数
map<int, int, decltype(comp)*> m(comp);

```

### 11.2.3 pair 类型

在 utility 头文件中定义了一个 _pair_ 的标准库类型，这个类型保存两个数据成员，创建一个 _pair_ 时必须指定两个数据成员的类型。_pair_ 的默认构造函数对数据成员进行值初始化。以下为 _pair_ 提供的常见操作：

:::center

| 操作                                                                                       | 说明                                              |
| :----------------------------------------------------------------------------------------- | :------------------------------------------------ |
| pair &lt;T1, T2&gt; p                                                                      | 创建一个 pair，两个数据成员类型分别为 T1, T2      |
| pair &lt;T1, T2&gt; p(v1, v2) <br> pair &lt;T1, T2&gt; p = {v1, v2} <br> make_pair(v1, v2) | 创建一个 pair，使用 v1, v2 分别初始化两个数据成员 |
| p.first                                                                                    | pair p 的第一个数据成员                           |
| p.second                                                                                   | pair p 的第二个数据成员                           |

:::

## 11.3 关联容器操作

关联容器中有三个额外的类型别名：

- key_type：关键字 key 的类型
- mapped<span>\_</span>type：与关键字 key 关联的类型，只适用于 _map_
- value<span>\_</span>type：对于 _set_，与 key<span>\_</span>type 相同，对于 _map_ ，为 pair &lt;const key_type, mapped_type&gt;

### 11.3.1 关联容器迭代器

解引用一个关联容器的迭代器时，会得到一个 value_type 类型的容器。

_set_ 的迭代器是 _const_ 类型，只允许通过这个迭代器访问 _set_ 的元素。

可以通过迭代器遍历 _map_, _set_ ，尽管可以通过迭代器遍历关联容器，我们通常也不会对关联容器使用泛型算法。在实际的开发中，对关联容器使用泛型算法通常用作输入序列，或者作为一个目的位置配合插入迭代器使用。

### 11.3.2 添加元素

关联容器添加元素的操作如下：

:::center

| 操作                                               | 说明                                                                                                                           |
| :------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| c.insert(v) <br>c.emplace(args)                    | 插入一个 value_type 的对象 v，或者通过 args 构造，返回一个 pair。<br/>第一个数据为指向关键字的迭代器，第二个数据为插入的结果。 |
| c.insert(begin, end)<br>c.insert(initializer_list) | 将迭代器范围 [begin, end) 或者 initializer_list 内的元素插入到容器中                                                           |
| c.insert(it, v) <br>c.emplace(it, args)            | 从迭代器 it 开始搜索新元素插入的位置                                                                                           |

:::

### 11.3.3 删除元素

关联容器定义了三个版本的 "erase" 操作。

:::center

| 操作                | 说明                                                           |
| :------------------ | :------------------------------------------------------------- |
| c.erase(key)        | 删除容器 c 中的所有关键字为 key 的元素，返回被删除的元素的数量 |
| c.erase(it)         | 删除迭代器 it 指定的元素，返回下一个有效元素的迭代器           |
| c.erase(begin, end) | 删除迭代器范围 [begin, end) 中的元素                           |

:::

### 11.3.4 map 的下标操作

_map_ 和 _unordered_map_ 容器提供了下标运算符和 "at" 操作，_set_, _multimap_, _unordered_multimap_ 类型不支持下标。 _map_ 和 _unordered_map_ 的下标操作比较特殊，当 key 不存在容器中时则会创建一个元素插入到容器中，由于下标运算符可能插入一个新元素，因此**只能对非 _const_ 类型的 _map_ 使用下标操作**。

与普通容器下标操作不同的是，_map_ 和 _unorderd_map_ 的下标操作返回的是 _mapped_type_ 的类型，而解引用一个 map 会得到 _value_type_ 的类型。

:::center

| 操作       | 说明                                                                 |
| :--------- | :------------------------------------------------------------------- |
| c[key      | 返回关键字为 key 对应的元素                                          |
| c\.at(key) | 返回关键字为 key 对应的元素，如果 key 不存在则抛出 out_of_range 异常 |

:::

### 11.3.5 访问元素

关联容器提供一组查找容器元素的操作：

:::center

| 操作               | 说明                                                                             |
| :----------------- | :------------------------------------------------------------------------------- |
| c.find(key)        | 返回一个迭代器，指向第一个关键字为 key 的元素，若 key 不在容器中则返回尾后迭代器 |
| c.count(key)       | 返回关键字与 key 相等的元素数量                                                  |
| c.lower_bound(key) | 返回一个迭代器，指向第一个关键字不小于 key 的元素                                |
| c.upper_bound(key) | 返回一个迭代器，指向第一个关键字大于 key 的元素                                  |
| c.equal_range(key) | 返回一个迭代器 pair，表示管子等于 key 的元素范围                                 |

:::

## 11.4 无序容器

无序容器基于哈希思想，在存储上组织为一组桶，每个桶保存 0 个或者多个元素，无序容器使用一个哈希函数将元素映射到桶。为了访问一个元素，容器首先计算元素的哈希值，它指出应该搜索哪个桶。

:::center

| 操作                        | 说明                                                                              |
| :-------------------------- | :-------------------------------------------------------------------------------- |
| c.bucket_count()            | 正在使用的桶数目                                                                  |
| c.max_bucket_count()        | 容器能容纳的最多的桶的数量                                                        |
| c.bucket_size(n)            | 第 n 个桶的元素数量                                                               |
| c.bucket(key)               | 以 key 为关键字的元素在哪个桶中                                                   |
| c.begin(n) <br> c.cbegin(n) | 第 n 个桶中元素的首迭代器                                                         |
| c.end(n) <br> c.end(n)      | 第 n 个桶中元素的尾后迭代器                                                       |
| c.load_factor()             | 每个桶的平均元素数量                                                              |
| c.max_load_factor()         | 平均桶大小，在需要时添加新的桶，<br> 保证 load_factor <= max_load_factor          |
| c.rehash(n)                 | 重组存储，使得 bucket_count >= n，<br> 并且 bucket_count > size / max_load_factor |
| c.reserve(n)                | 重组存储，使用容器可以 n 个元素且不比 rehash                                      |

:::

默认情况下，无序容器使用关键字的 == 运算符比较元素，同时还使用 hash&lt;key_type&gt;类型的对象生成每个元素的哈希值。标准库为内置类型提供了 hash 模板，而对于自定义的类型，需要重载哈希计算函数。

```cpp
size_t hasher() { return hash<string>()("hello world"); }

unordered_map<Foo, decltype(hasher)*> foo(10, hasher);
```
