import FrequencyUtils from "../utils/FrequencyUtils";

interface IHzTurn {
  value: UserInputContext;
  unit: FrequencyUnitEnum;
  unitInfo: string;
  frequency: Hz;
  // @desc direct setting Hz Frequency to be suitable unit and value
  setValue: (value: Hz) => void;
  // @desc set UserInputContext to be suitable unit and value
  setHzValue: (unit: UserInputContext) => void;
}
export default class HzTurn implements IHzTurn {
  value: UserInputContext = "0";
  unit: FrequencyUnitEnum = FrequencyUnitEnum.Hz;
  // unitArr;
  tipsString = "---";
  /**
   *
   * @param {number | string} value "1000MHz" || "10"(默认Hz)
   */
  constructor(value: number | string = "0Hz") {
    this.setHzValue(value + "");
  }
  /**
   * 获取单位符号
   */
  get unitInfo() {
    return FrequencyUnitEnum[this.unit];
  }
  get frequency() {
    return FrequencyUtils.changeHzUnit(Number(this.value), this.unit, FrequencyUnitEnum.Hz);
  }
  /**
   * 设置频率, 单位为Hz
   */
  set frequency(val) {
    this.setValue(Number(val));
  }
  /**
   *
   * @param { Hz } frequency
   */
  setValue(frequency: Hz) {
    const { value, unit } = FrequencyUtils.getFrequencyUnitByHz(frequency);
    this.value = value.toString();
    this.unit = unit;
  }
  setHzValue(value = this.value) {
    const res = FrequencyUtils.JudgeFrequencyMagnitude({ value: value, unit: this.unit });
    this.unit = res.unit;
    this.value = res.value.toString();
  }
}
