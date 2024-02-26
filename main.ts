namespace EasyMaqueenPlusV2 {
    let steeringCorrection = 0;
    let distanceCorrection = 0;
    let wheelDiameter = 43;

    //% block="set steering correction %correction (positive number turns more to the right)"
    //% weight=98
    export function setSteeringCorrection(correction: number): void {
        steeringCorrection = correction;
    }

    //% block="set distance correction %correction"
    //% weight=98
    export function setDistanceCorrection(correction: number): void {
        distanceCorrection = correction;
    }

    //% block="set wheel diameter %diameter"
    //% weight=98
    export function setWheelDiameterCorrection(diameter: number): void {
        wheelDiameter = diameter;
    }

    //% group="Basic control"
    //% block="drive %edir speed %speed"
    //% speed.min=0 speed.max=255
    //% weight=99
    export function drive(direction: maqueenPlusV2.MyEnumDir, speed: number): void {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
    }

    //% group="Basic control"
    //% block="drive %edir speed %speed for %seconds microseconds"
    //% speed.min=0 speed.max=255
    //% weight=99
    export function driveTime(direction: maqueenPlusV2.MyEnumDir, speed: number, microseconds: number): void {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
        basic.pause(microseconds);
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Basic control"
    //% block="drive %edir speed %speed for distance %distance"
    //% speed.min=0 speed.max=255
    //% weight=99
    export function driveDistance(direction: maqueenPlusV2.MyEnumDir, speed: number, distance: number): void {
        let microsecondsToRun = getTimeForDistanceAndSpeed(speed, distance * getDistanceCorrectionPercent());
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
        basic.pause(microsecondsToRun);
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Basic control"
    //% block="stop"
    //% weight=98
    export function controlMotorStop(): void {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Advanced control"
    //% block="read steering correction"
    //% weight=98
    export function readSteeringCorrection(): number {
        return steeringCorrection;
    }

    function getTimeForDistanceAndSpeed(speed: number, distance:number) : number
    {
        let degreesOneSecond = 6E-05 * speed * speed * speed - 0.0332 * speed * speed + 6.28*speed - 12.616;
        let distanceOneDegree = wheelDiameter * Math.PI / 360;
        return (distance / (degreesOneSecond * distanceOneDegree)) * 1000;
    }

    function getDistanceCorrectionPercent() : number {
        return (100 + distanceCorrection) / 100;
    }

    function getSteeringCorrectionPercent(speed: number): number {
        let adjustedCorrection = 2E-07 * speed * speed * speed - 9E-05 * speed * speed + 0.0174 * speed - 0.035
        return (100 + (steeringCorrection * adjustedCorrection)) / 100;
    }
}
