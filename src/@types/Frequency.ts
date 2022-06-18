/**
 * 频率单位枚举
 */
enum FrequencyUnitEnum {
  mHz = 0,
  Hz = 1,
  kHz = 2,
  MHz = 3,
  GHz = 4,
}
/**
 * 大于0的频率 可以为浮点数
 */
type Hz = number;
/**
 * 频率基本信息单元
 */
type FrequencyUnit = {
  value: Hz;
  unit: FrequencyUnitEnum;
}
/**
 * 用户input输入内容
 */
type UserInputContext = string;

type FrequencyOffsetUnit = {
  value: Hz;
  offset: number;
}

type UserInputContextUnit = {
  value: UserInputContext;
  unit: FrequencyUnitEnum;
}
