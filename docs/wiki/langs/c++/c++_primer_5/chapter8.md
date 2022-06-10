---
title: 8. IO 库
order: 8
category:
  - C++
tag:
  - I/O 类
  - 输入输出流
  - string 流
article: false
date: 2017-09-10
---

## 8.1 IO 类

为了支持不同种类的 IO 处理操作, C++ 针对三种常见类型 (宽字符一般用的不多，不多介绍) 的 IO 进行了分别处理，其中：

1. iostream 用于处理基本的读写流；
   - istream: 从流中读取数据
   - ostream: 向流中写入数据
   - iostream: 读写流
2. fstream 用于处理文件类型；
   - ifstream: 从文件读取数据
   - ofstream: 向文件写入数据
   - fstream: 读写文件流
3. sstream 用于处理 string 对象类型。
   - istringstream: 从 string 读写数据
   - ostringstream: 向 string 写入数据
   - stringstream: 读写 string

### 8.1.1 IO 对象无拷贝或赋值

IO 对象不能被拷贝，也不能被重新赋值，这在后面介绍右值引用时会进一步解释。

:::note

IO 流对象不能被拷贝和赋值，意味着我们在函数调用和返回时都不能直接传递流对象，因此更多的是以引用形式传递流对象，而同时，读写流会改变流的状态，因此也不能被 _const_ 关键字所限定。

:::

### 8.1.2 条件状态

IO 流可能发生错误，一些错误是可恢复的，而有一些错误则不可恢复，IO 流一旦发生错误，那么其后续的所有操作都会失败，因此 IO 类定义了一些函数或者标志来访问和操作流的条件状态。

IO 库定义了 4 个与机器相关的 iostate 类型的 _constexpr_ 值：

1. badbit：不可恢复的系统级错误
2. failbit: 可恢复的读写错误
3. eofbit: 到达文件结束位置，与此同时 failbit 也会被置位
4. goodbit: 没有错误发生

这 4 个 iostate 类型的值属于位集合，可以结合位运算一次性检测或者设置多个标志位，以下几个函数是常用于检测流状态:

:::center

| 操作             | 说明                                           |
| :--------------- | :--------------------------------------------- |
| s.eof()          | 流 s 的 eofbit 被置位则返回 _true_             |
| s.bad()          | 流 s 的 badbit 被置位则返回 _true_             |
| s.fail()         | 流 s 的 badbit 或 failbit 被置位则返回 _true_  |
| s.good()         | 流 s 没有错误则返回 _true_                     |
| s.clear()        | 将流 s 所有标志位复位                          |
| s.clear(flags)   | 将流 s 指定的 flags 复位,可结合位运算一起操作  |
| s.setsate(flags) | 将流 s 指定的 flags 置位，可结合位运算一起操作 |
| s.rdstate()      | 返回流 s 的当前状态                            |

:::

:::tip

检测流状态是否正常通常使用的是 "s.good()" 和 "s.fail()" 方法。

:::

### 8.1.3 管理输出缓冲

每个输出流输出的内容都会先输出到缓冲区中，这是由于操作系统优化了写操作，避免频繁的进行内核的系统调用导致系统性能降低。缓冲区中的内容要写入到控制台或者文件需要刷新缓冲区，以下常见情况会导致缓冲区刷新：

- 程序正常结束, main 函数的 _return_ 操作会刷新缓冲区
- 缓冲区满了会主动刷新缓冲区
- 使用 _endl_, _ends_, _flush_, _unitbuf_ 等操作符显式刷新。通常，设置 _unitbuf_ 操作符后，每次输出操作都会刷新缓冲区，因此 cerr 流才会立即显示错误
- 将输出流绑定到其他流，当读写其他流时会刷新输出缓冲区，例如将 cout 绑定到 cin 和 cerr 中，读写 cin 和 cerr 都会导致 cout 的缓冲区被刷新

:::warning

如果程序异常终止了，输出的缓冲区不会被刷新。

:::

默认情况下，标准库将 cin 绑定到了 cout，因此每次读写 cin 都会刷新 cout 的缓冲区。我们可以利用流对象的 _tie_ 方法来控制流绑定，每个流只能绑定到一个输出流上。

- s.tie(): 如果流 s 绑定到了一个输出流，那么返回这个被绑定的输出流指针，否则返回 _nullptr_
- s.tie(os): 将流 s 绑定到输出流 os 中, 如果 os 为 _nullptr_ 则表明流 s 不绑定到其他流

:::note

在使用 C++ 做算法题目时由于数据集通常比较大，输入输出可能会非常耗时，因此可以看到很多人都会通过 `cin.tie(nullptr); cout.tie(nullptr);` 取消输入输出的同步。

:::

## 8.2 文件输入输出

### 8.2.1 使用文件流对象

文件的输入与输出是通过 _fstream_ 及其派生的 _ifstream_ 和 _ofstream_ 来完成的，由于 _iostream_ 作为 _fstream_ 的基类，因此很多使用 _iosteam_ 对象的地方都可以使用 _fstream_ 对象作为替代。除了 _iostream_ 的行为外， _fstream_ 提供了一些独特的操作。

:::center

| 操作                    | 说明                                         |
| :---------------------- | :------------------------------------------- |
| fstream fs;             | 创建一个未绑定的文件流 fs                    |
| fstream fs(file);       | 创建一个文件流 fs，同时打开文件 file         |
| fstream fs(file, mode); | 创建一个文件流 fs，以指定 mode 打开文件 file |
| fs.open(file)           | 使用文件流 fs， 打开文件 file                |
| fs.close()              | 关闭文件流 fs 打开的文件                     |
| fs.is_open()            | 判断与文件流 fs 关联的文件是否被打开成功     |

:::

文件流对象的 "open" 操作实际是将文件流对象与一个文件关联起来，而且一个文件流在同一时刻只能与一个文件关联，如果需要将文件流绑定到其他文件需要先将原来的文件关闭。如果关联文件的打开过程中出现错误，会将 failbit 标志位置位。换言之，打开一个已经被打开的文件会导致 failbit 置位。

```cpp{9,13,17,19}
#include <fstream>
#include <iostream>

using namespace std;
int main(int argc, char *argv[]) {

  ifstream ifs;

  ifs.open("test.txt");
  if (!ifs.is_open())
    exit(-1);
  cout << "open test.txt suscceed" << endl;
  ifs.open("test.txt");
  if (ifs.fail())
    cout << "open test.txt duplicately" << endl;

  ifs.clear(); // 清除状态

  ifs.open("other.txt");
  if (ifs.fail()) {
    cout << "open other.txt failed";
  }
  return 0;
}
```

:::note

为了避免忘记手动关闭文件流对象所绑定的文件，因此标准库在实现时保证了一个 _fstream_ 对象离开作用域被销毁时会自动调用 "close" 来关闭文件。

:::

### 8.2.2 文件模式

每个流都有一个关联的文件模式：

- **in**: 以输入方式打开文件，读文件，只能用于 _ifstream_, _fstream_
- **out**: 以输出方式打开文件，写文件，会清空所有数据，只能用于 _ofstream_, _fstream_
- **trunc**: 必须先设置 out 模式才能设置该模式，截断文件
- **app**: 在文件末尾写，默认以输出方式打开文件
- **ate**: 打开文件后定位到末尾，可以与任意文件模式组合使用
- **binary**: 以二进制形式进行 IO 操作，可以与任意文件模式组合使用

:::tip

out 模式会截断文件，要保留文件内容只能显式指定 app 模式或者 in 模式。in, out 组合模式可以同时读写文件，且保证内容不丢失。默认情况下, _ofstream_ 对象的文件模式为 out，_ifstream_ 对象的文件模式为 in，_fstream_ 对象的文件模式为 in, out 模式。

:::

## 8.3 string 流

_sstream_ 的操作对象是 _string_ 对象，由于 _iostream_ 作为 _sstream_ 的基类，因此很多使用 _iosteam_ 对象的地方都可以使用 _sstream_ 对象作为替代。除了 _iostream_ 的行为外， _sstream_ 提供了一些独特的操作。

:::center

| 操作           | 说明                                           |
| :------------- | :--------------------------------------------- |
| sstream ss;    | 创建一个未绑定的字符串流 ss                    |
| sstream ss(s); | 创建一个字符串流 ss，同时将其关联字符串 s      |
| ss.str()       | 获取字符串流 ss 中所保存的 _string_ 对象的拷贝 |
| ss.str(s)      | 将字符串 s 拷贝到字符串流 ss 中                |

:::

### 8.3.1 使用 istringstream

_istringstream_ 常用于文本的行处理中，能够从一串字符串中多次读取结果。

```cpp{11,12}

#include <iostream>
#include <sstream>
#include <string>

using namespace std;

int main(int argc, char **argv) {
  string msg = "hello world 2333";
  string word;
  istringstream is(msg);
  while (is >> word)
    cout << "word: " << word << endl;
  cout << endl;
  return 0;
}

```

### 8.3.2 使用 ostringstream

_ostringstream_ 常用于构建输出，将所有要输出的字符串缓存起来，最后一起输出。

```cpp{12,15}

#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

int main(int argc, char **argv) {
  vector<string> msg{"hello", "world", ",",   "today", "is",
                     "a",     "good",  "day", "!"};
  ostringstream os;
  for (string s : msg)
    os << s << " ";
  cout << os.str() << endl;
  return 0;
}
```
