namespace EasyMaqueenPlusV2 {
    let steeringCorrection = 0;

    //% block="set steering correction %correction (positive number turns more to the right)"
    //% weight=98
    export function setSteeringCorrection(correction: number): void {
        steeringCorrection = correction;
    }

    //% block="drive %edir speed %speed"
    //% speed.min=0 speed.max=255
    //% weight=99
    export function drive(direction: maqueenPlusV2.MyEnumDir, speed: number): void {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed + steeringCorrection);
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
    }

    //% block="stop"
    //% weight=98
    export function controlMotorStop(): void {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% block="read steering correction"
    //% weight=98
    export function readSteeringCorrection(): number {
        return steeringCorrection;
    }
}
