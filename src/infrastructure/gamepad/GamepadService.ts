import { Direction } from '../../domain/types/game.types';

export type GamepadAction = 'move_up' | 'move_down' | 'move_left' | 'move_right' | 'action' | 'cancel' | 'menu';

export class GamepadService {
  private lastPressedTime = 0;
  private readonly debounceMs = 180;

  public pollInput(): GamepadAction | null {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return null;
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0] || gamepads[1];
    if (!gp) return null;

    const now = Date.now();
    if (now - this.lastPressedTime < this.debounceMs) return null;

    const action = this.resolveGamepadAxes(gp) || this.resolveGamepadButtons(gp);
    if (action) this.lastPressedTime = now;
    return action;
  }

  private resolveGamepadAxes(gp: Gamepad): GamepadAction | null {
    const threshold = 0.5;
    const axisX = gp.axes[0] ?? 0;
    const axisY = gp.axes[1] ?? 0;
    if (axisY < -threshold) return 'move_up';
    if (axisY > threshold) return 'move_down';
    if (axisX < -threshold) return 'move_left';
    if (axisX > threshold) return 'move_right';
    return null;
  }

  private resolveGamepadButtons(gp: Gamepad): GamepadAction | null {
    const b = gp.buttons;
    if (b[12]?.pressed) return 'move_up';
    if (b[13]?.pressed) return 'move_down';
    if (b[14]?.pressed) return 'move_left';
    if (b[15]?.pressed) return 'move_right';
    if (b[0]?.pressed) return 'action';
    if (b[1]?.pressed) return 'cancel';
    if (b[9]?.pressed) return 'menu';
    return null;
  }

  public toDirection(action: GamepadAction): Direction | null {
    if (action === 'move_up') return 'up';
    if (action === 'move_down') return 'down';
    if (action === 'move_left') return 'left';
    if (action === 'move_right') return 'right';
    return null;
  }
}
