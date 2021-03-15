// tests go here; this will not be compiled when this package is used as an extension.
basic.forever(function () {
    serial.writeValue("VOC", SFA30.get_formaldehyde());
    serial.writeValue("T", SFA30.get_temperature(SFA30.SFA30_T_UNIT.C));
    serial.writeValue("RH", SFA30.get_relative_humidity());
    basic.pause(500);
})

