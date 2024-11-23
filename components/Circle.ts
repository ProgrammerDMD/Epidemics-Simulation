export enum Status {
    INFECTED, SUSCEPTIBLE, RECOVERED
}

export const CIRCLE_RADIUS = 2;
export const RECOVERY_RATE = 1;
export const MAX_RECOVERY_THRESHOLD = 10 * 30; // Amount needed for infected people to recover, 10 seconds recovery for 30 frames

export class Circle {
    x: number;
    y: number;
    angle: number;
    status: Status;
    recoveryThreshold: number;

    constructor(x: number, y: number, angle: number, status: Status, recoveryThreshold: number) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.status = status;
        this.recoveryThreshold = recoveryThreshold;
    }

    overlaps(circle: Circle): boolean {
        const dx = this.x - circle.x;
        const dy = this.y - circle.y;
        const distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= CIRCLE_RADIUS * CIRCLE_RADIUS * 12.5;
    }    

    infectable(): boolean {
        return this.status == Status.SUSCEPTIBLE;
    }

    canRecover(): boolean {
        return this.status == Status.INFECTED && this.recoveryThreshold >= MAX_RECOVERY_THRESHOLD;
    }

    recover(): void {
        if (this.status == Status.INFECTED && this.recoveryThreshold >= MAX_RECOVERY_THRESHOLD) {
            this.status = Status.RECOVERED;
        } else if (this.status == Status.INFECTED) {
            this.recoveryThreshold += RECOVERY_RATE;
        }
    }

}