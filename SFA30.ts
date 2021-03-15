namespace SFA30 {

    export enum SFA30_T_UNIT {
        //% block="C"
        C = 0,
        //% block="F"
        F = 1
    }

    const SFA30_I2C_ADDR = 0x5D;

    let formaldehyde = 0;
    let temperature = 0;
    let relative_humidity = 0;

    init();

    function read_word(repeat = false) {
        let value = pins.i2cReadNumber(SFA30_I2C_ADDR, NumberFormat.UInt16BE, repeat);
        pins.i2cReadNumber(SFA30_I2C_ADDR, NumberFormat.UInt8BE, repeat);
        return value
    }

    function read_words(number_of_words: number) {
        let buffer = pins.i2cReadBuffer(SFA30_I2C_ADDR, number_of_words * 3, false);
        let words:number[] = [];
        for (let i = 0; i < number_of_words; i++) {
            words.push(buffer.getNumber(NumberFormat.UInt16BE, 3*i));
        }
        return words;
    }


    function get_signals() {
        pins.i2cWriteNumber(SFA30_I2C_ADDR, 0x0327, NumberFormat.UInt16BE);
        basic.pause(5);
        let values = read_words(6);
        let adc_formaldehyde = values[0];
        let adc_rh = values[1];
        let adc_t = values[2];
        formaldehyde = adc_formaldehyde / 5.0;
        relative_humidity = adc_rh / 100.0;
        temperature =  adc_t / 200.0;
    }

    /**
     * init
     */
    //% blockId="SFA30_INIT" block="init"
    //% weight=80 blockGap=8
    export function init() {
        device_reset();
        start_continuous_measurement();
    }

    /**
     * This command triggers the operation mode of all sensors. It
     * must be called once prior to the get_signals or
     * get_raw_signals commands, respectively.
     */
    //% blockId="SFA30_START_CONTINUOUS_MEASUREMENT" block="start continuous measurement"
    //% weight=80 blockGap=8
    export function start_continuous_measurement() {
        pins.i2cWriteNumber(SFA30_I2C_ADDR, 0x0006, NumberFormat.UInt16BE);
        basic.pause(1);
    }

    /**
     * stop continuous measurement. Call this to stop SFA30 internal measurements
     */
    //% blockId="SFA30_STOP_CONTINUOUS_MEASUREMENT" block="stop continuous measurement"
    //% weight=80 blockGap=8
    export function stop_continuous_measurement() {
        pins.i2cWriteNumber(SFA30_I2C_ADDR, 0x0104, NumberFormat.UInt16BE);
        basic.pause(50);
    }

    /**
     * get VOC. Call this at most once per second, 
     * else last measurement value will be returned
     */
    //% blockId="SFA30_GET_FORMALDEHYDE" block="formaldehyde %u"
    //% weight=80 blockGap=8
    export function get_formaldehyde() {
        get_signals();
        return formaldehyde;
    }

    /**
     * get temperature. Call this at most once per second, 
     * else last measurement value will be returned
     */
    //% blockId="SFA30_GET_TEMPERATURE" block="temperature %u"
    //% weight=80 blockGap=8
    export function get_temperature(unit: SFA30_T_UNIT = SFA30_T_UNIT.C) {
        get_signals();
        if (unit == SFA30_T_UNIT.C) {
            return temperature;
        }
        return 32 + ((temperature * 9) / 5);
    }

    /**
     * get relative humidity. Call this at most once per second, 
     * else last measurement value will be returned
     */
    //% blockId="SFA30_GET_RELATIVE_HUMIDITY" block="relative humidity %u"
    //% weight=80 blockGap=8
    export function get_relative_humidity() {
        get_signals();
        return relative_humidity;
    }

    /**
     * This command performs a reset of the device and restarts the
     * SFA30 in idle mode. Prior to executing the reset, the device
     * will acknowledge the call.
     */
    //% blockId="SFA30_DEVICE_RESET" block="device reset"
    //% weight=80 blockGap=8
    export function device_reset() {
        pins.i2cWriteNumber(SFA30_I2C_ADDR, 0xD304, NumberFormat.UInt16BE);
        basic.pause(100);
    }
}
