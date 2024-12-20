export enum Status {
    INFECTED, SUSCEPTIBLE, RECOVERED, DEAD
}

export const CIRCLE_RADIUS = 2;
export const RECOVERY_RATE = 1;

export class Circle {
    x: number;
    y: number;
    angle: number;
    status: Status;
    recoveryThreshold: number;
    maxRecoveryThreshold: number;

    constructor(x: number, y: number, angle: number, status: Status, recoveryThreshold: number, maxRecoveryThreshold: number) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.status = status;
        this.recoveryThreshold = recoveryThreshold;
        this.maxRecoveryThreshold = maxRecoveryThreshold;
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

    recover(): void {
        if (this.status == Status.INFECTED && this.recoveryThreshold >= this.maxRecoveryThreshold) {
            this.status = Status.RECOVERED;
        } else if (this.status == Status.INFECTED) {
            this.recoveryThreshold += RECOVERY_RATE;
        }
    }

    kill(dyingProbabilityPerFrame: number): void {
        if (this.status == Status.INFECTED && Math.random() < dyingProbabilityPerFrame) {
            this.status = Status.DEAD;
        }
    }

}