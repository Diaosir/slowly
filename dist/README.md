

## 简介
一个node.js命令行工具的框架，类似与egg，你可以像写egg一个写命令行工具，slowly的目的很简单，让你更专注业务代码的开发，剩下的交给slowly就行了。


## 快速入门


一步步教你搭建一个基于slowly框架的命令行工具

### 安装

```
npm i slowly --save
```

如果你需要使用typescript来开发，还需安装
```
npm i typescript -g
```

### 初始化

创建文件，目录结构如下：


```
slowly-example
├── dist
├── src
│   ├── config
│   │   └── index.ts //config
│   ├── controller // controller
│   │   ├── home.ts 
│   │   └── index.ts
│   ├── index.ts
│   ├── middleware
│   │   └── inquirer.ts
│   └── service
│       └── index.ts
└── package.json
```

创建命令行工具的入口文件，并且引入slowly，初始化app，注册命令行路由

```
// src/index.ts

#!/usr/bin/env node
import { App, Router } from 'slowly'
const app = new App({
  version: '1.0.0',
  name: 'test-slowly'
});
const router = new Router()
const { controller } = app.ctx;
router.register('init', 'test-slowly init', async (ctx) => {
  //you code
})
app.use(router.routes());

```

你没有看错，就是egg的写法，是不是很酷！！！！！

### App Config

```
{
  version: string; //命令行版本号
  name: string; //名称
  userConfigFile?: string; //用户配置文件路径
}
```
### Option

router支持直接注册或者链式注册option

#### 直接注册

直接注册无法给option添加额外说明

```
router.register('init [-u | --uri] <-n | --name>', 'test-slowly init', async (ctx) => {
  //you code
})
```
####  链式注册

使用option方法注册，可以添加说明
```
router.register('init', 'test-slowly init')
      .option('<-u | --uri>', 'swagger docs url')
      .option('<-n | --name>', 'swagger service name')
      .action(controller1, controller2)
```


slowly的option配置规则比较简单，如下:

```
 <-u | --uri> or  [-u | --uri]
```
其中u为缩写, uri为option全称，可以通过<strong>ctx.query.uri</strong>获取其值

使用<strong><></strong>包含起来的代表该项为必须项，如果不输入slowly会自动提示
```
[Error]: 
option <-u | --uri> is required
```
如果用的是<strong>[]</strong>则表示该项非必须

<strong style="color: red">特别地</strong>：

1. 只输入"test-slowly init -u"时，uri默认为true
2. 如遇到输入多个option，slowly会自动收集为数组，例如输入"test-slowly init  -u a -u b -u"，uri为 <code>['a', 'b', true]</code>
3. 默认类型转换，因为命令行输入都为字符串，slowly将"true"、"false"、/\d+/分别转换为<font color="red">true</font>、<font color="red">false</font>、<font color="red">number</font>
4. 当遇到[...reset]，会将非option项收集到<strong>ctx.query.reset</strong>里面，被收集过的项将从<strong>ctx.params</strong>里移除

router注册：
```
router.register('init [...reset] <-n | --name>', 'test-slowly init');
```
命令行输入：
```
test-slowly init template1 template2 -n test_user template3
```
结果为：
```
ctx.query = {
    name: 'test_user',
    reset: ['template1', 'template2', 'template3']
}
```
### 添加配置文件

slowly的配置文件在config文件夹下，会自动去读取合并，可以通过<strong>app.config</strong>或<strong>app.ctx.config</strong>获取


### 编写Controller

```
// src/controller/index.ts
import { Controller } from 'slowly'

export default class TestController extends Controller {
  async init() {
    this.ctx.message = 'hello world'
  }
}
```

将控制器方法注册到路径里面，register方法可以添加middleware、自定义函数、controller方法，特别地controller方法必须放在最后

```
// src/index.ts
const { controller } = app;
router.register('init', 'test-slowly init', async (ctx, next) => {
    //your code
    await next()
},  controller.index.init);

```

### 编写service

controller只处理简单逻辑，如需要获取数据或者复杂业务逻辑，就交给<strong>Service</strong>

```
//src/service/index.ts
import { Service } from 'slowly'
export default class TestService extends Service {
  async getMessage() {
    return 'hello world'
  }
}
```
可以在之前的编写的controller使用
```
// src/controller/index.ts
import { Controller } from 'slowly'

export default class TestController extends Controller {
  async init() {
    const { service } = this.ctx;
    this.ctx.message = await service.index.getMessage();
  }
}
```

### 编写middleware

当我们需要在命令行里面跟用户有交互，这时就可以使用<strong>middleware</strong>来处理，结合<strong>inquirer</strong>来捕获用户的输入数据，再交给下一步处理

```
//src/middleware/inquirer.ts

import inquirer from 'inquirer';
export default function inquirerMiddleware(questions) {
  return async function(ctx, next) {
    const data = inquirer.prompt(questions)
    ctx.query = {
      ...ctx.query,
      ...data
    }
    await next();
  }
}
```
然后将这个中间件注册到路由里即可
```
// src/index.ts

const { controller, middleware } = app;
router.register('init', 'test-slowly init', middleware.inquirer([{
  type: 'input',
  message: 'set name',
  name: 'name'
}]), controller.index.init);

```

### 事件监听

很多时候我们都需要额外的监听一些事件，slowly可以通过app.ctx.emitter对象去监听对应的事件，例如需要监听help
```
app.ctx.emitter.on('help', (name) => {
  //其中name为对应的命令名称
})

```
事件名称说明如下：
1. on("command:help", (command: string) => {}): 子命令onHelp
2. on("illegality:option", (command: string, illegalityRouteOptions) => {}): 输入了非法的option
3. on("verifyOption:fail", (command, options) => {}): option验证失败


### ctx对象

从输入命令行到node进程关闭，ctx对象都会贯彻整个生命周期
```
cwd: string; //引入app的入口文件路径
argv: IArgv, //命令行输入
routes: {
    [key: string]: IRouteConfig
}
version: string;
emitter: EventEmitter; //事件对象
name?: string;
middleware?: {
    [key: string]: any
};
controller: {
    [key: string]: any
},
service?: {
    [key: string]: any
},
query?: { //命令行option
    [key: string]: any;
};
readonly params: Array<string>;
curl: (url: string, ...args: Array<any>) => Promise<any> | void; //基于urllib封装的方法
```

