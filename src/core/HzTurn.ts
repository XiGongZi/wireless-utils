import { changeHzUnit, getFrequencyUnitByHz, JudgeFrequencyMagnitude } from "../utils/FrequencyUtils";

/**
 * input绑定的数值在value中
 */
// const unitArr = ["mHz", "Hz", "kHz", "MHz", "GHz"];
// const unitArr = enums.getEnumKeys("frequencyHz");
export class HzTurn implements IHzTurn {
  value: UserInputContext = "0";
  unit: FrequencyUnitEnum = FrequencyUnitEnum.Hz;
  // unitArr;
  tipsString = "---";
  /**
   *
   * @param {string} param0 "1000MHz" || "10"(默认Hz)
   */
  constructor(value: number | string = "0Hz") {
    this.setHzValue(value + "");
  }
  get unitInfo() {
    // 获取单位符号
    return FrequencyUnitEnum[this.unit];
  }
  get frequency() {
    return changeHzUnit(Number(this.value), this.unit, FrequencyUnitEnum.Hz);
  }
  /**
   * 设置频率, 单位为Hz
   *
   * @param {Number || String} val
   */
  set frequency(val) {
    this.setValue(Number(val));
  }
  get notZeroHz() {
    console.log("notZeroHz", this.value, typeof this.value);

    if (this.value) return this.value;
    else return this.tipsString;
  }
  /**
   *
   * @param {Number || String} val
   */
  setValue(val: Hz) {
    const { value, unit } = getFrequencyUnitByHz(val);
    // console.log("setValue", val, value, unit);
    // console.log("HzTurn", this);
    this.value = value.toString();
    this.unit = unit;
  }
  setHzValue(value = this.value) {
    // 设置单位
    // console.log("setValue ", this);
    // let value = this.value;
    // console.log("HzTurn");
    if (typeof value !== "string") {
      return false;
    }
    // HZ方法
    const res = JudgeFrequencyMagnitude({ value: value, unit: this.unit });
    // console.log("setUnit", res);
    // 如果为-1则表示单位不变，如果不是-1则表示单位变化，需要进行值的转换
    // if (res.unit === -1) {
    //   this.value = res.value;
    // } else {
    this.unit = res.unit;
    this.value = res.value.toString();
  }
}
