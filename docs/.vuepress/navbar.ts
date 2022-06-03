import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "读书笔记",
    icon: "book",
    prefix: "/wiki/",
    children: [
      { text: "编程语言", icon: "code", link: "langs" },
      { text: "操作系统", icon: "linux", link: "os" },
      { text: "计算机网络", icon: "networks", link: "net" },
      { text: "数据结构与算法", icon: "algorithm", link: "algorithm" },
      { text: "其他", icon: "other-min", link: "other" },
    ],
  },

  {
    text: "工具",
    icon: "tools",
    prefix: "/blog/tools/",
    children: [
      { text: "Vscode", icon: "vscode", link: "vscode" },
      { text: "Vim", icon: "vim", link: "vim" },
      { text: "Git", icon: "git", link: "git" },
      { text: "CMake", icon: "cmake", link: "cmake" },
      { text: "GDB", icon: "debug", link: "gdb" },
      { text: "Docker", icon: "docker", link: "docker" },
      { text: "Vue", icon: "vue", link: "vue" },
    ],
  },
  {
    text: "其他",
    icon: "other",
    prefix: "/blog/other/",
    link: "/blog/other/",
  },
  { text: "归档", icon: "archive", link: "/guide/" },
]);
