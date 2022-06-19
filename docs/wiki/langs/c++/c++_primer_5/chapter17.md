---
title: 17. 标准库特殊设施
order: 17
category:
  - C++
tag:
  - tuple
  - bitset
  - 正则表达式
  - 随机数
article: false
date: 2017-09-30
---

## 17.1 tuple 类型

_tuple_ 与 _pair_ 类似，都能包含不同类型的成员，但 _pair_ 只能包含两个成员，而 _tuple_ 却能包含任意数量的成员，一旦一个 _tuple_ 类型确定了，那它的成员数量及类型也就确定了。

:::center

| 操作                                   | 说明                                                                                                                     |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| tuple&lt;T1,T2,...Tn&gt; t             | 创建 n 个值初始化的 tuple 对象 t                                                                                         |
| tuple&lt;T1,T2,...Tn&gt; t(v1,v2,..vn) | 用 n 个对象去<b>显式初始化</b>tuple 对象 t                                                                               |
| make_tuple(v1,v2,..vn)                 | 返回一个给定初始值初始化的 tuple 对象                                                                                    |
| t1 == t2 或者 t1 != t2                 | 比较两个 tuple 对象是否相等，只有当两个 tuple 对象对应的成员全部相等时两个 tuple 才相等,而且对应成员必须保证==操作是合法 |
| t1 relop t2                            | 采用字典序进行关系运算，两个 tuple 对象必须具备相等数量的成员，而且成员必须具备 &lt; 运算符                              |
| get&lt;i&gt;(t)                        | 返回 tuple 对象 t 的第 i 个数据成员的引用，t 是左值时返回左值引用，否则返回右值引用，tuple 所有成员都是<b>public</b>的   |
| tuple_size&lt;tupleType&gt;::value     | 获取一个 tuple 类型对象中成员的数量                                                                                      |
| tuple_element&lt;i,tupleType&gt;::type | 获取一个给定 tuple 类型对象中第 i 个数据成员的类型                                                                       |

:::

### 17.1.1 定义和初始化 tuple

定义一个 _tuple_ 时，需要指出其每个成员的类型，成员的类型一旦确定，那么 _tuple_ 的成员数量就确定了。_tuple_ 有两个构造函数，默认构造函数执行值初始化，而接受给定成员初始值的构造函数是显式的。此外，标准库还提供了 "make<span>\_</span>tuple" 操作，返回一个给定初始值的 _tuple_ 对象，其成员的类型根据初始值的类型进行推断。

如果要访问 _tuple_ 的元素只能通过 "get" 方式，"get" 是一个函数模板，必须显式指定需要访问的元素位置，同时要求指定的位置必须是常量表达式，而 _tuple_ 类型根据函数实参进行推断。

如果要获取 _tuple_ 的成员个数及类型需要使用 "tuple<span>\_</span>size" 和 "tuple<span>\_</span>element"，而这两个操作都需要提供 _tuple_ 的类型，可以通过 _decltype_ 对 _tuple_ 对象进行推断得到 _tuple_ 的类型信息。

```cpp
// 默认构造函数
tuple<int,double,std::pair<std::string,float>> t1;
// 显式初始化构造函数
tuple<int,float> t2(3,3.14);
// make_tuple初始化构造
auto t3 = make_tuple(3,"hello");
// get获取t2的第2个成员,位置从0开始计数
auto element2 = get<1>(t2);
// 获取tuple的成员个数,tuple类型通过decltype进行推断
auto counts = tuple_size<decltype(t1)>::value;
// 获取tuple的第1个成员类型,tuple类型通过decltype进行推断
using element1_type = tuple_element<0,decltype(t2)>::type
```

### 17.1.2 使用 tuple 返回多个值

_tuple_ 的常见用途是返回从一个函数返回多个值。

```cpp
using ResultType = tuple<int,double>;
ResultType func(){
  return make_tuple(3,3.14);
}
```

## 17.2 bitset 类型

### 17.2.1 定义和初始化 bitset

_bitset_ 类是一个类模板，具有固定大小。当定义一个 _bitset_ 时，需要声明它含有多少个二进制位，声明的大小必须是一个常量表达式。二进制位的位置从 0 开始编号的，编号为 0 开始的二进制位被称之为 “**低位**”，标号从 0 开始到最后一位的二进制位被称之为 “**高位**”。

:::center

| 操作                                 | 说明                                                                                                                                                                                                                                                                                          |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bitset&lt;n&gt; b;                   | 创建一个 n 位的 bitset 对象，每一位都初始化为 0，<br/> 此构造函数是 _constexpr_ 类型                                                                                                                                                                                                          |
| bitset&lt;n&gt; b(u)                 | 创建一个 n 位的 bitset 对象，<br/> 每一位都是由 _unsigned long long_ 的对象 u 拷贝得到，<br/> 如果 n 超过 _unsigned long long_，则超过部分高位被置为 0。<br/> 此构造函数是 _constexpr_ 类型                                                                                                   |
| bitset&lt;n&gt; b(s,pos,m,zero,one)  | 从 string 对象 s 的 pos 开始拷贝 m 个字符创建 bitset 对象。<br/> 如果 n 比字符串长度大，则 bitset 的高位被置为 0。<br/> 而对象 s 只能包含字符 zero 和 one,如果包含其他字符，<br/> 构造函数会抛出 invalid_argument 异常。<br/> pos 默认为 0,m 默认为 string::npos,zero 默认为'0',one 默认为'1' |
| bitset&lt;n&gt; b(cp,pos,m,zero,one) | 从字符数组 cp 的 pos 开始拷贝 m 个字符创建 bitset 对象。<br/> 如果未提供 m，则 cp 必须指向一个 c 风格字符串。<br/> 如果提供 m，则从 cp 开始必须至少有 m 个 zero 或 one 字符                                                                                                                   |

:::

当使用整数初始化 _bitset_ 时，整型数值会被转型为 _unsigned long long_。当使用 string 或者一个字符数组指针来初始化 _bitset_ 时，==**字符串中的下标最小的字符对应 bitset 的高位**==。

```cpp
bitset<5> bitvec1; // bitvec1值的二进制序列-00000
bitset<5> bitvec2(-1); // bitvec2值的二进制序列-11111
// 0ULL在64位系统中是64个0 bit,bitvec3的二进制序列为0-63位为1,63-127位为0
bitset<128> bitvec3(~0ULL)
bitset<32> bitvec4("1100"); // bitvec4的二进制序列为-1100

string str("110100011101");
bitset<32> bitvec5(str,5,4); // bitvec5的二进制序列为-0011
bitset<32> bitvec5(str,str.size() - 4); // bitvec5的二进制序列为-1101
```

### 17.2.2 bitset 操作

_bitset_ 定义了多种检测或设置一个或多个二进制位的方法。

:::center

| 操作                             | 说明                                                                                                                                               |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| b.any()                          | 如果 b 中任意位置被置位,则返回 true                                                                                                                |
| b.all()                          | 如果 b 中所有位置被置位,则返回 true                                                                                                                |
| b.none()                         | 如果 b 中任何位置都没有被置位,则返回 true                                                                                                          |
| b.count()                        | 返回 b 中任何被置位的位数                                                                                                                          |
| b.size()                         | 返回 b 中的位数,这是一个 _constexpr_ 函数                                                                                                          |
| b.test(pos)                      | 如果 pos 位置的位被置位，则返回 true，否则返回 flase                                                                                               |
| b.set(pos,v) <br/> b.set()       | 将 pos 位置的位设置为 bool 的 v,v 默认是 true,<br/> 如果没有传递实参，则 b 中所有位被置位                                                          |
| b.reset(pos) <br/> b.reset()     | 将 pos 位置的位被复位,如果没有传递实参，则 b 中所有位被复位                                                                                        |
| b.flip(pos) <br/> b.flip()       | 将 pos 位置的位翻转,如果没有传递实参，则 b 中所有位被翻转                                                                                          |
| b[pos]                           | 访问 b 中位置 pos 处的位,如果 b 是 _const_ 的, <br/> 则当 pos 位置被置位时返回 true，否则返回 flase                                                |
| b.to_ulong() <br/> b.to_ullong() | 返回一个 _unsigned long_ 或者 _unsigned long long_ 的值,<br/> 如果 b 中的位不能放入指定的类型则抛出一个 overflow_error 异常                        |
| b.to_string(zero,one)            | 返回一个 string，<br/> zero 和 one 用来替换 b 中的 0 和 1, <br/> zero 默认为 0,one 默认为 1                                                        |
| os &lt;&lt; b                    | 将 b 中二进制位打印为字符 0 或者 1,打印到流 os                                                                                                     |
| is &gt;&gt; b                    | 从 is 流中读取字符存入 b,<br/> 如果下一个字符不是 1 或者 0 时,<br/> 或者已经读入 b.size()个位时，<br/> 或者遇到文件尾时或者输入错误时,读取过程停止 |

:::

## 17.3 正则表达式

### 17.3.1 使用正则表达式库

正则表达式是一种描述字符序列的方法。C++标准库提供了一个 RE 库，可以处理多种类型的输入序列。输入可以是普通的 char 字符或者 wchar_t 字符，字符可以保存在 string(宽字符 wstring)中或者 char(wchar_t)数组中。==在处理不同的输入序列时需要保证使用的 RE 类库与输入序列的的类型匹配==。具体对应关系如下：

:::center

| 输入序列类型           | 匹配的正则表达式类                             |
| :--------------------- | :--------------------------------------------- |
| string                 | regex, smatch, ssub_match, sregex_iterator     |
| const char &lowast;    | regex, cmatch, csub_match, cregex_iterator     |
| wstring                | wregex, wsmatch, wssub_match, wsregex_iterator |
| const wchar_t &lowast; | wregex, wcmatch, wcsub_match, wcregex_iterator |

:::

不同类型的输入序列具有下表共有的功能,其中 "regex<span>\_</span>match" 和 "regex<span>\_</span>search" 可以确定给定输入序列是否与正则表达式是否匹配：

:::center

| 操作                                                                                                       | 说明                                                                                                                                                                                                      |
| :--------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| regex_match                                                                                                | 将一个字符序列与一个正则表达式匹配，<br/> 如果<b>整个输入序列</b>与表达式匹配则返回 true                                                                                                                  |
| regex_search                                                                                               | 查找第一个与正则表达式匹配的子序列，<br/> 如果<b>输入序列中的一个子串</b>与表达式匹配则返回 true                                                                                                          |
| regex_replace                                                                                              | 使用一个给定格式替换一个正则表达式                                                                                                                                                                        |
| regex_search(seq,m,r,mft)<br>regex_match(seq,m,r,mft)<br>regex_search(seq,r,mft)<br>regex_match(seq,r.mft) | seq 是输入序列，可以是 string,迭代器范围以及 C 风格的字符串指针。<br>r 是正则表达式。<br>m 是 match 对象，用来保存匹配结果的细节信息。<br>mft 是可选的 regex_constants::match_flag_type，会影响匹配过程。 |

:::

_regex/wregex_ 类表示一个正则表达式，在初始化和 _assign_ 赋值时可以指定一些标志位来影响 _regex_ 的操作。这些标志位在同一个对象中只能指定其中一个。默认情况下，_regex_ 的默认标志是 [ECMAScript](http://www.cplusplus.com/reference/regex/ECMAScript/) 使用 _ECMA-262_ 规范。由于反斜线是 C++中的特殊字符，在模式中每次出现 \ 的地方，必须要额外使用一个 \ 来告诉编译器我们需要一个反斜线字符，而不是一个特殊符号，因此在模式中需要反斜线字符的地方需要使用两个反斜线。

:::center

| 操作                          | 说明                                                                                                                                                                                                               |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| regex r(re) <br>regex r(re,f) | re 是一个正则表达式，<br/> 它可以是 string、一个表示字符范围的迭代器对、<br/> 一个指向空字符结尾的字符数组的指针、一个字符指针和一个计数器、<br/> 一个花括号包围的字符列表。f 是 regex 的标志位，默认为 ECMAScript |
| r1 = re                       | 将 r1 中的正则表达式替换为 re                                                                                                                                                                                      |
| r1.assign(re,f)               | 将 r1 中的正则表达式替换为 re，同时设定 regex 的标志                                                                                                                                                               |
| r1.mark_count                 | 返回 r1 中子表达式的数目                                                                                                                                                                                           |
| r1.flags()                    | 返回 r1 中的标志位                                                                                                                                                                                                 |

:::

**定义 regex 时可以指定的标志**:

- icase：在匹配过程中忽略大小写
- nosubs：不保存匹配的字符串
- optimize：执行速度优于构造速度
- ECMAScript：使用 ECMA-262 指定的语法
- basic：使用 POSIX 基本的正则表达式语法
- extended：使用 POSIX 扩展的正则表达式语法
- awk：使用 POSIX 的 awk 语言的语法
- grep：使用 POSIX 的 grep 的语法
- egrep：使用 POSIX 的 egrep 的语法

:::warning

_regex_ 对象在构造函数和赋值操作的时候可能抛出 _regex_error_，这是因为正则表达式本身不是由 C++编译器解释的，只有当它被初始化或者赋予一个新的模式时才会被真正的 "编译"。正是由于这个原因，编译正则表达式是一个非常慢的操作，尽量应该避免创建多个不必要的 _regex_ 对象。_regex_error_ 有一个 _what_ 操作描述发生了什么错误，同时还有一个 _code_ 的成员，用来返回某个错误对应的数值编码。

常见的错误：

- error_collate：无效的元素校对请求
- error_ctype：无效的字符类
- error_escap：无效的转义字符或者无效的尾置转义
- error_backref：无效的向后引用
- error_brack：不匹配的方括号("[" 或者 "]")
- error_paren：不匹配的小括号("(" 或者 ")")
- error_brace：不匹配的花括号("{" 或者 "}")
- error_badbrace：花括号{}中无效的范围
- error_range：无效的字符范围,如[z-a]
- error_space：内存不足,无法处理此正则表达式
- error_badrepeat：重复字符(&lowast;,?,+或者{)之前没有有效的正则表达式
- error_complexity：要求的匹配过于复杂
- error_stack：栈空间不足，无法处理匹配

:::

### 17.3.2 匹配与 Regex 迭代器类型

_regex_search_ 只能够匹配到第一个匹配的单词，如果要获取所有匹配的词需要使用迭代器进行遍历，不同的输入序列有对应的 _regex_ 迭代器类型。具备的操作如下：

以下迭代器操作适用于 _sregex_iterator_, _cregex_iterator_, _wsregex_iterator_, _wcregex_iterator_，均以 _sregex_iterator_ 为例进行说明:

:::center

| 操作                                                    | 说明                                                                                                                                              |
| :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| sregex_iterator it(b,e,r)                               | 给定一个输入序列的迭代器范围(b,e),<br/> 然后调用 regex_search(b,e,r),<br/> 返回迭代器范围中第一个与表达式匹配的迭代器，<br/> r 中保存了匹配的对象 |
| sregex_iterator end                                     | 定义一个尾后迭代器                                                                                                                                |
| &lowast;it, it->, ++it, it++,<br>it1 == it2, it1 != it2 | 迭代器的常规操作,递增迭代器会继续调用 regex_search 查询下一个匹配                                                                                 |

:::

_match_ 对象可以对匹配结果进行更加细致的操作，match 对象操作适用于：_smatch_, _cmatch_, _wsmatch_, _wcmatch_, _ssub_match_ ,_csub_match_, _wssub_match_, _wcsub_match_。

:::center

| 操作                                      | 说明                                                                                                                                                  |
| :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| m.ready()                                 | 如果已经通过调用 _regex_search_ 或 <br/> _regex_match_ 设置了 match 对象，则返回 true，否则返回 false。<br/> 如果返回 false 则对 m 进行操作是未定义的 |
| m.size()                                  | 如果匹配失败，则返回 0,<br/> 否则返回最近一次匹配的正则表达式中子表达式的数目                                                                         |
| m.empty()                                 | 如果 m.size()为 0，则返回 true                                                                                                                        |
| m.prefix()                                | 一个 ssub_match 对象，表示当前匹配之前的序列                                                                                                          |
| m.suffix()                                | 一个 ssub_match 对象，表示当前匹配之后的序列                                                                                                          |
| m.length(n)                               | 第 n 个匹配的子表达式的大小 <br>如果 n 为 0,则表示的是整个正则表达式模式对应的匹配。                                                                  |
| m.position(n)                             | 第 n 个子表达式距序列开始的距离 <br>如果 n 为 0,则表示的是整个正则表达式模式对应的匹配。                                                              |
| m.str(n)                                  | 第 n 个子表达式匹配的 string <br>如果 n 为 0,则表示的是整个正则表达式模式对应的匹配。                                                                 |
| m[n]                                      | 对应第 n 个子表达式的 ssub_match <br>如果 n 为 0,则表示的是整个正则表达式模式对应的匹配。                                                             |
| m.begin(),m.end(),<br>m.cbegin(),m.cend() | 表示 m 中 ssub_match 的迭代器范围 <br>如果 n 为 0,则表示的是整个正则表达式模式对应的匹配。                                                            |

:::

### 17.3.3 使用子表达式

正则表达式模式通常包含一个或者“多个子表达式”。一个子表达式是模式的一部分，在正则表达式中通常用括号表示一个子表达式。子表达式的一个常见用途就是验证必须匹配的特定格式的数据。

```cpp
// 该regex表达式创建了两个子表达式
// 子表达式一：[[:alnum:]]+ 匹配一个或者多个字符的序列
// 子表达式二：cpp|cxx|cc 匹配文件扩展名
regex r("([[:alnum:]]+)\\.(cpp|cxx|cc)$",regex::icase);

// 假设文件名为foo.cpp，假设匹配的结果对象result
// result.str(0)将保存foo.cpp
// result.str(1)将保存第一个子表达式的匹配结果foo
// result.str(2)将保存第二个子表达式的匹配结果cpp
```

==每个子表达式都会有一个 _sub_match_ 对象与之对应。适用于 _ssub_match_, _csub_match_, _wssub_match_, _wcsub_match_，每个子匹配对象具备以下操作：==

:::center

| 操作              | 说明                                                                                 |
| :---------------- | :----------------------------------------------------------------------------------- |
|                   |                                                                                      |
| matched           | 如果子表达式匹配成功则返回 true                                                      |
| first 或者 second | 指向匹配序列的首迭代器和尾后迭代器，<br/> 如果未匹配，则 first 和 second 相等        |
| length()          | 返回匹配的大小，如果 matched 为 false，则返回 0                                      |
| str()             | 返回一个包含输入序列中匹配的部分 string，<br/>如果 matched 为 false，则返回空 string |
| s = ssub          | 将 ssub_match 对象 ssub 转化为 string 对象 s。<br/>转换运算符不是 explicit 的        |

:::

### 17.3.4 使用 regex_replace

可以使用正则表达式实现对输入序列的替换操作。

:::center

| 操作                                                               | 说明                                                           |
| :----------------------------------------------------------------- | :------------------------------------------------------------- |
| m.format(dest,fmt,mft)<br>m.format(fmt,mft)                        | 使用格式化字符串 fmt 生成格式化                                |
| regex_replace(dest,seq,r,fmt,mft) <br>regex_replace(seq,r,fmt,mft) | 遍历 seq，使用格式化字符串 fmt 替换与正则表达式 r 匹配的部分。 |

:::

- fmt 可以是一个 string 或者指向空字符结尾的字符数组的指针
- mft 是 regex_constants::match_flag_type
- dest 是写入返回结果的迭代器位置
- seq 是输入序列
- r 是正则表达式对象

> 格式化字符串 fmt 的形式可以使用想要输出的字符和子表达式匹配的子串进行组合。而与子表达式匹配的子串可以通过一个符号$后跟子表达式的索引号组合
>
> ```cpp
> // 使用第1,2,3个子表达式及.字符及>字符组合成格式化字符串
> string fmt = "$1.$2>$3";
> ```

标准库定义了一系列用在在搜索和替换过程中控制匹配或格式的标志 _match_flag_type_，这个标志值定义在 _regex_constants_ 的命名空间中，而 _regex_constants_ 同样也保存在命名空间 "std" 中的命名空间。

:::center

| 操作              | 说明                                         |
| :---------------- | :------------------------------------------- |
| match_default     | 等价于 format_default                        |
| match_not_bol     | 不将首字符作为行首处理                       |
| match_not_eol     | 不将尾字符作为行尾处理                       |
| match_not_bow     | 不将首字符作为单词首处理                     |
| match_not_eow     | 不将尾字符作为单词尾处理                     |
| match_any         | 如果存在多于一个匹配，则可以返回任意一个匹配 |
| match_not_null    | 不匹配任何空序列                             |
| match_continuous  | 匹配必须从输入的首字符开始                   |
| match_prev_avail  | 输入序列包含第一个匹配之前的内容             |
| format_default    | 用 ECMAScript 规则替换字符串                 |
| format_sed        | 用 POSIX sed 规则替换字符串                  |
| format_no_copy    | 不输出输入序列中未匹配的部分                 |
| format_first_only | 只替换子表达式的第一次出现                   |

:::

## 17.4 随机数

### 17.4.1 随机数引擎和分布

随机数引擎是函数对象类，重载的函数调用运算符不接受参数并且返回一个 _unsigned_ 整数。通过调用一个随机数引擎对象可以生成原始随机数。

标准库定义了多个随机数引擎，但是每个编译器都会指定其中一个作为 _default_random_engine_，引擎都具备以下操作：

:::center

| 操作                | 说明                                           |
| :------------------ | :--------------------------------------------- |
| Engine e            | 默认构造函数，使用该引擎默认的种子             |
| Engine e(s)         | 使用整型值 s 作为种子                          |
| e.seed(s)           | 使用种子 s 重置引擎的状态                      |
| e.min() e.max()     | 返回此引擎可生成的最大最小值                   |
| Engine::result_type | 此引擎生成的 unsigned 整型类型                 |
| e.discard(u)        | 将引擎推进 u 步，u 的类型为 unsigned long long |

:::

通常情况下，随机数引擎的输出与我们需要的范围不同，不能直接被使用。为了得到一个指定范围内的数，还需要使用一个分布类型的对象，分部类型也是函数对象类，重载的函数调用运算符接受一个随机数引擎作为参数，分布对象使用它的引擎参数生成随机数，并将其映射到指定的分布。

> 对于给定的随机数发生器，每次运行都会返回相同的数值序列。通过将引擎与分布对象都设置为 static 可以保证每次输出的值不同。但是程序一旦重启，第一次输出总是相同的。

要保证每次运行程序都会生成不同的随机结果，可以通过提供一个随机的种子来达到目的。种子实际是一个数值，引擎可以利用它从序列中一个新的位置重新开始计算随机数。

### 17.4.2 其他随机数分布

随机数引擎生成 _unsigned_ 数，范围内每个数被生成的概率都是相同的，标准库通过定义不同随机数分布对象来满足保证可以生成不同类型或不同分布的随机数。

:::center

| 操作            | 说明                                                      |
| :-------------- | :-------------------------------------------------------- |
| Dist d          | 分布类型的 explicit 默认构造函数                          |
| d(e)            | 利用引擎 e 生成符合 d 分布类型的一个随机序列              |
| d.min() d.max() | 返回 d(e)能够生成的最大值和最小值                         |
| d.reset()       | 重建 d 的状态，使得随后对 d 的使用不依赖与 d 已经生成的值 |

:::

分布类型都是模板(除了 _bernouli_distribution_)，具有单一的模板类型参数，用以表示分布生成的随机数的类型。生成浮点数值的分布类型默认生成 _double_ 类型的数值，而生成整型数值的分布默认生成 _int_ 类型的数值。

```cpp
// 示例如何使用随机数引擎及分布对象生成多个正太态分布的序列
default_random_engine e(10); // 随机引擎，种子为10
normal_distribution<> n(10,5); // 正态分布，均值10，标准差5
vector<unsigned> vals(20);
for(size_t i = 0;i < 200; ++i){
  unsigned v = lround(n(e)); // 取最近的整数
  if(v < vals.size()){
    ++vals[v];
  }
}
for (size_t i = 0;i < vals.size();++i){
  cout << i << ": " << string(vals[i],'*') << endl;
}
```

## 17.5 IO 库再探

### 17.5.1 格式化输入与输出

标准库定义了一组 "操纵符" 来修改流的格式状态，一个操纵符是一个函数或者是一个对象，会影响流的状态。==当操纵符改变流的格式状态的时候，通常改变后的状态对所有后续 IO 都生效。==

:::center

| 操作                              | 说明                                     |
| :-------------------------------- | :--------------------------------------- |
| boolalpha                         | 将 true 和 false 输出为字符串            |
| noboolalpha <sub>(默认状态)</sub> | 将 true 和 false 输出为 1,0              |
| showbase                          | 对整型数值的输出添加进制的前缀           |
| noshowbase <sub>(默认状态)</sub>  | 不显示表示进制的前缀                     |
| showpoint                         | 对浮点数总是显示小数点                   |
| noshowpoint <sub>(默认状态)</sub> | 浮点数包含小数部分时才显示小数点         |
| uppercase                         | 在十六进制中打印 0X,在科学计数法中打印 E |
| nouppercase <sub>(默认状态)</sub> | 在十六进制中打印 0x,在科学计数法中打印 e |
| dec <sub>(默认状态)</sub>         | 整型数值按十进制显示                     |
| hex                               | 整型数值按十六进制显示                   |
| oct                               | 整型数值按八进制显示                     |
| left                              | 在值的右侧添加填充字符                   |
| right                             | 在值的左侧添加填充字符                   |
| internal                          | 在值和符号之间添加填充字符               |
| fixed                             | 浮点值显示为定点十进制                   |
| scientific                        | 浮点值显示为科学计数法                   |
| hexfloat                          | 浮点值显示为十六进制                     |
| defaultfloat                      | 重置浮点值显示为十进制                   |
| unitbuf                           | 每次输出操作后都刷新缓冲区               |
| nounitbuf <sub>(默认状态)</sub>   | 恢复正常缓冲区刷新方式                   |
| skipws <sub>(默认状态)</sub>      | 输入运算符跳过空白符                     |
| noskipws                          | 输入运算符不跳过空白符                   |
| flush                             | 刷新 ostream 缓冲区                      |
| ends                              | 插入空字符，刷新 ostream 缓冲区          |
| endl                              | 插入换行，刷新 ostream 缓冲区            |

:::

```cpp
// 按true、flase打印bool
std::cout << std::boolalpha << true << " "<< false << std::endl;
// 按进制打印整型数值
std::cout << std::showbase
    << 20
    << std::hex << " " << 20 << " "
    << std::oct << 20 << std::noshowbase << std::dec << std::endl;
```

对于浮点数可以控制输出三种格式：

- 设定输出浮点数的精度(precision, setprecision)
- 设定输出浮点数的显示类型，十六进制或者定点十六进制或科学计数法(fixed, hexfloat, scientific)
- 设定无小数部分的浮点数是否总是显示小数点(showpoint, noshowpoint)

在 iomanip 中还定义一些额外的操作符，例如某些情况下可能需要控制显示对齐，标准库为对齐操作提供以下几个操作：

- setw:指定下一个数字或字符串的最小空间
- left:左对齐输出
- right:右对齐输出
- internal:控制负数的符号的位置，左对齐符号，右对齐数值，中间用字符填充
- setfill:使用某个字符替换默认的空白符作为对齐操作的填充符

setw 不会改变输出流的内部状态，只改变下一个输出的大小

:::center

| 操作             | 说明                        |
| :--------------- | :-------------------------- |
| setfill(ch)      | 用字符 ch 替换空白符        |
| setprecision(ch) | 设置浮点数的精度            |
| setw(w)          | 设置下一个输出的最小宽度    |
| setbase(b)       | 将整数输出进制设置为 b 进制 |

:::

### 17.5.2 未格式化的输入/输出操作

输入/输出运算符是格式化的 IO 操作，标准库还提供了底层操作，支持未格式化的 IO 操作。这些操作允许我们将一个流当作一个无解释的字节序列来处理。

:::center

| 单字节 IO 操作 | 说明                                                |
| :------------- | :-------------------------------------------------- |
| is.get(ch)     | 从 istream 流 is 读取下一个字节存入字符 ch，返回 is |
| is.get()       | 从 istream 流 is 读取下一个字节,作为 int 返回       |
| is.putback(ch) | 将字符 ch 放回 is，返回 is                          |
| is.unget()     | 将 is 向后移动一个字节，返回 is                     |
| is.peek()      | 将 is 的下一个字节作为 int 返回，但是不删除它       |
| os.put(ch)     | 将字符 ch 输出到 ostream 流 os，返回 os             |

:::

:::center

| 多字节 IO 操作              | 说明                                                                                                                                                                                 |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is.get(sink,size,delim)     | 从 is 中最多读取 size 个字节,保存在字符数组中。<br>读取过程中遇到 delim 或者读取字节大小达到 size 或者遇到文件尾时停止，如果遇到的是 delim，则将其保留在流中，但是不会保存到 sink 中 |
| is.getline(sink,size,delim) | 从 is 中最多读取 size 个字节,保存在字符数组中。<br>读取过程中遇到 delim 或者读取字节大小达到 size 或者遇到文件尾时停止，如果遇到的是 delim，则将其从流中删除，也不会保存到 sink 中   |
| is.read(sink,size)          | 从 is 中最多读取 size 个字节,保存在字符数组中。                                                                                                                                      |
| is.gcount()                 | 返回上一个未格式化的读取操作从 is 读取的字节数。                                                                                                                                     |
| is.ignore(size,delim)       | 读取并忽略最多 size 个字节,包括 delim，size 默认为 1,delim 默认为文件尾                                                                                                              |
| os.write(sink,size)         | 将字符数组 sink 中的 size 个字节写入 os，返回 os。                                                                                                                                   |

:::

上述操作参数解释如下：

- sink：保存字符数组的地址
- size: 字节大小
- delim: 分隔字符

### 17.5.3 流随机访问

各种流类型通常都支持对流中数据的随机访问，标准库提供了一些函数来重定位流。在大多数系统中，绑定到 _cin_、_cout_、_cerr_、_clog_ 的流不支持随机访问，这是因为向 _cout_ 输出数据时，与回跳类似的操作并没有实际意义，因此标准库限定其运行时会出错。**流的随机访问通常用于 _fstream_ 与 _sstream_。**

IO 类会维护**一个**标记来确定下一个读写操作在哪里进行，"seek" 函数用于流重定位，"tell" 函数用于告诉我们当前标记的位置。为了针对不同的流，标准库进行了区分，通常输入流只能使用 g 版本(get)，而输出流只使用 p 版本(put)。

:::center

| 多字节 IO 操作                     | 说明                                                                                                                                                                                          |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tellg()                            | 返回一个输入流中标记的当前位置                                                                                                                                                                |
| tellp()                            | 返回一个输出流中标记的当前位置                                                                                                                                                                |
| seekg(pos)                         | 将输入流的标记重定位到给定的位置                                                                                                                                                              |
| seekp(pos)                         | 将输出流的标记重定位到给定的位置                                                                                                                                                              |
| seekg(off,from)<br>seekp(off,from) | 将输入流/输出流的标记重定位到 from 之前或者之后的 off 个字符，<br/> from 可以是下列值之一: <br/>beg：偏移是相对流开始的位置 <br/>cur：偏移是相对流当前的位置 <br/>end：偏移是相对流结尾的位置 |

:::

> 即使是 _iostream_, _fstream_, _sstream_ 类型，标准库在一个流中只有一个标记。因此必须进行 "seek" 操作重定位标记
