### 无线电相关工具类

#### TODO

- [x] 拆分代码
- [x] 增加文档
- [ ] 增加测试
- [ ] 增加示例

## 暴露接口

| 名称           | 类型   | 必须 | 备注                                 |
| -------------- | ------ | ---- | ------------------------------------ |
| FrequencyUtils | static |      | 频率相关工具类                       |
| HzTurn         | public |      | 输入可带单位的频率自动转成合适的单位 |

### HzTurn

| 名称       | 类型                                      | 必须 | 备注                                            |
| ---------- | ----------------------------------------- | ---- | ----------------------------------------------- |
| value      | UserInputContext                          | N    | 存储用户的字符串                                |
| unit       | FrequencyUnitEnum                         | Y    | 频率单位枚举                                    |
| unitInfo   | string                                    | Y    | 单位                                            |
| frequency  | Hz                                        | N    | 频率（单位 Hz）                                 |
| construcor | UserInputContext 或者 Hz                  | N    | 构造函数初始化传入的数值                        |
| setValue   | Function (value: Hz) => void              | N    | 输入 number 频率 自动转成合适单位               |
| setHzValue | Function (unit: UserInputContext) => void | N    | UserInputContext 输入完后主动触发计算成合适单位 |

#### properties

##### `value: UserInputContext` 存储用户的字符串

##### `unit: FrequencyUnitEnum` 频率单位枚举

##### `unitInfo: string` 单位字符串

##### `frequency: Hz` 频率（单位 Hz）

#### Methods

##### `construcor` 构造函数

```ts
setValue: (value: number | string = "0Hz") => void
```

##### `setValue` 输入 number 频率 自动转成合适单位

```ts
setValue: (value: Hz) => void;
```

##### `setHzValue` UserInputContext 输入完后主动触发计算成合适单位

```ts
setHzValue: (unit: UserInputContext) => void;
```

**example:**

```ts
import { HzTurn } from "rf-wireless-utils";

// 创建对象存储, 初始化可选 Hz 或 带单位的频率字符串
const hzTurn = new HzTurn(1000);

// 设置新频率
hzTurn.value = "1.5 MHz";
// 或
hzTurn.value = "1000";

// 获取频率
const newFrequency: number = hzTurn.frequency;

// 更改完频率后需要主动触发计算, 否则不会更新状态
hzTurn.setHzValue();
```

### FrequencyUtils

#### Methods

##### `FrequencyUtils.getStringFrequencyWithUnit()` 将频率转换为整数部分小于 1000 的带单位的字符串

```ts
// interface
static getStringFrequencyWithUnit: (frequency: Hz) => string;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.getStringFrequencyWithUnit(1000); // "1kHz"
FrequencyUtils.getStringFrequencyWithUnit(1000000); // "1MHz"
FrequencyUtils.getStringFrequencyWithUnit(0.1); // "100mHz"
```

##### `FrequencyUtils.getFrequencyUnitByHz()` 输入频率返回 获取单位和数值

```ts
// interface
  static getFrequencyUnitByHz: (frequency: Hz) => FrequencyUnit;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.getFrequencyUnitByHz(0.1); // {value: 100, unit: FrequencyUnitEnum.mHz}
```

##### `FrequencyUtils.getFrequencyUnitByUserInputContext()` 根据传入的字符串(非小数) 第一个字符来判断数量级

```ts
// interface
  static getFrequencyUnitByUserInputContext: (userInputContext: UserInputContext) => FrequencyUnitEnum;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.getFrequencyUnitByUserInputContext("1000kHz"); // FrequencyUnitEnum.kHz
```

##### `FrequencyUtils.getOffsetByFloat()` 输入一个浮点数，根据情况转换成合适大小以及偏移单位

```ts
// interface
  static getOffsetByFloat: (frequency: Hz) => FrequencyOffsetUnit;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.getOffsetByFloat(0.010001); // { value: 10.001, offset: -1 }
FrequencyUtils.getOffsetByFloat(0.0001); // { value: 100, offset: -2 }
FrequencyUtils.getOffsetByFloat(0.001); // { value: 1, offset: -1 }
FrequencyUtils.getOffsetByFloat(0.01); // { value: 10, offset: -1 }
```

##### `FrequencyUtils.getOffsetByInt()` 根据传入的整数 返回 单位和偏移

```ts
// interface
  static getOffsetByInt: (frequency: Hz) => FrequencyOffsetUnit;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.getOffsetByInt(1); // { value: 1, offset: 0 }
FrequencyUtils.getOffsetByInt(1000); // { value: 1, offset: 1 }
FrequencyUtils.getOffsetByInt(100.00001); // { value: 100.00001, offset: 0 }
```

##### `FrequencyUtils.getIntAndFloatString()` 传入浮点数 返回整数小数字符串

```ts
// interface
  static getIntAndFloatString: (frequency: Hz) => [string, string];
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.getIntAndFloatString(0.1); // ["0","1"]
FrequencyUtils.getIntAndFloatString(10.01); // ["10","01"]
```

##### `FrequencyUtils.changeHzUnit()` Hz 之间单位互转

```ts
// interface
  static changeHzUnit: (frequency: Hz, fromUnit: FrequencyUnitEnum, toUnit: FrequencyUnitEnum) => Hz;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.changeHzUnit(100, FrequencyUnitEnum.MHz, FrequencyUnitEnum.Hz); // 100_000_000
FrequencyUtils.changeHzUnit(100, FrequencyUnitEnum.Hz, FrequencyUnitEnum.MHz); // 0.0001
FrequencyUtils.changeHzUnit(100, FrequencyUnitEnum.Hz, FrequencyUnitEnum.mHz); // 100_000
```

##### `FrequencyUtils.JudgeFrequencyMagnitude()` 判断输入的字符串 Hz 是哪个数量级的

```ts
// interface
  static JudgeFrequencyMagnitude: (frequency: UserInputContextUnit) => FrequencyUnit;
```

**example:**

```ts
import { FrequencyUtils } from "rf-wireless-utils";
FrequencyUtils.JudgeFrequencyMagnitude("1000kHz"); // {value: 1, unit: FrequencyUnitEnum.MHz}
```
