import { QLearning } from "../scripts/qlearn/Qlerning";
import { math } from "cc";

export class BotLearner {
  private _agent: QLearning;

  public start() {
    const initialState = { x: 0, y: 0 };
    const learningRate = 100;
    const actions = ["forward", "backwards", "left", "right"];

    // eslint-disable-next-line @typescript-eslint/ban-types
    this._agent = new QLearning("name", actions, learningRate);

    // What is the cost of moving to the specified `state` and taking `action`
    this._agent.setCost((state, action) => {
      return 0;
    });

    // What is the reward for `state`
    this._agent.setReward((state) => {
      //const cstState = state;
      const x = state.x - 5;
      const y = state.y - 8;
      return 1000 / Math.sqrt(x * x + y * y);
    });

    // Generate the next state given `state` and taking `action`
    this._agent.setStateGenerator((state, action) => {
      const newState = state;
      switch (action) {
        case "forward":
          newState.y++;
          break;
        case "backwards":
          newState.y--;
          break;
        case "left":
          newState.x++;
          break;
        case "right":
          newState.x--;
          break;
        default:
          break;
      }

      return newState;
    });

    // Let's get going!
    this._agent.start(initialState);
  }

  update() {
    this._agent.perceiveState().step().perceiveState().learn();
  }
}
