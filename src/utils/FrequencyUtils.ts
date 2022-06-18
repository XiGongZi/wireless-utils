/**
 * @description 定义无线电常用方法
 */
/**
 * @description 将频率转换为整数部分小于1000的带单位的字符串
 * 
 * @param { Hz } frequency
 *
 * @returns { string } 返回带单位的字符串
 */
export const getStringFrequencyWithUnit = (frequency: Hz): string => {
  // 如果是负数需要存储
  const { value, unit } = getFrequencyUnitByHz(frequency);
  return value + FrequencyUnitEnum[unit];
}
/**
 * @description 输入频率返回 获取单位和数值
 *
 * @param { Hz } frequency Hz
 *
 * @returns { FrequencyUnit }
 */
export const getFrequencyUnitByHz = (frequency: Hz): FrequencyUnit => {
  if (frequency < 0) return { value: frequency * 1_000, unit: FrequencyUnitEnum.mHz };
  if (frequency < 1_000) return { value: frequency, unit: FrequencyUnitEnum.Hz };
  if (frequency < 1_000_000) return { value: frequency / 1_000, unit: FrequencyUnitEnum.kHz };
  if (frequency < 1_000_000_000) return { value: frequency / 1_000_000, unit: FrequencyUnitEnum.MHz };
  return { value: frequency / 1_000_000_000, unit: FrequencyUnitEnum.GHz };
}
/**
 * @description 根据传入的字符串(非小数) 第一个字符来判断数量级
 *
 * @param { UserInputContext } unit
 *
 * @date 2022-06-07
 *
 * @returns { FrequencyUnitEnum }
 */
export const getFrequencyUnitByUserInputContext = (unit: UserInputContext): FrequencyUnitEnum => {
  // 拿到第一个非数字字符
  const index = unit.search(/\D/);
  const str = unit.slice(index, 1);
  if (str === "G" || str === "g") return FrequencyUnitEnum.GHz;
  // 如果包括 M
  if (str === "M") return FrequencyUnitEnum.MHz;
  // 如果包括 K || k
  if (str === "K" || str === "k") return FrequencyUnitEnum.kHz;
  // 如果包括 m
  if (str === "m") return FrequencyUnitEnum.mHz;
  // 如果只包括 Hz 或 hz
  if (str === "H" || str === "h") return FrequencyUnitEnum.Hz;
  return -1;
};

/**
 * 输入一个浮点数，根据情况转换成合适大小以及偏移单位
 *
 * 转换示例
 *
 * 0.010001 => 010001 => 10.001, -1 => { value: 10.001, offset: -1 }
 * 0.0001 => 000100 => 100,-2 => { value: 100, offset: -2 }
 * 0.001 => 001 => 1,-1 => { value: 1, offset: -1 }
 * 0.01 => 010 => 10,-1 => { value: 10, offset: -1 }
 *
 * @param { Hz } frequency 如果是浮点数 则 需要小数位数不超过6位
 * @returns { FrequencyOffsetUnit }
 */
export const getOffsetByFloat = (frequency: Hz): FrequencyOffsetUnit => {
  const [intPartString, floatPartString] = getIntAndFloatString(frequency);
  // 整数部分大于0或小数部分等于0时 return getOffsetByInt
  if (floatPartString === "0" || Number(intPartString)) return getOffsetByInt(frequency);
  // 此处的 intPartString 为0
  // 查找float字符串前面第一个 不是 0 的字符串位置
  const firstNotZeroCharIndex: number = floatPartString.search(/[1-9]/);
  // 如果float长度不是3的倍数，则需要补0
  const floatPartStringPadEndZero: string = floatPartString.padEnd(Math.ceil(floatPartString.length / 3) * 3, "0");
  // 找一个 firstNotZeroCharIndex 最近的3的倍数
  const ceil = Math.ceil((firstNotZeroCharIndex + 1) / 3);
  const index3 = ceil * 3;
  // console.log("index3", index3);
  // value 是 floatPartString 从左往右第index3加小数点
  const value = Number(
    floatPartStringPadEndZero.slice(0, index3) + "." + floatPartStringPadEndZero.slice(index3)
  );
  return { value, offset: -ceil };
};
/**
 * @description 根据传入的整数 返回 单位和偏移
 *
 * @param { Hz } frequency
 * 
 * @returns { FrequencyOffsetUnit }
 */
export const getOffsetByInt = (frequency: Hz): FrequencyOffsetUnit => {
  let [intPartString, floatPartString] = getIntAndFloatString(frequency)
  // 开头补全0
  const intPartStringLen = intPartString.length;
  intPartString = intPartString.padStart(Math.ceil(intPartStringLen / 3) * 3, "0");
  // console.log("getOffsetByInt intPartString  add0", intPartString);
  if (intPartStringLen <= 3) return { value: Number(frequency), offset: 0 };
  const value = Number(
    intPartString.substring(0, 3) + "." + intPartString.substring(3) + floatPartString
  );
  const offset = Math.ceil(intPartStringLen / 3) - 1;
  // console.log("getOffsetByInt intPartString,offset ", value, offset);
  return { value, offset };
};
/**
*
* @description 传入浮点数 返回整数小数字符串
*
* @param { number } number number类型的整数或浮点数
*
* @return { string } intPartString 
* @return { string } floatPartString 
*
* @date 2022-06-18
*
* @author WangAnCheng
*
*/
const getIntAndFloatString = (number: number): [string, string] => {
  const val = number.toString();
  let intPartString = "0";
  let floatPartString = "0";
  if (val.indexOf(".") !== -1) {
    [intPartString, floatPartString] = val.split(".");
  } else {
    intPartString = val;
  }
  return [intPartString, floatPartString];
}
/**
 * @description Hz之间单位互转
 * 
 * @param { Hz } frequency 频率
 * @param { FrequencyUnitEnum } unit 原始单位
 * @param { FrequencyUnitEnum } targetUnit 目标单位
 * 
 * @return { Hz } 转换后的频率, 单位为targetUnit
 */
export const changeHzUnit = (frequency: Hz, unit: FrequencyUnitEnum, targetUnit: FrequencyUnitEnum): Hz => {
  // 计算数量级
  const scale = (unit - targetUnit) * 3;
  // 计算结果
  const result = frequency * Math.pow(10, scale);
  return result;
};

/**
 * 判断输入的字符串Hz是哪个数量级的
 *
 * @param {*} value
 *
 * @date 2020-06-07
 *
 * @returns { FrequencyUnit }
 */
export const JudgeFrequencyMagnitude = (frequencyUnit: UserInputContextUnit): FrequencyUnit => {
  /**
   * value 表示用户输入的value，不包括自己填写的单位
   * unit 需要变化的单位，-1表示不变化
   */
  // 传入的只能是字符串
  const unit: FrequencyUnitEnum = frequencyUnit.unit;
  let frequencyString: string = frequencyUnit.value;
  // 去除所有空格
  // value = value.replace(/\s+/g, "");
  // console.log("JudgeFrequencyMagnitude value ", value);
  const dotIndex = frequencyString.indexOf(".");
  const hadDot = dotIndex > -1;
  // 判断是否是纯数字字符串
  const isNumber = hadDot ? /^\d+\.\d+$/.test(frequencyString) : /^\d+$/.test(frequencyString);
  // console.log("JudgeFrequencyMagnitude isNumber", isNumber);
  if (isNumber) {
    frequencyString = changeHzUnit(Number(frequencyString), unit, FrequencyUnitEnum.Hz) + "Hz";
    // return { frequencyString, unit };
  }
  // if (isNumber) frequencyString += "Hz";
  // console.log("JudgeFrequencyMagnitude 非纯数字", frequencyString);
  // 获取第一个非数字字符或小数点的下标,并取出其后所有的字符串
  const index = hadDot
    ? frequencyString.slice(dotIndex + 1).search(/\D/) + dotIndex + 1
    : frequencyString.search(/\D/);
  // console.log("JudgeFrequencyMagnitude 第一个非数字index==", frequencyString, index);
  const floatPartString = frequencyString.slice(0, index);
  // console.log("JudgeFrequencyMagnitude num", num);
  const offsetInfo = getOffsetByFloat(Number(floatPartString));
  // console.log("JudgeFrequencyMagnitude offsetInfo", offsetInfo);
  const unitValue = frequencyString.slice(index);
  let unitMagnitude = getFrequencyUnitByUserInputContext(unitValue);
  // console.log("JudgeFrequencyMagnitude unitMagnitude", unitMagnitude);
  unitMagnitude += offsetInfo.offset;
  return { value: offsetInfo.value, unit: unitMagnitude };
};