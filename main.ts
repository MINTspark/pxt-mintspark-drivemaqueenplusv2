namespace EasyMaqueenPlusV2 {
    let steeringCorrection = 0;
    let distanceCorrection = 0;
    let wheelDiameter = 43;
    let minSpeed = 30;
    let wheelDegreesPerTurnDegree = 2.5;

    //Turn direction enumeration selection
    export enum MyEnumTurnDirection {
        //% block="turn left"
        Left,
        //% block="turn right"
        Right
    };

    //% group="Basic control"
    //% block="drive %edir speed %speed"
    //% speed.min=30 speed.max=255
    //% weight=29
    export function drive(direction: maqueenPlusV2.MyEnumDir, speed: number): void {
        if (speed < minSpeed) { speed = minSpeed; }
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
    }

    //% group="Basic control"
    //% block="drive %edir speed %speed for %seconds seconds"
    //% speed.min=30 speed.max=255
    //% weight=28
    export function driveTime(direction: maqueenPlusV2.MyEnumDir, speed: number, seconds: number): void {
        if (speed < minSpeed) { speed = minSpeed; }
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
        basic.pause(seconds * 1000);
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Basic control"
    //% block="drive %edir speed %speed for distance %distance"
    //% speed.min=30 speed.max=255
    //% weight=27
    export function driveDistance(direction: maqueenPlusV2.MyEnumDir, speed: number, distance: number): void {
        if (speed < minSpeed) { speed = minSpeed; }
        let microsecondsToRun = getTimeMsForDistanceAndSpeed(speed, distance * getDistanceCorrectionPercent());
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, direction, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, direction, speed);
        basic.pause(microsecondsToRun);
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Basic control"
    //% block="stop"
    //% weight=26
    export function controlMotorStop(): void {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Turn Controls"
    //% block="turn %turnDirection for %degrees degrees with speed %speed"
    //% speed.min=30 speed.max=255
    //% weight=29
    export function turn(turnDirection: MyEnumTurnDirection, degrees: number, speed: number): void {
        if (speed < minSpeed) { speed = minSpeed; }

        let leftMotorDirection = maqueenPlusV2.MyEnumDir.Forward;
        let rightMotorDirection = maqueenPlusV2.MyEnumDir.Backward;

        if (turnDirection == MyEnumTurnDirection.Left)
        {
            leftMotorDirection = maqueenPlusV2.MyEnumDir.Backward;
            rightMotorDirection = maqueenPlusV2.MyEnumDir.Forward;
        }

        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, leftMotorDirection, speed * getSteeringCorrectionPercent(speed));
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, rightMotorDirection, speed);
        basic.pause(getTimeMsForDegreesAndSpeed(speed, degrees * wheelDegreesPerTurnDegree));
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }

    //% group="Adjustments"
    //% block="read steering correction \\%"
    //% weight=98
    export function readSteeringCorrection(): number {
        return steeringCorrection;
    }

    //% group="Adjustments"
    //% block="read distance correction \\%"
    //% weight=98
    export function readDistanceCorrection(): number {
        return distanceCorrection;
    }

    //% group="Adjustments"
    //% block="set steering correction %correction \\% (positive number turns more to the right)"
    //% weight=98
    export function setSteeringCorrection(correction: number): void {
        steeringCorrection = correction;
    }

    //% group="Adjustments"
    //% block="set distance correction %correction \\%"
    //% weight=98
    export function setDistanceCorrection(correction: number): void {
        distanceCorrection = correction;
    }

    //% group="Adjustments"
    //% block="set wheel diameter %diameter"
    //% weight=98
    export function setWheelDiameterCorrection(diameter: number): void {
        wheelDiameter = diameter;
    }


    function getTimeMsForDistanceAndSpeed(speed: number, distance:number) : number
    {
        let degreesOneSecond = 6E-05 * speed * speed * speed - 0.0332 * speed * speed + 6.28*speed - 12.616;
        let distanceOneDegree = wheelDiameter * Math.PI / 360;
        return (distance / (degreesOneSecond * distanceOneDegree)) * 1000;
    }

    function getTimeMsForDegreesAndSpeed(speed: number, degrees: number): number {
        let degreesOneSecond = 6E-05 * speed * speed * speed - 0.0332 * speed * speed + 6.28 * speed - 12.616;
        return (1 / degreesOneSecond) * degrees * 1000;
    }

    function getDistanceCorrectionPercent() : number {
        return (100 + distanceCorrection) / 100;
    }

    function getSteeringCorrectionPercent(speed: number): number {
        let adjustedCorrection = 2E-07 * speed * speed * speed - 9E-05 * speed * speed + 0.0174 * speed - 0.035
        return (100 + (steeringCorrection * adjustedCorrection)) / 100;
    }
}
